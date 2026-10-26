
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { Container } from '../ui/Container';
import { useCatalog } from '../../context/CatalogContext';

const assetUrl = (path: string): string =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;

const hoverImages: Record<string, string> = {
  'men-underwear': assetUrl('images/products/underwear/m-ub01-alt.jpg'),
  'men-boxers': assetUrl('images/products/boxers/m-bx01-airbox-alt.jpg'),
  'men-vests': assetUrl('images/products/vests/m-v01-alt.jpg'),
  'men-sleeveless': assetUrl('images/products/sleeveless/m-s01-back.jpg'),
};

export function MenCategories() {
  const { categories: catalogCategories } = useCatalog();
  const categories = [
    ...catalogCategories.filter((category) => category.gender === 'men'),
    {
      slug: 'men-bestsellers',
      gender: 'men' as const,
      title: 'Bestsellers',
      tagline: 'Catalog Picks',
      description: 'Browse products marked Bestseller in the catalog.',
      image: assetUrl('images/products/underwear/m-ub01-front.jpg'),
      itemCountDemo: 'Top Picks',
    },
  ];

  return (
    <section className="bg-white py-8 sm:py-12">
      <Container>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#637666]">
              2427 ÉLAN
            </span>

            <h2 className="mt-1 font-display text-2xl font-semibold text-[#202020] sm:text-3xl">
              Shop Men's Essentials
            </h2>

            <p className="mt-1 text-sm text-[#666666]">
              Discover everyday comfort, made for you.
            </p>
          </div>

          <Link
            to="/category/men-underwear"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#202020] hover:text-[#637666]"
          >
            Explore Men
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {categories.map((category) => {
            const isBestseller = category.slug === 'men-bestsellers';

            const categoryLink = isBestseller
              ? '/category/bestsellers'
              : `/category/${category.slug}`;

            const hoverImage = hoverImages[category.slug];

            return (
              <Link
                key={category.slug}
                to={categoryLink}
                className="group min-w-0 overflow-hidden rounded-xl border border-[#E8E5E0] bg-white transition-colors hover:border-[#637666]"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#F8F7F5] p-3">
                  <img
                    src={category.image}
                    alt={`${category.title} collection`}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  />

                  {hoverImage && (
                    <img
                      src={hoverImage}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      className="pointer-events-none absolute inset-0 h-full w-full object-contain p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  )}

                  {isBestseller && (
                    <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded bg-white px-2 py-1 text-[10px] font-semibold text-[#202020]">
                      <Sparkles className="h-3 w-3" />
                      Bestseller
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 p-3 sm:p-4">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-[#202020] sm:text-base">
                      {category.title}
                    </h3>
                    <p className="mt-0.5 truncate text-[11px] text-[#777777]">
                      {category.tagline}
                    </p>
                  </div>

                  <ArrowUpRight className="h-4 w-4 shrink-0 text-[#637666] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
