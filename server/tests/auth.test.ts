import assert from 'node:assert/strict';
import { test } from 'node:test';
import { signSession, verifySession } from '../security/jwt';
import { hashPassword, isStrongPassword, verifyPassword } from '../security/password';
import { requireAdmin } from '../middleware/authMiddleware';

process.env.JWT_SECRET = 'unit-test-only-jwt-secret-with-at-least-32-bytes';

test('password policy and scrypt verification reject incorrect values', async () => {
  assert.equal(isStrongPassword('Short1'), false);
  assert.equal(isStrongPassword('strongpassword123'), true);
  const digest = await hashPassword('strongpassword123');
  assert.equal(await verifyPassword('strongpassword123', digest), true);
  assert.equal(await verifyPassword('wrongpassword123', digest), false);
});

test('session tokens verify, expire, and reject tampering', () => {
  const now = 1_700_000_000_000;
  const token = signSession('user-id', 0, now);
  assert.equal(verifySession(token, now)?.sub, 'user-id');
  assert.equal(verifySession(token, now + 8 * 24 * 60 * 60 * 1000), null);
  assert.equal(verifySession(`${token.slice(0, -1)}x`, now), null);
});

test('administrator middleware rejects customers and permits admins', () => {
  let customerStatus = 0;
  let nextCalled = false;
  const response = {
    status(value: number) { customerStatus = value; return this; },
    json() { return this; },
  };
  requireAdmin(
    { authUser: { id: 'customer', role: 'customer', email: 'customer@example.com' } } as never,
    response as never,
    () => { nextCalled = true; }
  );
  assert.equal(customerStatus, 403);
  assert.equal(nextCalled, false);

  requireAdmin(
    { authUser: { id: 'admin', role: 'admin', email: 'admin@example.com' } } as never,
    response as never,
    () => { nextCalled = true; }
  );
  assert.equal(nextCalled, true);
});
