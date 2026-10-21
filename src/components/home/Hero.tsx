
import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { DemoBadge } from '../brand/DemoBadge';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-3 pb-8 sm:pt-5 sm:pb-10">
      <Container>

        {/* COMPACT PREMIUM HERO BANNER */}
        <div className="relative isolate flex min-h-[430px] flex-col justify-center overflow-hidden rounded-2xl bg-[#1F2022] shadow-xl sm:min-h-[420px] lg:min-h-[450px] lg:rounded-3xl">

          {/* Background Image */}
          <img
            src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=2400&q=85"
            alt="2427 Architectural Innerwear Campaign"
            className="absolute inset-0 h-full w-full object-cover object-[center_20%] opacity-75 sm:opacity-85 mix-blend-luminosity"
          />

          {/* Dark Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1F2022]/95 via-[#1F2022]/65 to-[#1F2022]/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F2022]/60 via-transparent to-transparent" />

          {/* Top Brand Label */}
          <div className="absolute left-5 right-5 top-5 z-20 flex items-center justify-between gap-3 sm:left-9 sm:right-9 sm:top-6">
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

          {/* Main Hero Content */}
          <div className="relative z-20 max-w-[650px] px-5 pb-8 pt-20 sm:px-10 sm:pb-9 sm:pt-20 lg:px-12 lg:pb-10">

            {/* Small Premium Label */}
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#637666]/50 bg-[#637666]/30 px-3 py-1 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[#D9CBB7]" />

              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#D9CBB7]">
                Architectural Daily Essentials
              </span>
            </div>

            {/* Compact Heading */}
            <h1 className="font-display text-[32px] font-medium leading-[1.05] tracking-tight text-[#FAF8F5] sm:text-[40px] lg:text-[46px]">
              Second skin for every hour.

              <span className="mt-1 block italic font-normal text-[#D9CBB7]">
                24 hours. 7 days.
              </span>
            </h1>

            {/* Shorter Description */}
            <p className="mt-3 max-w-[500px] text-xs font-light leading-relaxed text-[#FAF8F5]/85 sm:text-sm">
              Everyday essentials designed for comfort, movement,
              and effortless style. Discover innerwear crafted
              for every hour of your day.
            </p>

            {/* Shopping Buttons */}
            <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:mt-6 sm:gap-3">

              <Button
                href="/category/men-underwear"
                variant="light"
                size="lg"
                icon={<ArrowRight className="h-4 w-4" />}
                className="bg-white px-4 py-2.5 text-xs font-semibold text-[#1F2022] hover:bg-[#FAF8F5] sm:px-5 sm:text-sm"
              >
                Shop Men
              </Button>

              <Button
                href="/category/women-bras"
                variant="sage"
                size="lg"
                icon={<ArrowRight className="h-4 w-4" />}
                className="bg-[#637666] px-4 py-2.5 text-xs font-semibold text-[#FAF8F5] hover:bg-[#526355] sm:px-5 sm:text-sm"
              >
                Shop Women
              </Button>

              <Button
                href="/category/bundles"
                variant="outline"
                size="lg"
                className="border-white/30 px-4 py-2.5 text-xs text-[#FAF8F5] hover:bg-white/10 sm:px-5 sm:text-sm"
              >
                Explore Bundles
              </Button>

            </div>
          </div>
        </div>

        {/* COMPACT FEATURES STRIP BELOW BANNER */}
        <div className="mt-4 grid grid-cols-3 gap-3 rounded-xl border border-[#E8E1D7] bg-[#FAF8F5] px-4 py-4 sm:mt-5 sm:gap-6 sm:px-8">

          <div className="text-center">
            <p className="text-[9px] font-semibold uppercase tracking-widest text-[#637666] sm:text-[10px]">
              Everyday
            </p>

            <p className="mt-1 text-[10px] font-medium text-[#1F2022] sm:text-sm">
              Soft Comfort
            </p>
          </div>

          <div className="border-x border-[#E8E1D7] text-center">
            <p className="text-[9px] font-semibold uppercase tracking-widest text-[#637666] sm:text-[10px]">
              Designed For
            </p>

            <p className="mt-1 text-[10px] font-medium text-[#1F2022] sm:text-sm">
              Daily Movement
            </p>
          </div>

          <div className="text-center">
            <p className="text-[9px] font-semibold uppercase tracking-widest text-[#637666] sm:text-[10px]">
              Collection
            </p>

            <p className="mt-1 text-[10px] font-medium text-[#1F2022] sm:text-sm">
              Men & Women
            </p>
          </div>

        </div>

      </Container>
    </section>
  );
}
