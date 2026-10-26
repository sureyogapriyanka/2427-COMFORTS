import { createHmac, timingSafeEqual } from 'node:crypto';

export function verifyRazorpayPaymentSignature(
  orderId: string,
  paymentId: string,
  providedSignature: string,
  secret: string
): boolean {
  if (!orderId || !paymentId || !secret || !/^[\da-f]{64}$/i.test(providedSignature)) return false;
  const expected = createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest();
  const received = Buffer.from(providedSignature, 'hex');
  return received.length === expected.length && timingSafeEqual(received, expected);
}
