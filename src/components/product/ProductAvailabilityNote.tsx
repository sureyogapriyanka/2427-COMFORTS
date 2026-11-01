import type { Product } from '../../data/catalog';

export function ProductAvailabilityNote({ product }: { product: Product }) {
  const availability = product.inventoryStatus ?? 'unverified';
  const message = availability === 'demo'
    ? 'Preview product · price and stock not confirmed'
    : availability === 'in_stock'
      ? 'In stock'
      : availability === 'out_of_stock'
        ? 'Sold out in all confirmed sizes'
        : 'Stock not confirmed';

  return (
    <p
      className={`mt-2 text-[11px] leading-4 ${
        availability === 'out_of_stock'
          ? 'text-elan-danger'
          : 'text-elan-muted'
      }`}
    >
      {message}
    </p>
  );
}
