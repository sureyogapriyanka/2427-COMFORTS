import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import type { Server } from 'node:http';
import { Product } from '../models/Product';
import { User } from '../models/User';
import { signSession } from '../security/jwt';
import {
  calculateInventorySummary,
  getInventoryProductStatus,
  validateInventoryThreshold,
  validateSizeInventory,
} from '../services/sizeInventory';
import {
  getProductInventoryStatus,
  getSizeAvailability,
} from '../../src/data/sizeInventory';

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
  for (const path of [
    '/cart',
    '/wishlist',
    '/orders',
    '/admin/overview',
    '/admin/inventory',
    '/admin/inventory/history',
    '/admin/products/507f1f77bcf86cd799439011/inventory',
  ]) {
    const response = await request(path);
    assert.equal(response.status, 401, `${path} should reject an unauthenticated request`);
  }
  assert.equal((await request('/orders', 'POST', { items: [] })).status, 401);
});

test('size inventory accepts confirmed zero/positive counts and rejects invalid or unknown sizes', () => {
  assert.deepEqual(validateSizeInventory(['S', 'M', 'L'], { S: 0, M: 7 }), {
    inventory: { S: 0, M: 7 },
  });
  assert.match(validateSizeInventory(['S', 'M'], { XL: 2 }).error ?? '', /not available/);
  assert.match(validateSizeInventory(['S'], { S: -1 }).error ?? '', /non-negative whole number/);
  assert.match(validateSizeInventory(['S'], { S: 1.5 }).error ?? '', /non-negative whole number/);
  assert.match(validateSizeInventory(['S'], null).error ?? '', /must be an object/);
});

test('inventory summaries distinguish confirmed, low, sold-out and unconfirmed size variants', () => {
  const products = [
    {
      _id: 'demo',
      sku: 'DEMO',
      name: 'Demo product',
      category: 'underwear',
      sizes: ['S', 'M'],
      images: [],
      isDemoContent: true,
      sizeInventory: [{ size: 'S', quantity: 0 }],
    },
    {
      _id: 'verified',
      sku: 'VERIFIED',
      name: 'Verified product',
      category: 'underwear',
      sizes: ['S', 'M', 'L', 'XL'],
      images: [],
      isDemoContent: false,
      lowStockThreshold: 5,
      sizeInventory: [
        { size: 'S', quantity: 0 },
        { size: 'M', quantity: 3 },
        { size: 'L', quantity: 25 },
      ],
    },
  ];
  assert.deepEqual(calculateInventorySummary(products), {
    totalProducts: 2,
    confirmedStockUnits: 28,
    lowStockVariants: 1,
    soldOutVariants: 1,
    unconfirmedVariants: 3,
  });
  assert.equal(getInventoryProductStatus(products[0]), 'unconfirmed');
  assert.equal(getInventoryProductStatus(products[1]), 'unconfirmed');
  assert.equal(validateInventoryThreshold(10), 10);
  assert.equal(validateInventoryThreshold(0), null);
  assert.equal(validateInventoryThreshold(1.5), null);
  assert.equal(validateInventoryThreshold(10001), null);
});

test('size stock presentation distinguishes unknown, low, available, and sold-out states', () => {
  const product = {
    isDemoContent: false,
    sizes: ['S', 'M', 'L', 'XL'],
    sizeInventory: { S: 0, M: 4, L: 16 },
  };
  assert.deepEqual(getSizeAvailability(product, 'XL'), { status: 'unknown' });
  assert.deepEqual(getSizeAvailability(product, 'S'), { status: 'sold_out', quantity: 0 });
  assert.deepEqual(getSizeAvailability(product, 'M'), { status: 'low', quantity: 4 });
  assert.deepEqual(getSizeAvailability(product, 'L'), { status: 'available', quantity: 16 });
  assert.deepEqual(getSizeAvailability({ ...product, lowStockThreshold: 20 }, 'L'), { status: 'low', quantity: 16 });
  assert.deepEqual(getSizeAvailability({ ...product, isDemoContent: true }, 'L'), { status: 'unknown' });
  assert.equal(getProductInventoryStatus(product), 'in_stock');
  assert.equal(getProductInventoryStatus({
    ...product,
    sizeInventory: { S: 0, M: 0, L: 0, XL: 0 },
  }), 'out_of_stock');
  assert.equal(getProductInventoryStatus({
    ...product,
    isDemoContent: true,
    sizeInventory: { S: 0, M: 0, L: 0, XL: 0 },
  }), 'demo');
});

test('authorized admins can update verified per-size inventory without accepting demo products', async () => {
  const userId = '507f1f77bcf86cd799439011';
  const originalUserFindById = Object.getOwnPropertyDescriptor(User, 'findById');
  const originalProductFindById = Object.getOwnPropertyDescriptor(Product, 'findById');
  const originalProductFindOneAndUpdate = Object.getOwnPropertyDescriptor(Product, 'findOneAndUpdate');
  let versionFilter: { __v?: number } | undefined;
  let inventoryWriteCount = 0;
  const product = {
    _id: '507f1f77bcf86cd799439012',
    id: '507f1f77bcf86cd799439012',
    __v: 2,
    isDemoContent: false,
    sizes: ['S', 'M', 'L'],
    sizeInventory: [{ size: 'L', quantity: 0 }],
    inventoryHistory: [],
  };
  Object.defineProperty(User, 'findById', {
    configurable: true,
    value: () => ({
      select: async () => ({
        id: userId,
        email: 'admin@example.com',
        role: 'admin',
        tokenVersion: 0,
      }),
    }),
  });
  Object.defineProperty(Product, 'findById', {
    configurable: true,
    value: async () => product,
  });
  Object.defineProperty(Product, 'findOneAndUpdate', {
    configurable: true,
    value: async (
      filter: { __v?: number },
      update: {
        $set: { sizeInventory: { size: string; quantity: number }[] };
        $push: { inventoryHistory: { $each: {
          adminId: string;
          adminEmail: string;
          size: string;
          previousQuantity: number | null;
          newQuantity: number;
          reason: string;
          createdAt: Date;
        }[] } };
      }
    ) => {
      inventoryWriteCount += 1;
      versionFilter = filter;
      return {
        ...product,
        sizeInventory: update.$set.sizeInventory,
        inventoryHistory: update.$push.inventoryHistory.$each,
      };
    },
  });

  try {
    const response = await fetch(`${baseUrl}/api/admin/products/${product.id}/inventory`, {
      method: 'PATCH',
      headers: {
        cookie: `elan_session=${signSession(userId, 0)}`,
        origin: baseUrl,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sizeInventory: { S: 0, M: 6 }, reason: 'Approved stock count' }),
    });
    assert.equal(response.status, 200);
    assert.equal(versionFilter?.__v, 2);
    const updated = (await response.json()).data;
    assert.deepEqual(updated.sizeInventory, [
      { size: 'L', quantity: 0 },
      { size: 'S', quantity: 0 },
      { size: 'M', quantity: 6 },
    ]);
    assert.equal(updated.inventoryHistory.length, 2);
    assert.equal(updated.inventoryHistory.find((entry: { size: string }) => entry.size === 'S').previousQuantity, null);
    assert.equal(updated.inventoryHistory.find((entry: { size: string }) => entry.size === 'M').newQuantity, 6);
    assert.equal(versionFilter?.__v, 2);
    product.isDemoContent = true;
    const demoResponse = await fetch(`${baseUrl}/api/admin/products/${product.id}/inventory`, {
      method: 'PATCH',
      headers: {
        cookie: `elan_session=${signSession(userId, 0)}`,
        origin: baseUrl,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sizeInventory: { S: 3 }, reason: 'Rejected demo stock' }),
    });
    assert.equal(demoResponse.status, 409);
    assert.equal(inventoryWriteCount, 1);
  } finally {
    if (originalUserFindById) Object.defineProperty(User, 'findById', originalUserFindById);
    else Reflect.deleteProperty(User, 'findById');
    if (originalProductFindById) Object.defineProperty(Product, 'findById', originalProductFindById);
    else Reflect.deleteProperty(Product, 'findById');
    if (originalProductFindOneAndUpdate) Object.defineProperty(Product, 'findOneAndUpdate', originalProductFindOneAndUpdate);
    else Reflect.deleteProperty(Product, 'findOneAndUpdate');
  }
});

test('customer role cannot read inventory or change stock', async () => {
  const userId = '507f1f77bcf86cd799439011';
  const originalFindById = Object.getOwnPropertyDescriptor(User, 'findById');
  const originalProductFindById = Object.getOwnPropertyDescriptor(Product, 'findById');
  let productReads = 0;
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
  Object.defineProperty(Product, 'findById', {
    configurable: true,
    value: async () => {
      productReads += 1;
      return null;
    },
  });

  try {
    const cookie = `elan_session=${signSession(userId, 0)}`;
    const readResponse = await fetch(`${baseUrl}/api/admin/inventory`, { headers: { cookie } });
    assert.equal(readResponse.status, 403);
    const updateResponse = await fetch(`${baseUrl}/api/admin/products/507f1f77bcf86cd799439012/inventory`, {
      method: 'PATCH',
      headers: {
        cookie,
        origin: baseUrl,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ size: 'M', quantity: 5, reason: 'Unauthorized attempt' }),
    });
    assert.equal(updateResponse.status, 403);
    assert.equal(productReads, 0);
  } finally {
    if (originalFindById) Object.defineProperty(User, 'findById', originalFindById);
    else Reflect.deleteProperty(User, 'findById');
    if (originalProductFindById) Object.defineProperty(Product, 'findById', originalProductFindById);
    else Reflect.deleteProperty(Product, 'findById');
  }
});

test('inventory endpoint rejects negative, fractional, and invalid-size adjustments', async () => {
  const userId = '507f1f77bcf86cd799439011';
  const originalUserFindById = Object.getOwnPropertyDescriptor(User, 'findById');
  const originalProductFindById = Object.getOwnPropertyDescriptor(Product, 'findById');
  const originalProductFindOneAndUpdate = Object.getOwnPropertyDescriptor(Product, 'findOneAndUpdate');
  const product = {
    _id: '507f1f77bcf86cd799439012',
    id: '507f1f77bcf86cd799439012',
    __v: 0,
    isDemoContent: false,
    sizes: ['S', 'M'],
    sizeInventory: [{ size: 'S', quantity: 1 }],
    inventoryHistory: [],
  };
  let writes = 0;
  Object.defineProperty(User, 'findById', {
    configurable: true,
    value: () => ({
      select: async () => ({ id: userId, email: 'admin@example.com', role: 'admin', tokenVersion: 0 }),
    }),
  });
  Object.defineProperty(Product, 'findById', { configurable: true, value: async () => product });
  Object.defineProperty(Product, 'findOneAndUpdate', {
    configurable: true,
    value: async () => {
      writes += 1;
      return product;
    },
  });
  try {
    const headers = {
      cookie: `elan_session=${signSession(userId, 0)}`,
      origin: baseUrl,
      'Content-Type': 'application/json',
    };
    for (const body of [
      { size: 'S', adjustment: -2, reason: 'Remove excess' },
      { size: 'M', quantity: 1.5, reason: 'Bad count' },
      { size: 'XL', quantity: 2, reason: 'Unknown size' },
    ]) {
      const response = await fetch(`${baseUrl}/api/admin/products/${product.id}/inventory`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(body),
      });
      assert.equal(response.status, 400);
    }
    assert.equal(writes, 0);
  } finally {
    if (originalUserFindById) Object.defineProperty(User, 'findById', originalUserFindById);
    else Reflect.deleteProperty(User, 'findById');
    if (originalProductFindById) Object.defineProperty(Product, 'findById', originalProductFindById);
    else Reflect.deleteProperty(Product, 'findById');
    if (originalProductFindOneAndUpdate) Object.defineProperty(Product, 'findOneAndUpdate', originalProductFindOneAndUpdate);
    else Reflect.deleteProperty(Product, 'findOneAndUpdate');
  }
});

test('concurrent inventory adjustments use optimistic versioning and record one audit event', async () => {
  const userId = '507f1f77bcf86cd799439011';
  const productId = '507f1f77bcf86cd799439012';
  const originalUserFindById = Object.getOwnPropertyDescriptor(User, 'findById');
  const originalProductFindById = Object.getOwnPropertyDescriptor(Product, 'findById');
  const originalProductFindOneAndUpdate = Object.getOwnPropertyDescriptor(Product, 'findOneAndUpdate');
  const state = {
    version: 3,
    sizeInventory: [{ size: 'M', quantity: 5 }],
    inventoryHistory: [] as { size: string; previousQuantity: number | null; newQuantity: number; reason: string; adminEmail: string }[],
  };
  let reads = 0;
  let releaseReads!: () => void;
  const bothReads = new Promise<void>((resolve) => { releaseReads = resolve; });
  Object.defineProperty(User, 'findById', {
    configurable: true,
    value: () => ({
      select: async () => ({ id: userId, email: 'admin@example.com', role: 'admin', tokenVersion: 0 }),
    }),
  });
  Object.defineProperty(Product, 'findById', {
    configurable: true,
    value: async () => {
      const snapshot = {
        _id: productId,
        id: productId,
        __v: state.version,
        isDemoContent: false,
        sizes: ['M'],
        sizeInventory: [...state.sizeInventory],
        inventoryHistory: [...state.inventoryHistory],
      };
      reads += 1;
      if (reads === 2) releaseReads();
      await bothReads;
      return snapshot;
    },
  });
  Object.defineProperty(Product, 'findOneAndUpdate', {
    configurable: true,
    value: async (
      filter: { __v?: number },
      update: {
        $set: { sizeInventory: { size: string; quantity: number }[] };
        $push: { inventoryHistory: { $each: typeof state.inventoryHistory } };
      },
    ) => {
      if (filter.__v !== state.version) return null;
      state.version += 1;
      state.sizeInventory = update.$set.sizeInventory;
      state.inventoryHistory.push(...update.$push.inventoryHistory.$each);
      return {
        id: productId,
        sizeInventory: state.sizeInventory,
        inventoryHistory: state.inventoryHistory,
      };
    },
  });
  try {
    const sendAdjustment = () => fetch(`${baseUrl}/api/admin/products/${productId}/inventory`, {
      method: 'PATCH',
      headers: {
        cookie: `elan_session=${signSession(userId, 0)}`,
        origin: baseUrl,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ size: 'M', adjustment: 1, reason: 'Concurrent restock' }),
    });
    const responses = await Promise.all([sendAdjustment(), sendAdjustment()]);
    assert.deepEqual(responses.map((response) => response.status).sort(), [200, 409]);
    assert.equal(state.sizeInventory[0].quantity, 6);
    assert.equal(state.inventoryHistory.length, 1);
    assert.equal(state.inventoryHistory[0].adminEmail, 'admin@example.com');
    assert.equal(state.inventoryHistory[0].previousQuantity, 5);
    assert.equal(state.inventoryHistory[0].newQuantity, 6);
  } finally {
    if (originalUserFindById) Object.defineProperty(User, 'findById', originalUserFindById);
    else Reflect.deleteProperty(User, 'findById');
    if (originalProductFindById) Object.defineProperty(Product, 'findById', originalProductFindById);
    else Reflect.deleteProperty(Product, 'findById');
    if (originalProductFindOneAndUpdate) Object.defineProperty(Product, 'findOneAndUpdate', originalProductFindOneAndUpdate);
    else Reflect.deleteProperty(Product, 'findOneAndUpdate');
  }
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

test('product pagination uses a stable unique tie-breaker for every page', async () => {
  const originalFind = Object.getOwnPropertyDescriptor(Product, 'find');
  const originalCount = Object.getOwnPropertyDescriptor(Product, 'countDocuments');
  let sortOptions: Record<string, number> | undefined;
  const query = {
    sort(options: Record<string, number>) { sortOptions = options; return this; },
    skip() { return this; },
    limit() { return this; },
    lean: async () => [],
  };
  Object.defineProperty(Product, 'find', { configurable: true, value: () => query });
  Object.defineProperty(Product, 'countDocuments', { configurable: true, value: async () => 0 });

  try {
    const response = await request('/products?page=1&limit=1');
    assert.equal(response.status, 200);
    assert.deepEqual(sortOptions, { createdAt: -1, _id: 1 });
  } finally {
    if (originalFind) Object.defineProperty(Product, 'find', originalFind);
    else Reflect.deleteProperty(Product, 'find');
    if (originalCount) Object.defineProperty(Product, 'countDocuments', originalCount);
    else Reflect.deleteProperty(Product, 'countDocuments');
  }
});

test('contact and newsletter endpoints reject invalid submissions', async () => {
  const contact = await request('/contact', 'POST', { name: 'A', email: 'bad', topic: '', message: 'short' });
  assert.equal(contact.status, 400);

  const newsletter = await request('/newsletter', 'POST', { email: 'person@example.com' });
  assert.equal(newsletter.status, 400);
});
