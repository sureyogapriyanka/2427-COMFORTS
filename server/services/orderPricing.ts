export interface PricedLine {
  unitPrice: number;
  quantity: number;
}

export interface OrderTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

export function calculateOrderTotals(
  lines: PricedLine[],
  shipping: number,
  discount = 0
): OrderTotals {
  if (
    lines.length === 0 ||
    lines.some((line) =>
      !Number.isSafeInteger(line.unitPrice) ||
      line.unitPrice < 0 ||
      !Number.isInteger(line.quantity) ||
      line.quantity < 1 ||
      line.quantity > 99
    ) ||
    !Number.isSafeInteger(shipping) ||
    shipping < 0 ||
    !Number.isSafeInteger(discount) ||
    discount < 0
  ) {
    throw new Error('Order totals contain invalid values.');
  }
  const subtotal = lines.reduce((total, line) => total + line.unitPrice * line.quantity, 0);
  if (!Number.isSafeInteger(subtotal)) throw new Error('Order subtotal exceeds supported currency precision.');
  if (discount > subtotal) throw new Error('Discount cannot exceed the subtotal.');
  const total = subtotal - discount + shipping;
  if (!Number.isSafeInteger(total)) throw new Error('Order total exceeds supported currency precision.');
  return { subtotal, discount, shipping, total };
}
