export type SizeInventory = Record<string, number>;

export function validateSizeInventory(
  sizes: readonly string[],
  input: unknown,
): { inventory: SizeInventory; error?: never } | { inventory?: never; error: string } {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { error: 'Size inventory must be an object keyed by product size.' };
  }

  const entries = Object.entries(input);
  if (entries.length === 0) {
    return { error: 'Provide at least one size quantity.' };
  }

  const inventory: SizeInventory = {};
  for (const [size, quantity] of entries) {
    if (!sizes.includes(size)) {
      return { error: `Size "${size}" is not available for this product.` };
    }
    if (typeof quantity !== 'number' || !Number.isSafeInteger(quantity) || quantity < 0) {
      return { error: `Quantity for size "${size}" must be a non-negative whole number.` };
    }
    inventory[size] = quantity;
  }

  return { inventory };
}
