import { config as loadEnv } from 'dotenv';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { AdminProvisioning } from '../models/AdminProvisioning';
import { User } from '../models/User';

const explicitlyConfiguredMongoUri = process.env.MONGODB_URI;
loadEnv();

const BOOTSTRAP_KEY = 'initial-admin-v1';
const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function provisionAdmin() {
  if (process.env.ALLOW_ADMIN_PROVISIONING !== 'true') {
    throw new Error('Set ALLOW_ADMIN_PROVISIONING=true for this one-time owner-approved operation.');
  }

  const email = process.env.ADMIN_PROVISION_EMAIL?.trim().toLowerCase() ?? '';
  if (!validEmail.test(email)) {
    throw new Error('Set ADMIN_PROVISION_EMAIL to an existing customer account email.');
  }

  if (!explicitlyConfiguredMongoUri) {
    throw new Error('Set MONGODB_URI explicitly to the owner-approved database; local fallback databases are not allowed.');
  }
  process.env.MONGODB_URI = explicitlyConfiguredMongoUri;

  if (!stdin.isTTY || !stdout.isTTY) {
    throw new Error('Run this command in an interactive owner-controlled terminal.');
  }

  const confirmation = createInterface({ input: stdin, output: stdout });
  try {
    const answer = await confirmation.question(`Type "PROVISION ADMIN ${email}" to continue: `);
    if (answer !== `PROVISION ADMIN ${email}`) {
      throw new Error('Confirmation did not match; no account was changed.');
    }
  } finally {
    confirmation.close();
  }

  await connectDB();
  await AdminProvisioning.init();

  const customer = await User.findOne({ email, role: 'customer' }).select('_id').lean();
  if (!customer) {
    throw new Error('No existing customer account matches the requested email; register it normally first.');
  }

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const existingAdmin = await User.exists({ role: 'admin' }).session(session);
      const existingProvision = await AdminProvisioning.exists({ _id: BOOTSTRAP_KEY }).session(session);
      if (existingAdmin || existingProvision) {
        throw new Error('Initial administrator provisioning has already been completed.');
      }

      await AdminProvisioning.create(
        [{ _id: BOOTSTRAP_KEY, userId: customer._id }],
        { session }
      );
      const result = await User.updateOne(
        { _id: customer._id, role: 'customer' },
        { $set: { role: 'admin' } },
        { session }
      );
      if (result.modifiedCount !== 1) {
        throw new Error('The target account changed during provisioning; no role change was committed.');
      }
    });
  } finally {
    await session.endSession();
  }

  console.log('Initial administrator provisioned. Sign in using the existing account password.');
}

provisionAdmin()
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : 'Unknown provisioning error.';
    console.error(`[2427 ÉLAN Admin Provisioning] ${message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
