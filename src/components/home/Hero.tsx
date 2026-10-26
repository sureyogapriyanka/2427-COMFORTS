import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from '../brand/Logo';
import { Container } from '../ui/Container';

const assetUrl = (path: string): string =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;

export function Hero() {
  return (
    <section className="bg-[#F4F0EA]">
      <Container size="full" className="!px-0">
        <div className="grid overflow-hidden bg-[#EEE8E0] lg:min-h-[clamp(440px,33vw,600px)] lg:grid-cols-[minmax(420px,0.43fr)_minmax(0,0.57fr)]">
          <div className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-14 lg:px-[clamp(2.5rem,5vw,6rem)] lg:py-12">
            <Logo size="lg" className="self-start" />

            <p className="mt-3 text-[11px] font-medium tracking-[0.24em] text-[#33312E] sm:text-sm">
              Everyday Comfort. Elevated.
            </p>

            <h1 className="mt-7 max-w-xl font-sans text-3xl font-medium leading-[1.12] tracking-tight text-[#171716] sm:text-4xl lg:mt-8 lg:text-[clamp(2.5rem,3vw,3.5rem)]">
              Premium Essentials
              <span className="block">for Every You</span>
            </h1>

            <p className="mt-4 max-w-md text-sm leading-6 text-[#393632] sm:text-base sm:leading-7">
              Innerwear designed for comfort, confidence and everyday living.
            </p>

            <div className="mt-7 flex flex-wrap gap-3 sm:mt-8">
              <Link
                to="/category/men-underwear"
                className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#111111] px-6 text-xs font-semibold tracking-wide text-white transition-colors hover:bg-[#343434] sm:px-7 sm:text-sm"
              >
                SHOP MEN
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>

              <Link
                to="/category/women-bras"
                className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#222222] bg-white/80 px-6 text-xs font-semibold tracking-wide text-[#171716] transition-colors hover:bg-white sm:px-7 sm:text-sm"
              >
                SHOP WOMEN
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="relative min-h-[300px] overflow-hidden bg-[#D8C9BA] sm:min-h-[420px] lg:min-h-0">
            <img
              src={assetUrl(
                'images/home/approved-reference-crops/elan-approved-hero.webp'
              )}
              alt="Adult male model in black boxers and adult female model in mauve innerwear in a warm neutral studio"
              width={1320}
              height={450}
              className="absolute inset-0 h-full w-full object-cover object-[40%_center] lg:object-[53%_center]"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
