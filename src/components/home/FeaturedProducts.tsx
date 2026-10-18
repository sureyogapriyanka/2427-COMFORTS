import React, { useState } from 'react';
import { Sparkles, Layers, ShieldCheck, Feather, Wind, ArrowRight } from 'lucide-react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { ProductCard } from '../product/ProductCard';
import { PRODUCTS, FABRIC_INNOVATIONS } from '../../data/catalog';
import { Button } from '../ui/Button';

export function FeaturedProducts() {
  const [activeFabricIndex, setActiveFabricIndex] = useState(0);

  // Curate 4 iconic flagship bestsellers
  const bestsellers = PRODUCTS.filter((p) => p.badge === 'Bestseller').slice(0, 4);
  const activeFabric = FABRIC_INNOVATIONS[activeFabricIndex];

  return (
    <section className="py-16 sm:py-24 bg-[#FAF8F5]">
      <Container>
        {/* Top Product Showcase */}
        <SectionHeading
          eyebrow="The Flagship Edit"
          title="Most Coveted Bestsellers"
          description="The silhouettes our community orders on repeat: featherweight MicroModal trunks, wire-free bralettes, and pure Supima boxers."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Fabric Technology Innovation Module */}
        <div className="mt-20 overflow-hidden rounded-3xl bg-[#1F2022] text-[#FAF8F5] shadow-2xl border border-[#FAF8F5]/10">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Column: Interactive Fabric Tabs */}
            <div className="border-b lg:border-b-0 lg:border-r border-white/10 p-6 sm:p-10 lg:col-span-5 flex flex-col justify-between">
              <div>
                <span className="eyebrow text-[#D9CBB7]">Botanical Textile Lab</span>
                <h3 className="font-display text-3xl sm:text-4xl font-medium mt-2 leading-tight">
                  Materials Engineered for Living Skin
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-[#FAF8F5]/75 leading-relaxed font-light">
                  Most conventional innerwear uses heavy, non-breathable polyester or low-grade coarse cotton. 2427 sources exclusively certified botanical fibers.
                </p>

                {/* Fabric Selector Buttons */}
                <div className="mt-8 space-y-2">
                  {FABRIC_INNOVATIONS.map((fabric, idx) => (
                    <button
                      key={fabric.title}
                      type="button"
                      onClick={() => setActiveFabricIndex(idx)}
                      className={`w-full text-left p-3.5 rounded-xl transition-all flex items-center justify-between ${
                        activeFabricIndex === idx
                          ? 'bg-[#FAF8F5] text-[#1F2022] shadow-md font-semibold'
                          : 'text-[#FAF8F5]/80 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Feather className={`h-4 w-4 ${activeFabricIndex === idx ? 'text-[#637666]' : 'text-[#FAF8F5]/50'}`} />
                        <span className="text-xs sm:text-sm">{fabric.title}</span>
                      </div>
                      <span className={`text-[10px] uppercase font-numeral tracking-wider ${activeFabricIndex === idx ? 'text-[#637666]' : 'text-[#FAF8F5]/40'}`}>
                        {fabric.tagline}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <Button href="/about#fabrics" variant="sage" size="sm" className="w-full">
                  Read Full Fiber Provenance
                </Button>
              </div>
            </div>

            {/* Right Column: Detailed Fabric Breakdown */}
            <div className="p-6 sm:p-12 lg:col-span-7 flex flex-col justify-between bg-gradient-to-br from-[#26282B] to-[#1F2022]">
              <div>
                <div className="flex items-center justify-between text-xs text-[#D9CBB7] mb-2">
                  <span className="uppercase font-semibold tracking-widest text-[10px]">Origin:</span>
                  <span className="font-numeral">{activeFabric.origin}</span>
                </div>

                <h4 className="font-display text-3xl sm:text-5xl font-medium text-white">
                  {activeFabric.title}
                </h4>

                <p className="mt-4 text-sm sm:text-base text-[#FAF8F5]/80 leading-relaxed font-light">
                  {activeFabric.description}
                </p>

                {/* Performance Metrics Pill */}
                <div className="mt-8 rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-xs">
                  <span className="text-[10px] uppercase font-semibold text-[#637666] tracking-widest block mb-1">
                    Verified Performance Metrics
                  </span>
                  <p className="font-numeral text-sm font-semibold text-[#FAF8F5]">
                    {activeFabric.metrics}
                  </p>
                </div>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6 text-center text-xs text-[#FAF8F5]/80">
                <div>
                  <Wind className="mx-auto h-5 w-5 text-[#637666] mb-1.5" />
                  <span className="font-semibold block text-[#FAF8F5]">Airflow Active</span>
                  <span className="text-[10px] text-[#FAF8F5]/60">24/7 Temperature Balance</span>
                </div>
                <div>
                  <Layers className="mx-auto h-5 w-5 text-[#637666] mb-1.5" />
                  <span className="font-semibold block text-[#FAF8F5]">Zero Pilling</span>
                  <span className="text-[10px] text-[#FAF8F5]/60">Tested across 100+ Washes</span>
                </div>
                <div>
                  <ShieldCheck className="mx-auto h-5 w-5 text-[#637666] mb-1.5" />
                  <span className="font-semibold block text-[#FAF8F5]">Hypoallergenic</span>
                  <span className="text-[10px] text-[#FAF8F5]/60">Skin-Kind Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
