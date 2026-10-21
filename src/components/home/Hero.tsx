
import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { DemoBadge } from '../brand/DemoBadge';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-3 pb-6 sm:pt-5 sm:pb-10">
      <Container>
        <div className="relative isolate flex min-h-[540px] flex-col justify-end overflow-hidden rounded-2xl bg-[#1F2022] shadow-xl sm:min-h-[570px] lg:min-h-[610px] lg:rounded-3xl">

          {/* Premium Editorial Background */}
          <img
            src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=2400&q=85"
            alt="2427 Architectural Innerwear Campaign"
            className="absolute inset-0 h-full w-full object-cover object-[center_20%] opacity-75 sm:opacity-85 mix-blend-luminosity transition-transform duration-1000 hover:scale-105"
          />

          {/* Luxury Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F2022] via-[#1F2022]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1F2022]/90 via-[#1F2022]/40 to-transparent sm:w-2/3" />

          {/* Top Brand Label */}
          <div className="absolute left-5 right-5 top-5 z-20 flex items-center justify-between gap-3 sm:left-9 sm:right-9 sm:top-7">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#637666]" />
              <span className="font-numeral text-[10px] uppercase tracking-widest text-[#FAF8F5]/80 sm:text-xs">
                Atelier 2427 &bull; Collection 2026
              </span>
            </div>

            <DemoBadge
              variant="pill"
              className="border-white/20 bg-[#FAF8F5]/20 text-[#FAF8F5]"
            />
          </div>

          {/* Hero Content */}
          <div className="relative z-20 max-w-[680px] px-5 pb-7 pt-20 sm:px-10 sm:pb-10 sm:pt-24 lg:px-12 lg:pb-12">

            {/* Eyebrow */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#637666]/50 bg-[#637666]/30 px-3 py-1 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[#D9CBB7]" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#D9CBB7]">
                Architectural Daily Essentials
              </span>
            </div>

            {/* Premium Headline */}
            <h1 className="font-display text-[34px] font-medium leading-[1.04] tracking-tight text-[#FAF8F5] sm:text-5xl lg:text-[58px]">
              Second skin for every hour.
              <span className="mt-1 block italic font-normal text-[#D9CBB7]">
                24 hours. 7 days.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-4 max-w-[520px] text-xs font-light leading-relaxed text-[#FAF8F5]/85 sm:text-sm lg:text-[15px]">
              We engineered the pieces closest to your body so you can forget
              you’re wearing them. Crafted from cloud-soft Austrian MicroModal
              Air™, Californian Supima cotton, and zero-wire bonded curves.
            </p>

            {/* Shopping Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-2.5 sm:gap-3">
              <Button
                href="/category/men-underwear"
                variant="light"
                size="lg"
                icon={<ArrowRight className="h-4 w-4" />}
                className="bg-white px-4 py-2.5 text-xs font-semibold text-[#1F2022] hover:bg-[#FAF8F5] sm:px-5 sm:py-3 sm:text-sm"
              >
                Shop Men
              </Button>

              <Button
                href="/category/women-bras"
                variant="sage"
                size="lg"
                icon={<ArrowRight className="h-4 w-4" />}
                className="bg-[#637666] px-4 py-2.5 text-xs font-semibold text-[#FAF8F5] hover:bg-[#526355] sm:px-5 sm:py-3 sm:text-sm"
              >
                Shop Women
              </Button>

              <Button
                href="/category/bundles"
                variant="outline"
                size="lg"
                className="border-white/30 px-4 py-2.5 text-xs text-[#FAF8F5] hover:bg-white/10 sm:px-5 sm:py-3 sm:text-sm"
              >
                Explore Bundles (Save 20%)
              </Button>
            </div>

            {/* Compact Features Row */}
            <div className="mt-7 grid grid-cols-3 gap-3 border-t border-white/15 pt-4 sm:mt-8 sm:gap-5 sm:pt-5">

              <div>
                <dt className="text-[9px] uppercase tracking-widest text-[#FAF8F5]/50">
                  Touch
                </dt>
                <dd className="mt-1 font-numeral text-[10px] font-semibold leading-snug text-[#FAF8F5] sm:text-xs">
                  3X Softer Than Cotton
                </dd>
              </div>

              <div>
                <dt className="text-[9px] uppercase tracking-widest text-[#FAF8F5]/50">
                  Construction
                </dt>
                <dd className="mt-1 font-numeral text-[10px] font-semibold leading-snug text-[#FAF8F5] sm:text-xs">
                  Bonded Zero-Seam
                </dd>
              </div>

              <div>
                <dt className="text-[9px] uppercase tracking-widest text-[#FAF8F5]/50">
                  Commitment
                </dt>
                <dd className="mt-1 font-numeral text-[10px] font-semibold leading-snug text-[#D9CBB7] sm:text-xs">
                  30-Day Comfort Trial
                </dd>
              </div>

            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
