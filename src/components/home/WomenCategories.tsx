
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { WOMEN_CATEGORIES } from '../../data/catalog';
import { DemoBadge } from '../brand/DemoBadge';

const productImage = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;

const hoverImages: Record<string, string> = {
  'women-bras': productImage(
    'images/products/bras/w-b01-back.jpg'
  ),
  'women-underwear': productImage(
    'images/products/women-underwear/w-u01-back.jpg'
  ),
  'women-camisoles': productImage(
    'images/products/women-camisoles/w-c01-back.jpg'
  ),
  'women-crop-tops': productImage(
    'images/products/women-crop-tops/w-ct01-back.jpg'
  ),
  'women-bestsellers': productImage(
    'images/products/bras/w-b02-front.jpg'
  ),
};

const bestsellers = {
  slug: 'women-bestsellers',
  gender: 'women',
  title: 'Bestsellers',
  tagline: 'Popular Picks',
  description:
    'Discover standout styles from our women’s everyday essentials collection.',
  image: productImage(
    'images/products/bras/w-b01-front.jpg'
  ),
  itemCountDemo: 'Top Picks',
};

const categories = [
  ...WOMEN_CATEGORIES.filter(
    (category) => String(category.slug) !== 'women-bestsellers'
  ),
  bestsellers,
];

export function WomenCategories() {
  return (
    <section className="bg-[#FAF8F5] py-12 sm:py-16">
      <Container>
        <SectionHeading
          eyebrow="The Women's Edit"
          title="Everyday Comfort, Beautifully Designed"
          description="Discover thoughtfully designed essentials for everyday comfort and effortless movement."
          action={
            <Link
              to="/category/women-bras"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#637666] transition-colors hover:text-[#1F2022]"
            >
              <span>View All Women's Styles</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          }
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              to={`/category/${category.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#E8E1D7] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#637666]/40 hover:shadow-xl"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F4EFEB]">
                {/* Normal Category Image */}
                <img
                  src={category.image}
                  alt={`${category.title} category`}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Automatic Product Preview on Hover */}
                <img
                  src={hoverImages[String(category.slug)] ?? category.image}
                  alt={`${category.title} product preview`}
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                  loading="lazy"
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1F2022]/80 via-[#1F2022]/20 to-transparent" />

                <div className="absolute left-3 top-3 z-10">
                  <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-[#1F2022]">
                    {category.slug === 'women-bestsellers'
                      ? '★ Bestsellers'
                      : `0${index + 1} • Women`}
                  </span>
                </div>

                <div className="absolute right-3 top-3 z-10">
                  <DemoBadge
                    variant="subtle"
                    className="rounded-full bg-white/80 px-2 py-0.5"
                  />
                </div>

                <div className="absolute bottom-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#1F2022]">
                  <ArrowUpRight className="h-4 w-4" />
                </div>

                <div className="absolute bottom-4 left-4 right-16 z-10 text-[#FAF8F5]">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#D9CBB7]">
                    {category.tagline}
                  </span>
                  <h3 className="font-display text-2xl font-medium leading-tight">
                    {category.title}
                  </h3>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between bg-white p-4">
                <p className="line-clamp-2 text-xs leading-relaxed text-[#5E6064]">
                  {category.description}
                </p>

                <div className="mt-3 flex items-center justify-between border-t border-[#E8E1D7]/50 pt-2 text-[11px] font-medium text-[#6B6F76]">
                  <span className="font-semibold text-[#637666]">
                    Explore Edit
                  </span>
                  <span className="font-numeral">
                    {category.itemCountDemo}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
