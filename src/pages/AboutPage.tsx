import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Info } from 'lucide-react';
import { Container } from '../components/ui/Container';

const assetUrl = (path: string): string =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;

export function AboutPage() {
  return (
    <main className="bg-[#FAF8F5] py-12 sm:py-20">
      <Container>
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#637666]">
            2427 ÉLAN
          </p>
          <h1 className="mt-3 font-display text-4xl font-medium leading-tight tracking-tight text-[#1F2022] sm:text-6xl">
            Everyday Comfort.
            <span className="block italic font-normal text-[#637666]">
              Elevated.
            </span>
          </h1>
          <p className="mt-6 text-sm leading-7 text-[#5E6064] sm:text-base">
            Explore the current 2427 ÉLAN catalog of everyday essentials for
            Men and Women. This page describes the storefront preview, not
            verified company history or product-performance claims.
          </p>
        </header>

        <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2">
          <Link
            to="/category/men-underwear"
            className="group overflow-hidden rounded-3xl border border-[#E8E1D7] bg-white"
          >
            <div className="flex h-64 items-center justify-center bg-[#F1EFEB] p-5 sm:h-80">
              <img
                src={assetUrl('images/products/underwear/m-ub01-front.jpg')}
                alt="Black 2427 everyday brief, front view"
                className="h-full w-full object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="flex items-center justify-between p-5 sm:p-6">
              <span className="font-display text-xl font-medium text-[#1F2022]">
                Men&apos;s essentials
              </span>
              <ArrowRight className="h-4 w-4 text-[#637666] transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            to="/category/women-bras"
            className="group overflow-hidden rounded-3xl border border-[#E8E1D7] bg-white"
          >
            <div className="flex h-64 items-center justify-center bg-[#F1EFEB] p-5 sm:h-80">
              <img
                src={assetUrl('images/products/bras/w-b01-front.jpg')}
                alt="Rose 2427 everyday bra, front view"
                className="h-full w-full scale-[2] object-contain sm:scale-[2.2]"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="flex items-center justify-between p-5 sm:p-6">
              <span className="font-display text-xl font-medium text-[#1F2022]">
                Women&apos;s essentials
              </span>
              <ArrowRight className="h-4 w-4 text-[#637666] transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>

        <section className="mx-auto mt-10 max-w-5xl rounded-3xl border border-[#CBD8CA] bg-[#F2F4EF] p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <Info
              size={20}
              className="mt-0.5 shrink-0 text-[#637666]"
              aria-hidden="true"
            />
            <div>
              <h2 className="font-display text-xl font-medium text-[#1F2022]">
                Store preview
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#47584A]">
                Product, pricing, delivery and policy information shown here
                must be confirmed by the store before launch. Account actions
                are demo-only, contact messages are not sent, and this website
                does not process orders or payments.
              </p>
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
