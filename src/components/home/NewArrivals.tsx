import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { ProductCard } from '../product/ProductCard';
import { PRODUCTS } from '../../data/catalog';

export function NewArrivals() {
  const [filter, setFilter] = useState<'all' | 'men' | 'women'>('all');

  const newProducts = PRODUCTS.filter(
    (p) => p.badge === 'New' || p.category === 'new-arrivals'
  );

  const displayedProducts = newProducts.filter((p) => {
    if (filter === 'men') return p.gender === 'men';
    if (filter === 'women') return p.gender === 'women';
    return true;
  });

  return (
    <section className="py-16 sm:py-24 bg-[#FAF8F5]">
      <Container>
        <SectionHeading
          eyebrow="Fresh Off the Loom"
          title="New Arrivals &amp; Season Firsts"
          description="Crafted in limited atelier batches. New silhouettes, breathable ribs, and bonded edges ready for your rotation."
          action={
            <div className="flex items-center gap-2 rounded-full border border-[#E8E1D7] bg-white p-1">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  filter === 'all'
                    ? 'bg-[#1F2022] text-[#FAF8F5] shadow-xs'
                    : 'text-[#6B6F76] hover:text-[#1F2022]'
                }`}
              >
                All New
              </button>
              <button
                type="button"
                onClick={() => setFilter('men')}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  filter === 'men'
                    ? 'bg-[#1F2022] text-[#FAF8F5] shadow-xs'
                    : 'text-[#6B6F76] hover:text-[#1F2022]'
                }`}
              >
                Men's Drops
              </button>
              <button
                type="button"
                onClick={() => setFilter('women')}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  filter === 'women'
                    ? 'bg-[#1F2022] text-[#FAF8F5] shadow-xs'
                    : 'text-[#6B6F76] hover:text-[#1F2022]'
                }`}
              >
                Women's Drops
              </button>
            </div>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/category/new-arrivals"
            className="inline-flex items-center gap-2 rounded-full border border-[#1F2022] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#1F2022] hover:bg-[#1F2022] hover:text-white transition-all shadow-xs"
          >
            <span>Explore All New Arrivals</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
