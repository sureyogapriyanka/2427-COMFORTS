import React from 'react';
import { Package, Sparkles, ArrowRight, Check } from 'lucide-react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { ProductCard } from '../product/ProductCard';
import { PRODUCTS } from '../../data/catalog';
import { Button } from '../ui/Button';

export function BundlesSection() {
  const bundleProducts = PRODUCTS.filter((p) => p.category === 'bundles');

  return (
    <section className="py-16 sm:py-24 bg-[#F4EFEB]/40">
      <Container>
        <SectionHeading
          eyebrow="The Daily Rotation"
          title="Multipacks &amp; Curated Bundles"
          description="Curated sets of our highest-rated essentials. Replenish your weekly innerwear drawer and save up to 22%."
          action={
            <Button href="/category/bundles" variant="primary" size="sm">
              <span>View All Bundle Packs</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          }
        />

        {/* 2-Column Spotlight Grid for Bundles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {bundleProducts.map((bundle) => (
            <div
              key={bundle.id}
              className="group overflow-hidden rounded-3xl bg-white border border-[#E8E1D7] shadow-sm transition-all duration-300 hover:shadow-xl hover:border-[#637666]/50 flex flex-col sm:flex-row"
            >
              {/* Left Image */}
              <div className="relative aspect-square sm:aspect-auto sm:w-1/2 overflow-hidden bg-[#FAF8F5]">
                <img
                  src={bundle.image}
                  alt={bundle.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 z-10">
                  <span className="rounded-full bg-[#A85A3C] text-white px-3 py-1 text-xs font-semibold shadow-xs">
                    {bundle.badge}
                  </span>
                </div>
              </div>

              {/* Right Content */}
              <div className="p-6 sm:p-8 sm:w-1/2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#637666]">
                    <Package className="h-4 w-4" />
                    <span>{bundle.gender === 'men' ? "Men's Bundle" : "Women's Bundle"}</span>
                  </div>

                  <h3 className="font-display text-2xl font-medium text-[#1F2022] mt-2 leading-snug">
                    {bundle.name}
                  </h3>

                  <p className="mt-2 text-xs text-[#5E6064] leading-relaxed">
                    {bundle.description}
                  </p>

                  <ul className="mt-4 space-y-1.5 text-xs text-[#1F2022]">
                    {bundle.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-[#637666] shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E8E1D7]">
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="font-numeral text-2xl font-bold text-[#1F2022]">
                      ₹{bundle.price}
                    </span>
                    {bundle.compareAt && (
                      <span className="font-numeral text-sm text-[#6B6F76] line-through">
                        ₹{bundle.compareAt}
                      </span>
                    )}
                    <span className="text-xs font-semibold text-[#A85A3C]">
                      Save ₹{(bundle.compareAt || 0) - bundle.price}
                    </span>
                  </div>

                  <Button href={`/category/bundles`} variant="sage" className="w-full">
                    Configure &amp; Add Bundle
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Bundle Promo Banner */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-[#637666]/20 via-[#FAF8F5] to-[#E8E1D7]/40 p-6 sm:p-8 border border-[#637666]/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#637666] block mb-1">
              Custom Curation
            </span>
            <h4 className="font-display text-2xl sm:text-3xl font-medium text-[#1F2022]">
              Prefer to mix and match sizes or colorways?
            </h4>
            <p className="text-xs sm:text-sm text-[#5E6064] mt-1">
              Select any 3 or more individual innerwear items to automatically unlock 20% off at checkout.
            </p>
          </div>
          <Button href="/category/men-underwear" variant="primary" className="shrink-0">
            Build Custom Set
          </Button>
        </div>
      </Container>
    </section>
  );
}
