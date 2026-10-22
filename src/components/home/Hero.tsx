
import React from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  MoveUpRight,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { DemoBadge } from '../brand/DemoBadge';

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-8 pt-3 sm:pb-10 sm:pt-5">
      <Container>
        {/* Compact Premium Hero Banner */}
        <div className="relative isolate min-h-[380px] overflow-hidden rounded-[22px] bg-[#222522] shadow-[0_20px_55px_-30px_rgba(0,0,0,0.5)] sm:min-h-[400px] sm:rounded-[28px] lg:min-h-[430px]">

          {/* Background Image */}
          <img
            src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=2400&q=90"
            alt="2427 COMFORTS premium everyday fashion campaign"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-80"
          />

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#161A17]/95 via-[#161A17]/70 to-[#161A17]/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#161A17]/55 via-transparent to-[#161A17]/20" />

          {/* Decorative Glow */}
          <div className="pointer-events-none absolute -left-24 bottom-0 h-56 w-56 rounded-full bg-[#A7B7A2]/10 blur-3xl" />

          {/* Top Brand Label */}
          <div className="absolute left-5 right-5 top-5 z-20 flex items-start justify-between gap-3 sm:left-9 sm:right-9 sm:top-6 lg:left-12 lg:right-12">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/30 text-[10px] font-semibold text-white">
                24
              </span>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/90">
                  2427 COMFORTS
                </p>
                <p className="mt-0.5 text-[9px] uppercase tracking-[0.15em] text-white/60">
                  Everyday, elevated
                </p>
              </div>
            </div>

            <DemoBadge
              variant="pill"
              className="border-white/20 bg-white/10 text-white backdrop-blur-md"
            />
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex min-h-[380px] flex-col justify-center px-5 pb-16 pt-20 sm:min-h-[400px] sm:px-10 sm:pb-16 lg:min-h-[430px] lg:px-12">
            <div className="max-w-[610px]">

              {/* Premium Label */}
              <div className="mb-3 inline-flex items-center gap-2 border-b border-[#D9CBB7]/50 pb-2">
                <Sparkles className="h-3.5 w-3.5 text-[#D9CBB7]" />
                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#E7DDCC] sm:text-[10px]">
                  The Art of Everyday Comfort
                </span>
              </div>

              {/* Compact Heading */}
              <h1 className="font-display text-[clamp(2.3rem,5vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.04em] text-[#FAF8F5]">
                Comfort
                <span className="block italic font-normal text-[#D9CBB7]">
                  looks good
                </span>
                on you.
              </h1>

              {/* Description */}
              <p className="mt-4 max-w-[420px] text-xs font-light leading-[1.7] text-white/85 sm:text-sm">
                Made for your everyday rhythm. Discover thoughtfully
                designed innerwear and essentials that bring together
                softness, confidence, and effortless style.
              </p>

              {/* Shopping Buttons */}
              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <Button
                  href="/category/men-underwear"
                  variant="light"
                  size="lg"
                  icon={<ArrowUpRight className="h-3.5 w-3.5" />}
                  className="min-h-10 rounded-full bg-[#FAF8F5] px-4 py-2 text-xs font-semibold text-[#1F2022] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E8E1D7] sm:px-5 sm:text-sm"
                >
                  Shop Men
                </Button>

                <Button
                  href="/category/women-bras"
                  variant="sage"
                  size="lg"
                  icon={<ArrowUpRight className="h-3.5 w-3.5" />}
                  className="min-h-10 rounded-full bg-[#637666] px-4 py-2 text-xs font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#526355] sm:px-5 sm:text-sm"
                >
                  Shop Women
                </Button>

                <Button
                  href="/category/bundles"
                  variant="outline"
                  size="lg"
                  icon={<ArrowRight className="h-3.5 w-3.5" />}
                  className="min-h-10 rounded-full border-white/40 bg-white/5 px-4 py-2 text-xs text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/15 sm:px-5 sm:text-sm"
                >
                  Explore Bundles
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Editorial Bar */}
          <div className="absolute bottom-0 left-0 right-0 z-20 flex min-h-[45px] items-center justify-between gap-3 border-t border-white/20 bg-[#1F2022]/35 px-5 backdrop-blur-md sm:px-10 lg:px-12">
            <span className="text-[9px] font-medium uppercase tracking-[0.15em] text-white/80 sm:text-[10px]">
              Designed for every hour
            </span>

            <div className="hidden items-center gap-2 text-[9px] uppercase tracking-[0.12em] text-white/65 sm:flex">
              <span>24 hours</span>
              <span className="h-1 w-1 rounded-full bg-[#D9CBB7]" />
              <span>7 days</span>
              <span className="h-1 w-1 rounded-full bg-[#D9CBB7]" />
              <span>Endless comfort</span>
            </div>

            <MoveUpRight className="h-3.5 w-3.5 text-[#D9CBB7]" />
          </div>
        </div>

        {/* Compact Premium Benefits Strip */}
        <div className="mt-4 grid grid-cols-3 divide-x divide-[#E8E1D7] rounded-xl border border-[#E8E1D7] bg-[#FAF8F5] px-3 py-4 shadow-sm sm:mt-5 sm:px-6 sm:py-5">

          <div className="px-2 text-center sm:px-4">
            <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#637666]">
              Feel
            </p>
            <p className="mt-1 font-display text-xs font-medium text-[#1F2022] sm:text-lg">
              Soft by nature
            </p>
            <p className="mt-1 hidden text-[11px] text-[#777973] sm:block">
              Comfort in every detail
            </p>
          </div>

          <div className="px-2 text-center sm:px-4">
            <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#637666]">
              Fit
            </p>
            <p className="mt-1 font-display text-xs font-medium text-[#1F2022] sm:text-lg">
              Made to move
            </p>
            <p className="mt-1 hidden text-[11px] text-[#777973] sm:block">
              Designed around your day
            </p>
          </div>

          <div className="px-2 text-center sm:px-4">
            <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#637666]">
              Style
            </p>
            <p className="mt-1 font-display text-xs font-medium text-[#1F2022] sm:text-lg">
              Simply timeless
            </p>
            <p className="mt-1 hidden text-[11px] text-[#777973] sm:block">
              Essentials for everyone
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
