import React from 'react';
import { ArrowRight, Sparkles, Feather, Compass, HeartHandshake } from 'lucide-react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';

export function BrandStory() {
  return (
    <section className="py-20 sm:py-28 bg-[#FAF8F5] relative overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Editorial Collage */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Primary Large Image */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-[#F4EFEB] shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80"
                  alt="2427 Atelier Textile Craftsmanship"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>

              {/* Overlapping Floating Inset Card */}
              <div className="absolute -bottom-8 -right-4 sm:-right-8 w-60 sm:w-72 rounded-2xl bg-white p-5 shadow-2xl border border-[#E8E1D7] hidden sm:block">
                <span className="eyebrow text-[#637666] block mb-1">Architectural Philosophy</span>
                <p className="font-display text-xl font-medium text-[#1F2022] leading-snug">
                  “The closest garment to your skin should be the most considered.”
                </p>
                <div className="mt-3 flex items-center justify-between text-[11px] text-[#6B6F76] pt-2 border-t border-[#E8E1D7]">
                  <span className="font-semibold text-[#1F2022]">Atelier 2427</span>
                  <span>Est. 2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Narrative */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <span className="eyebrow mb-3">Our Core Philosophy</span>
            <h2 className="font-display text-3xl sm:text-5xl font-medium text-[#1F2022] tracking-tight leading-[1.1]">
              Why We Named It <br />
              <span className="italic text-[#637666]">2427.</span>
            </h2>

            <p className="mt-6 text-base sm:text-lg text-[#5E6064] leading-relaxed font-light">
              There are <strong className="font-semibold text-[#1F2022]">24 hours in a day</strong>, and <strong className="font-semibold text-[#1F2022]">7 days in a week</strong>. For every single one of those hours, innerwear is the foundational layer between your living skin and the outside world.
            </p>

            <p className="mt-4 text-sm sm:text-base text-[#5E6064] leading-relaxed">
              Yet traditional innerwear brands rely on stiff elastics that dig into hips, coarse polyester blends that trap heat, and generic mass-production fits. 2427 was founded to build a modern alternative: architectural cuts, zero-wire support, bonded ultrasonic seams, and micro-fine botanical cellulose that feels like soft air.
            </p>

            {/* Core Values Grid */}
            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-[#E8E1D7] pt-6">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1F2022]">
                  <Feather className="h-4 w-4 text-[#637666]" />
                  <span>Second-Skin Weight</span>
                </div>
                <p className="text-xs text-[#5E6064]">MicroModal Air™ fibers three times softer than combed cotton.</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1F2022]">
                  <Compass className="h-4 w-4 text-[#637666]" />
                  <span>Anatomical Precision</span>
                </div>
                <p className="text-xs text-[#5E6064]">Contoured 3D pouches and zero-wire molded cups engineered to hold comfortably.</p>
              </div>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <Button href="/about" variant="primary">
                <span>Read The Full Brand Story</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
