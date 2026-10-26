import type { Product } from '../../data/catalog';

export function ProductAvailabilityNote({ product }: { product: Product }) {
  const availability = product.inventoryStatus ?? 'unverified';
  const message = availability === 'demo'
    ? 'Demo listing · sample price · stock not verified'
    : availability === 'in_stock'
      ? 'In stock'
      : availability === 'out_of_stock'
        ? 'Currently unavailable'
        : 'Availability not verified';

  return (
    <p
      className={`mt-2 text-[11px] leading-4 ${
        availability === 'out_of_stock'
          ? 'text-[#A85A3C]'
          : 'text-[#77736E]'
      }`}
    >
      {message}
    </p>
  );
}
