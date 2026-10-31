import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import type { Server } from 'node:http';
import { User } from '../models/User';
import { signSession } from '../security/jwt';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'unit-test-only-jwt-secret-with-at-least-32-bytes';

const { default: app } = await import('../index');
let server: Server;
let baseUrl = '';

before(async () => {
  server = app.listen(0);
  await new Promise<void>((resolve) => server.once('listening', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('API test server did not bind to a TCP port.');
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  server.closeAllConnections();
  await new Promise<void>((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  });
});

async function request(path: string, method = 'GET', body?: unknown) {
  return fetch(`${baseUrl}/api${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
}

test('auth endpoints validate input before database access', async () => {
  const weakRegistration = await request('/auth/register', 'POST', {
    name: 'A',
    email: 'not-an-email',
    password: 'weak',
  });
  assert.equal(weakRegistration.status, 400);

  const invalidLogin = await request('/auth/login', 'POST', {
    email: 'invalid',
    password: '',
  });
  assert.equal(invalidLogin.status, 400);

  const prefixedLogin = await fetch(`${baseUrl}/2427-COMFORTS/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'invalid', password: '' }),
  });
  assert.equal(prefixedLogin.status, 400);
});

test('cart, wishlist, orders and admin routes require verified sessions', async () => {
  for (const path of ['/cart', '/wishlist', '/orders', '/admin/overview']) {
    const response = await request(path);
    assert.equal(response.status, 401, `${path} should reject an unauthenticated request`);
  }
  assert.equal((await request('/orders', 'POST', { items: [] })).status, 401);
});

test('authenticated order submission stays disabled until commerce rules are approved', async () => {
  const userId = '507f1f77bcf86cd799439011';
  const originalFindById = Object.getOwnPropertyDescriptor(User, 'findById');
  Object.defineProperty(User, 'findById', {
    configurable: true,
    value: () => ({
      select: async () => ({
        id: userId,
        email: 'customer@example.com',
        role: 'customer',
        tokenVersion: 0,
      }),
    }),
  });

  try {
    const response = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: {
        cookie: `elan_session=${signSession(userId, 0)}`,
        origin: baseUrl,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items: [] }),
    });
    assert.equal(response.status, 503);
    assert.match((await response.json()).message, /Order submission is disabled/);
  } finally {
    if (originalFindById) {
      Object.defineProperty(User, 'findById', originalFindById);
    } else {
      Reflect.deleteProperty(User, 'findById');
    }
  }
});

test('cookie-authenticated writes require an allowed request origin', async () => {
  const response = await fetch(`${baseUrl}/api/cart`, {
    method: 'PUT',
    headers: {
      cookie: 'elan_session=not-a-valid-session',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items: [] }),
  });
  assert.equal(response.status, 403);
});

test('product search rejects invalid filters without a database query', async () => {
  assert.equal((await request('/products?gender=other')).status, 400);
  assert.equal((await request('/products?page=0')).status, 400);
});

test('contact and newsletter endpoints reject invalid submissions', async () => {
  const contact = await request('/contact', 'POST', { name: 'A', email: 'bad', topic: '', message: 'short' });
  assert.equal(contact.status, 400);

  const newsletter = await request('/newsletter', 'POST', { email: 'person@example.com' });
  assert.equal(newsletter.status, 400);
});
