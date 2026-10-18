import React from 'react';
import { Container } from '../components/ui/Container';
import { Sparkles, Feather, ShieldCheck, Heart, Leaf, Compass } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function AboutPage() {
  return (
    <div className="py-12 sm:py-20 bg-[#FAF8F5]">
      <Container>
        {/* Editorial Hero */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="eyebrow text-[#637666]">The 2427 Atelier</span>
          <h1 className="font-display text-4xl sm:text-6xl font-medium text-[#1F2022] mt-3 tracking-tight leading-[1.05]">
            Innerwear Reimagined as <br />
            <span className="italic text-[#637666]">Quiet Architecture.</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-[#5E6064] leading-relaxed font-light">
            We exist to eliminate the friction in your morning rotation. 2427 was engineered on a simple observation: the garments worn closest to your living skin deserve the highest level of material science, ergonomic precision, and understated luxury.
          </p>
        </div>

        {/* Narrative Image Collage */}
        <div className="rounded-3xl overflow-hidden bg-[#1F2022] p-8 sm:p-14 text-white shadow-2xl mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#D9CBB7]">
                The Nomenclature
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-medium mt-2 leading-snug">
                24 Hours. 7 Days. Zero Distraction.
              </h2>
              <p className="mt-4 text-sm text-[#FAF8F5]/80 leading-relaxed font-light">
                Why 2427? Because comfort isn't an intermittent luxury reserved for weekends or lounge hours. It is an around-the-clock physical requirement. From the earliest 6:00 AM commute to mid-day meetings, cross-country flights, and evening rest, our garments adapt to your body's temperature and natural motion.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <span className="font-numeral text-4xl font-bold text-[#D9CBB7]">24/7</span>
                <span className="text-xs text-[#FAF8F5]/60 border-l border-white/20 pl-3">
                  Uninterrupted softness, botanical airflow, and second-skin support.
                </span>
              </div>
            </div>

            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#2A2C30]">
              <img
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80"
                alt="Fabric atelier inspection"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Three Guiding Atelier Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="rounded-2xl bg-white p-8 border border-[#E8E1D7] shadow-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#637666]/10 text-[#637666] mb-5">
              <Leaf className="h-6 w-6" />
            </div>
            <h3 className="font-display text-2xl font-medium text-[#1F2022]">Botanical Provenance</h3>
            <p className="mt-3 text-xs sm:text-sm text-[#5E6064] leading-relaxed">
              We reject synthetic poly-blends that pill and trap perspiration. Instead, our yarns are derived from sustainable Austrian beechwood (Lenzing MicroModal) and pure American Supima cotton.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 border border-[#E8E1D7] shadow-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#637666]/10 text-[#637666] mb-5">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="font-display text-2xl font-medium text-[#1F2022]">Ultrasonic Construction</h3>
            <p className="mt-3 text-xs sm:text-sm text-[#5E6064] leading-relaxed">
              Bulky stitched seams create pressure ridges beneath clothes. We utilize precision ultrasonic welding to create razor-flat 0.4mm bonded edges that melt against the skin.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 border border-[#E8E1D7] shadow-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#637666]/10 text-[#637666] mb-5">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-display text-2xl font-medium text-[#1F2022]">First Pair Guarantee</h3>
            <p className="mt-3 text-xs sm:text-sm text-[#5E6064] leading-relaxed">
              Innerwear is intensely personal. That's why we back every first-time purchase with a 30-day trial guarantee. If you don't feel the difference, we make it right.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Button href="/" variant="primary" size="lg">
            Shop The 2427 Collection
          </Button>
        </div>
      </Container>
    </div>
  );
}
