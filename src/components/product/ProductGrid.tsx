import React from 'react';
import { Product } from '../../data/catalog';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function ProductGrid({
  products,
  columns = 4,
  className = '',
}: ProductGridProps) {
  const colClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }[columns];

  return (
    <div className={`grid gap-6 ${colClass} ${className}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
