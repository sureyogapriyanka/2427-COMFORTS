
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { Container } from '../ui/Container';
import { useCatalog } from '../../context/CatalogContext';

const assetUrl = (path: string): string =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;

const hoverImages: Record<string, string> = {
  'women-bras': assetUrl('images/products/bras/w-b01-back.jpg'),
  'women-underwear': assetUrl('images/products/women-underwear/w-u01-back.jpg'),
  'women-camisoles': assetUrl('images/products/women-camisoles/w-c01-back.jpg'),
  'women-crop-tops': assetUrl('images/products/women-crop-tops/w-ct01-back.jpg'),
};

export function WomenCategories() {
  const { categories: catalogCategories } = useCatalog();
  const categories = [
    ...catalogCategories.filter((category) => category.gender === 'women'),
    {
      slug: 'women-bestsellers',
      gender: 'women' as const,
      title: 'Bestsellers',
      tagline: 'Catalog Picks',
      description: 'Browse products marked Bestseller in the catalog.',
      image: assetUrl('images/products/bras/w-b01-front.jpg'),
      itemCountDemo: 'Top Picks',
    },
  ];

  return (
    <section className="bg-[#FAF9F7] py-8 sm:py-12">
      <Container>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#637666]">
              2427 ÉLAN
            </span>

            <h2 className="mt-1 font-display text-2xl font-semibold text-[#202020] sm:text-3xl">
              Shop Women's Essentials
            </h2>

            <p className="mt-1 text-sm text-[#666666]">
              Everyday softness and effortless comfort.
            </p>
          </div>

          <Link
            to="/category/women-bras"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#202020] hover:text-[#637666]"
          >
            Explore Women
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {categories.map((category) => {
            const isBestseller = category.slug === 'women-bestsellers';

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
