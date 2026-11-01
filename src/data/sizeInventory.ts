import type { Product } from './catalog';

export type SizeAvailability =
  | { status: 'unknown' }
  | { status: 'available'; quantity: number }
  | { status: 'low'; quantity: number }
  | { status: 'sold_out'; quantity: 0 };

export function getSizeAvailability(
  product: Pick<Product, 'isDemoContent' | 'sizeInventory'>,
  size: string,
): SizeAvailability {
  const quantity = product.isDemoContent ? undefined : product.sizeInventory?.[size];
  if (typeof quantity !== 'number' || !Number.isSafeInteger(quantity) || quantity < 0) {
    return { status: 'unknown' };
  }
  if (quantity === 0) return { status: 'sold_out', quantity: 0 };
  if (quantity <= 10) return { status: 'low', quantity };
  return { status: 'available', quantity };
}

export function getProductInventoryStatus(
  product: Pick<Product, 'sizes' | 'sizeInventory' | 'isDemoContent'>,
): NonNullable<Product['inventoryStatus']> {
  if (product.isDemoContent) return 'demo';
  if (!product.sizes.length) return 'unverified';

  const quantities = product.sizes.map((size) => product.sizeInventory?.[size]);
  if (quantities.every((quantity) => quantity === 0)) return 'out_of_stock';
  if (quantities.some((quantity) => typeof quantity === 'number' && quantity > 0)) return 'in_stock';
  return 'unverified';
}
