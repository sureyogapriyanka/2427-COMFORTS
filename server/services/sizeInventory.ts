export type SizeInventory = Record<string, number>;

export interface InventoryProductSnapshot {
  _id: string;
  catalogId?: string;
  sku: string;
  name: string;
  category: string;
  sizes: string[];
  images: string[];
  isDemoContent: boolean;
  sizeInventory?: { size: string; quantity: number }[];
  lowStockThreshold?: number;
}

export interface InventorySummary {
  totalProducts: number;
  confirmedStockUnits: number;
  lowStockVariants: number;
  soldOutVariants: number;
  unconfirmedVariants: number;
}

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

export function calculateInventorySummary(
  products: readonly InventoryProductSnapshot[],
): InventorySummary {
  return products.reduce<InventorySummary>((summary, product) => {
    summary.totalProducts += 1;
    const threshold = typeof product.lowStockThreshold === 'number' &&
      Number.isSafeInteger(product.lowStockThreshold) &&
      product.lowStockThreshold > 0
      ? product.lowStockThreshold
      : 10;
    const inventory = new Map(
      (product.sizeInventory ?? []).map(({ size, quantity }) => [size, quantity]),
    );

    for (const size of product.sizes) {
      const quantity = product.isDemoContent !== false ? undefined : inventory.get(size);
      if (typeof quantity !== 'number' || !Number.isSafeInteger(quantity) || quantity < 0) {
        summary.unconfirmedVariants += 1;
      } else if (quantity === 0) {
        summary.soldOutVariants += 1;
      } else {
        summary.confirmedStockUnits += quantity;
        if (quantity <= threshold) summary.lowStockVariants += 1;
      }
    }

    return summary;
  }, {
    totalProducts: 0,
    confirmedStockUnits: 0,
    lowStockVariants: 0,
    soldOutVariants: 0,
    unconfirmedVariants: 0,
  });
}

export function getInventoryProductStatus(
  product: Pick<InventoryProductSnapshot, 'isDemoContent' | 'sizes' | 'sizeInventory' | 'lowStockThreshold'>,
): 'unconfirmed' | 'low_stock' | 'out_of_stock' | 'in_stock' {
  if (product.isDemoContent !== false || product.sizes.length === 0) return 'unconfirmed';

  const inventory = new Map(
    (product.sizeInventory ?? []).map(({ size, quantity }) => [size, quantity]),
  );
  const quantities = product.sizes.map((size) => inventory.get(size));
  if (quantities.some((quantity) => quantity === undefined)) return 'unconfirmed';
  if (quantities.every((quantity) => quantity === 0)) return 'out_of_stock';

  const threshold = typeof product.lowStockThreshold === 'number' &&
    Number.isSafeInteger(product.lowStockThreshold) &&
    product.lowStockThreshold > 0
    ? product.lowStockThreshold
    : 10;
  return quantities.some((quantity) => typeof quantity === 'number' && quantity > 0 && quantity <= threshold)
    ? 'low_stock'
    : 'in_stock';
}

export function validateInventoryThreshold(input: unknown): number | null {
  return typeof input === 'number' &&
    Number.isSafeInteger(input) &&
    input >= 1 &&
    input <= 10000
    ? input
    : null;
}
