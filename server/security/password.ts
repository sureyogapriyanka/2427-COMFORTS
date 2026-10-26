import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
const SALT_BYTES = 16;
const KEY_BYTES = 64;
const COST = 16_384;

function deriveKey(password: string, salt: Buffer, keyLength: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(password, salt, keyLength, { N: COST }, (error, key) => {
      if (error) reject(error);
      else resolve(key as Buffer);
    });
  });
}

export function isStrongPassword(value: string): boolean {
  return value.length >= 12 && value.length <= 128 &&
    /[A-Za-z]/.test(value) && /\d/.test(value);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES);
  const derivedKey = await deriveKey(password, salt, KEY_BYTES);
  return `scrypt$${COST}$${salt.toString('hex')}$${derivedKey.toString('hex')}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [algorithm, cost, saltHex, keyHex] = storedHash.split('$');
  if (
    algorithm !== 'scrypt' ||
    Number(cost) !== COST ||
    !/^[\da-f]{32}$/i.test(saltHex ?? '') ||
    !/^[\da-f]{128}$/i.test(keyHex ?? '')
  ) {
    return false;
  }

  const expected = Buffer.from(keyHex, 'hex');
  const actual = await deriveKey(password, Buffer.from(saltHex, 'hex'), expected.length);
  return timingSafeEqual(actual, expected);
}
