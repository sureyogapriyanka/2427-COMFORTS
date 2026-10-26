import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Container } from '../ui/Container';
import { ProductCard } from '../product/ProductCard';
import { useCatalog } from '../../context/CatalogContext';

export function FeaturedProducts() {
  const { products } = useCatalog();
  const bestsellers = products.filter((p) => p.badge === 'Bestseller').slice(0, 4);

  return (
    <section className="py-6 sm:py-8 bg-white">
      <Container>
        {/* Section Header */}
        <div className="mb-5 flex items-end justify-between sm:mb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#637666]">
              Catalog labels
            </span>
            <h2 className="mt-0.5 font-display text-2xl sm:text-3xl font-medium tracking-tight text-[#202020]">
              Bestseller Picks
            </h2>
          </div>

          <Link
            to="/category/bestsellers"
            className="inline-flex items-center gap-1 rounded-full border border-[#E8E5E0] bg-[#F8F7F5] px-3 py-1.5 text-[11px] font-semibold text-[#202020] transition-colors hover:border-[#637666] hover:text-[#637666]"
          >
            <span>View all</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 4 Products in 1 row on Desktop (lg:grid-cols-4), 2 columns on Mobile (grid-cols-2) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}
