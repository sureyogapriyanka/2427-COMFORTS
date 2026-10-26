import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { test } from 'node:test';
import { calculateOrderTotals } from '../services/orderPricing';
import { verifyRazorpayPaymentSignature } from '../security/razorpay';

test('calculates totals from prices supplied by trusted server-side product data', () => {
  assert.deepEqual(
    calculateOrderTotals([{ unitPrice: 499, quantity: 2 }, { unitPrice: 799, quantity: 1 }], 99, 100),
    { subtotal: 1797, discount: 100, shipping: 99, total: 1796 }
  );
  assert.throws(() => calculateOrderTotals([], 99), /invalid values/);
  assert.throws(() => calculateOrderTotals([{ unitPrice: 200, quantity: 1 }], 0, 201), /exceed/);
});

test('verifies Razorpay-compatible payment signatures without enabling charges', () => {
  const secret = 'provider-secret-test';
  const orderId = 'order_test';
  const paymentId = 'pay_test';
  const signature = createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  assert.equal(verifyRazorpayPaymentSignature(orderId, paymentId, signature, secret), true);
  assert.equal(verifyRazorpayPaymentSignature(orderId, paymentId, signature, 'wrong-secret'), false);
});
