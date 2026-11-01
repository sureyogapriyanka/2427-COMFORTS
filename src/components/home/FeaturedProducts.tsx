import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Container } from '../ui/Container';
import { ProductCard } from '../product/ProductCard';
import { useCatalog } from '../../context/CatalogContext';

export function FeaturedProducts() {
  const { products, isLoading, error } = useCatalog();
  const featuredProducts = [
    ...products.filter((product) => product.gender === 'men').slice(0, 4),
    ...products.filter((product) => product.gender === 'women').slice(0, 4),
  ];

  return (
    <section className="bg-elan-ivory py-12 sm:py-16">
      <Container>
        <div className="mb-7 flex flex-col gap-5 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow mb-2">A considered edit</p>
            <h2 className="font-display text-3xl font-medium leading-tight tracking-tight text-elan-ink sm:text-4xl">
              CURATED FOR YOUR EVERYDAY
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-elan-muted sm:text-base">
              Discover everyday essentials, thoughtfully selected for comfort and style.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/category/men-underwear"
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-elan-ink px-4 text-xs font-semibold text-elan-ink transition-colors hover:bg-elan-ink hover:text-elan-ivory"
            >
              Shop Men <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <Link
              to="/category/women-bras"
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-elan-ink px-4 text-xs font-semibold text-elan-ink transition-colors hover:bg-elan-ink hover:text-elan-ivory"
            >
              Shop Women <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>

        {isLoading ? (
          <p role="status" className="py-12 text-center text-sm text-elan-muted">
            Loading featured products…
          </p>
        ) : error ? (
          <p role="alert" className="rounded-xl border border-[#E8E1D7] bg-white p-5 text-sm text-elan-muted">
            Featured products could not be loaded. Please try again later.
          </p>
        ) : featuredProducts.length === 0 ? (
          <p className="rounded-xl border border-[#E8E1D7] bg-white p-5 text-sm text-elan-muted">
            There are no featured products available in the catalog yet.
          </p>
        ) : (
          <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
