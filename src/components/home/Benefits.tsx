import React from 'react';
import { Link } from 'react-router-dom';
import {
  Grid2X2,
  SlidersHorizontal,
  Heart,
  ShoppingBag,
} from 'lucide-react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';

const shoppingFeatures = [
  {
    title: 'Shop by collection',
    description: "Browse the current Men’s and Women’s catalog.",
    to: '/category/men-underwear',
    label: 'Explore collections',
    icon: Grid2X2,
  },
  {
    title: 'Review product options',
    description: 'Open a product to review its listed colors, sizes and details.',
    to: '/category/new-arrivals',
    label: 'Browse products',
    icon: SlidersHorizontal,
  },
  {
    title: 'Save for later',
    description: 'Wishlist selections stay saved in this browser.',
    to: '/wishlist',
    label: 'View wishlist',
    icon: Heart,
  },
  {
    title: 'Checkout preview',
    description: 'Review your bag and totals. This demo does not process orders or payments.',
    to: '/checkout',
    label: 'View checkout',
    icon: ShoppingBag,
  },
];

export function Benefits() {
  return (
    <section className="border-y border-[#E8E1D7] bg-[#F4EFEB]/60 py-16 sm:py-20">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="The 2427 ÉLAN experience"
          title="A clearer way to explore"
          description="Browse the catalog, compare listed product options and keep a local wishlist as you shop."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {shoppingFeatures.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="flex min-h-[220px] flex-col rounded-2xl border border-[#E8E1D7] bg-white p-6 shadow-xs transition-shadow hover:shadow-md sm:p-7"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#637666]/10 text-[#637666]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-display text-xl font-medium text-[#1F2022]">
                  {feature.title}
                </h3>
                <p className="mt-2 flex-1 text-xs leading-6 text-[#5E6064]">
                  {feature.description}
                </p>
                <Link
                  to={feature.to}
                  className="mt-4 inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-[#637666] hover:text-[#1F2022]"
                >
                  {feature.label}
                </Link>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
