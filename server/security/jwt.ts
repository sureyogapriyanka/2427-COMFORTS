import { createHmac, timingSafeEqual } from 'node:crypto';

export interface SessionClaims {
  sub: string;
  ver: number;
  iat: number;
  exp: number;
}

const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString('base64url');

function signingKey(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || Buffer.byteLength(secret) < 32) {
    throw new Error('JWT_SECRET must contain at least 32 bytes.');
  }
  return secret;
}

export function signSession(userId: string, tokenVersion: number, now = Date.now()): string {
  const header = encode({ alg: 'HS256', typ: 'JWT' });
  const issuedAt = Math.floor(now / 1000);
  const payload = encode({ sub: userId, ver: tokenVersion, iat: issuedAt, exp: issuedAt + 60 * 60 * 24 * 7 });
  const unsigned = `${header}.${payload}`;
  const signature = createHmac('sha256', signingKey()).update(unsigned).digest('base64url');
  return `${unsigned}.${signature}`;
}

export function verifySession(token: string, now = Date.now()): SessionClaims | null {
  try {
    const [headerPart, payloadPart, signature] = token.split('.');
    if (!headerPart || !payloadPart || !signature || token.split('.').length !== 3) return null;
    const header = JSON.parse(Buffer.from(headerPart, 'base64url').toString()) as { alg?: string };
    if (header.alg !== 'HS256') return null;
    const expected = createHmac('sha256', signingKey())
      .update(`${headerPart}.${payloadPart}`)
      .digest();
    const received = Buffer.from(signature, 'base64url');
    if (received.length !== expected.length || !timingSafeEqual(received, expected)) return null;
    const claims = JSON.parse(Buffer.from(payloadPart, 'base64url').toString()) as SessionClaims;
    const timestamp = Math.floor(now / 1000);
    if (
      typeof claims.sub !== 'string' ||
      !Number.isInteger(claims.ver) ||
      !Number.isInteger(claims.exp) ||
      claims.exp <= timestamp ||
      claims.iat > timestamp + 60
    ) return null;
    return claims;
  } catch {
    return null;
  }
}
