import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Flame, Compass } from 'lucide-react';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { DemoBadge } from '../brand/DemoBadge';

export function Hero() {
  return (
    <section className="relative pt-3 pb-8 sm:pt-6 sm:pb-12 overflow-hidden">
      <Container>
        <div className="relative isolate min-h-[82vh] sm:min-h-[86vh] overflow-hidden rounded-3xl bg-[#1F2022] shadow-2xl grain-texture flex flex-col justify-end">
          {/* Editorial Background Image with Gradient Overlay */}
          <img
            src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=2400&q=85"
            alt="2427 Architectural Innerwear Campaign"
            className="absolute inset-0 h-full w-full object-cover object-[center_20%] opacity-75 sm:opacity-85 mix-blend-luminosity scale-100 transition-transform duration-1000 hover:scale-105"
          />

          {/* Luxury Color Grading Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F2022] via-[#1F2022]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1F2022]/90 via-[#1F2022]/40 to-transparent sm:w-2/3" />

          {/* Top Brand Watermark & Tag */}
          <div className="absolute top-6 left-6 right-6 sm:top-8 sm:left-10 sm:right-10 flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-[#637666] animate-pulse" />
              <span className="text-xs uppercase font-numeral tracking-widest text-[#FAF8F5]/80">
                Atelier 2427 &bull; Collection 2026
              </span>
            </div>
            <DemoBadge variant="pill" className="bg-[#FAF8F5]/20 text-[#FAF8F5] border-white/20" />
          </div>

          {/* Hero Content Section */}
          <div className="relative z-20 px-6 py-10 sm:px-12 sm:py-16 max-w-3xl">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 rounded-full bg-[#637666]/30 border border-[#637666]/50 px-3.5 py-1 text-xs text-[#FAF8F5] backdrop-blur-md mb-4 sm:mb-6">
              <Sparkles className="h-3.5 w-3.5 text-[#D9CBB7]" />
              <span className="tracking-wider uppercase text-[11px] font-semibold text-[#D9CBB7]">
                Architectural Daily Essentials
              </span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-medium tracking-tight text-[#FAF8F5] leading-[0.96]">
              Second skin for every hour. <br />
              <span className="italic font-normal text-[#D9CBB7]">24 hours. 7 days.</span>
            </h1>

            {/* Editorial Subtext */}
            <p className="mt-5 max-w-xl text-sm sm:text-lg text-[#FAF8F5]/85 leading-relaxed font-light">
              We engineered the pieces closest to your body so you can forget you’re wearing them. Crafted from cloud-soft Austrian MicroModal Air™, Californian Supima cotton, and zero-wire bonded curves.
            </p>

            {/* Dual CTAs: Shop Men & Shop Women */}
            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <Button
                href="/category/men-underwear"
                variant="light"
                size="lg"
                icon={<ArrowRight className="h-4 w-4" />}
                className="font-semibold text-sm sm:text-base px-6 py-3.5 bg-white text-[#1F2022] hover:bg-[#FAF8F5]"
              >
                Shop Men
              </Button>

              <Button
                href="/category/women-bras"
                variant="sage"
                size="lg"
                icon={<ArrowRight className="h-4 w-4" />}
                className="font-semibold text-sm sm:text-base px-6 py-3.5 bg-[#637666] text-[#FAF8F5] hover:bg-[#526355]"
              >
                Shop Women
              </Button>

              <Button
                href="/category/bundles"
                variant="outline"
                size="lg"
                className="border-white/30 text-[#FAF8F5] hover:bg-white/10 text-sm sm:text-base px-6 py-3.5"
              >
                Explore Bundles (Save 20%)
              </Button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-white/15 pt-6 text-xs text-[#FAF8F5]/90">
              <div>
                <dt className="text-[#FAF8F5]/50 text-[10px] uppercase tracking-widest">Touch</dt>
                <dd className="mt-1 font-numeral text-sm font-semibold text-[#FAF8F5]">3X Softer Than Cotton</dd>
              </div>
              <div>
                <dt className="text-[#FAF8F5]/50 text-[10px] uppercase tracking-widest">Construction</dt>
                <dd className="mt-1 font-numeral text-sm font-semibold text-[#FAF8F5]">Bonded Zero-Seam</dd>
              </div>
              <div>
                <dt className="text-[#FAF8F5]/50 text-[10px] uppercase tracking-widest">Commitment</dt>
                <dd className="mt-1 font-numeral text-sm font-semibold text-[#D9CBB7]">30-Day Comfort Trial</dd>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
