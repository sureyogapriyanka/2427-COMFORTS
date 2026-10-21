
import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Container } from '../ui/Container';
import { MEN_CATEGORIES } from '../../data/catalog';
import { DemoBadge } from '../brand/DemoBadge';

const productImage = (path: string): string =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;

const hoverImages: Record<string, string> = {
  'men-underwear': productImage(
    'images/products/underwear/m-ub01-alt.jpg'
  ),
  'men-boxers': productImage(
    'images/products/boxers/m-bx01-airbox-alt.jpg'
  ),
  'men-vests': productImage(
    'images/products/vests/m-v01-alt.jpg'
  ),
  'men-sleeveless': productImage(
    'images/products/sleeveless/m-s01-back.jpg'
  ),
  'men-bestsellers': productImage(
    'images/products/underwear/m-ub02-front.jpg'
  ),
};

const bestsellers = {
  slug: 'men-bestsellers',
  gender: 'men',
  title: 'Bestsellers',
  tagline: 'Popular Picks',
  description:
    'Discover standout essentials selected from our men’s collection.',
  image: productImage(
    'images/products/underwear/m-ub01-front.jpg'
  ),
  itemCountDemo: 'Top Picks',
};

const categories = [
  ...MEN_CATEGORIES.filter(
    (category) =>
      String(category.slug) !== 'men-bestsellers'
  ),
  bestsellers,
];

export function MenCategories() {
  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] pb-12 pt-8 sm:pb-16 sm:pt-12">
      <Container>

        {/* Premium Section Heading */}
        <div className="mb-7 flex flex-col justify-between gap-5 border-b border-[#E8E1D7] pb-6 sm:mb-9 sm:flex-row sm:items-end">
          <div className="max-w-[650px]">

            <div className="mb-3 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#637666]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#637666] sm:text-xs">
                The Men's Edit
              </span>
            </div>

            <h2 className="font-display text-[30px] font-medium leading-[1.1] tracking-tight text-[#1F2022] sm:text-[40px]">
              Made for movement.
              <span className="block italic font-normal text-[#637666]">
                Designed for comfort.
              </span>
            </h2>

            <p className="mt-3 max-w-[520px] text-xs leading-[1.8] text-[#6B6F76] sm:text-sm">
              Discover everyday essentials designed to feel
              effortless, fit comfortably, and move with you
              throughout your day.
            </p>
          </div>

          <Link
            to="/category/men-underwear"
            className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-[#D7D5CC] bg-white px-4 py-2.5 text-xs font-semibold text-[#1F2022] transition-all duration-300 hover:border-[#637666] hover:bg-[#637666] hover:text-white sm:self-auto"
          >
            Explore Men's Collection
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Five Premium Category Cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-5">

          {categories.map((category, index) => {
            const isBestseller =
              String(category.slug) === 'men-bestsellers';

            return (
              <Link
                key={category.slug}
                to={`/category/${category.slug}`}
                className="group relative flex min-w-0 flex-col overflow-hidden rounded-[18px] border border-[#E8E1D7] bg-white transition-all duration-500 hover:-translate-y-1.5 hover:border-[#A8B5A8] hover:shadow-[0_18px_45px_-20px_rgba(31,32,34,0.28)] sm:rounded-[22px]"
              >

                {/* Main Product Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-[#EEEAE4]">
                  <img
                    src={category.image}
                    alt={`${category.title} collection`}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                  />

                  {/* Alternative Product Image on Hover */}
                  <img
                    src={
                      hoverImages[String(category.slug)] ??
                      category.image
                    }
                    alt={`${category.title} alternative view`}
                    loading="lazy"
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-[1.07] group-hover:opacity-100"
                  />

                  {/* Premium Image Gradient */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#141815]/70 via-transparent to-[#141815]/10" />

                  {/* Top Category Badge */}
                  <div className="absolute left-3 top-3 z-10">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/90 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#263029] backdrop-blur-md sm:text-[10px]">
                      {isBestseller ? (
                        <>
                          <Sparkles className="h-3 w-3 text-[#637666]" />
                          Popular Picks
                        </>
                      ) : (
                        <>
                          <span className="font-numeral text-[#637666]">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          Men's Edit
                        </>
                      )}
                    </span>
                  </div>

                  {/* Demo Label */}
                  <div className="absolute right-3 top-3 z-10 hidden sm:block">
                    <DemoBadge
                      variant="subtle"
                      className="rounded-full bg-white/85 px-2 py-0.5"
                    />
                  </div>

                  {/* Category Title Over Image */}
                  <div className="absolute bottom-4 left-3 right-3 z-10 flex items-end justify-between gap-2 sm:bottom-5 sm:left-4 sm:right-4">
                    <div className="min-w-0 text-white">
                      <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#E6DDCC] sm:text-[10px]">
                        {category.tagline}
                      </p>

                      <h3 className="font-display text-lg font-medium leading-tight sm:text-[23px]">
                        {category.title}
                      </h3>
                    </div>

                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white text-[#1F2022] shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:bg-[#637666] group-hover:text-white sm:h-9 sm:w-9">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>

                {/* Product Category Information */}
                <div className="flex flex-1 flex-col justify-between px-3 pb-3 pt-3 sm:px-4 sm:pb-4 sm:pt-4">

                  <p className="line-clamp-2 min-h-[36px] text-[11px] leading-[1.6] text-[#666A66] sm:text-xs">
                    {category.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#ECE8E1] pt-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#526755] transition-colors group-hover:text-[#1F2022] sm:text-[11px]">
                      Shop Now
                      <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>

                    <span className="truncate text-right text-[10px] text-[#8A8B86]">
                      {category.itemCountDemo}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom Brand Statement */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-center sm:mt-8">
          <span className="h-px w-8 bg-[#CFC9BF]" />

          <span className="text-[10px] font-medium uppercase tracking-[0.17em] text-[#85877E] sm:text-xs">
            Comfort for every hour, every day
          </span>

          <span className="h-px w-8 bg-[#CFC9BF]" />
        </div>

      </Container>
    </section>
  );
}
