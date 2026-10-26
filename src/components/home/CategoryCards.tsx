import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Container } from '../ui/Container';

const assetUrl = (path: string): string =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;

const collections = [
  {
    title: "Men's Collection",
    description: 'Comfort that keeps up with you.',
    cta: 'SHOP MEN',
    to: '/category/men-underwear',
    image: 'elan-approved-men-card.webp',
    imageWidth: 227,
    imageHeight: 207,
    alt: 'Adult male model wearing a black vest',
  },
  {
    title: "Women's Collection",
    description: 'Confidence in every layer.',
    cta: 'SHOP WOMEN',
    to: '/category/women-bras',
    image: 'elan-approved-women-card.webp',
    imageWidth: 181,
    imageHeight: 207,
    alt: 'Adult female model wearing neutral innerwear',
  },
  {
    title: 'New Arrivals',
    description: 'Fresh styles for your everyday.',
    cta: 'EXPLORE',
    to: '/category/new-arrivals',
    image: 'elan-approved-new-arrivals-card.webp',
    imageWidth: 278,
    imageHeight: 207,
    alt: 'Flat-lay of mauve, black, and blush underwear',
  },
  {
    title: 'Best Sellers',
    description: 'Explore the bestseller edit.',
    cta: 'SHOP NOW',
    to: '/category/bestsellers',
    image: 'elan-approved-bestsellers-card.webp',
    imageWidth: 248,
    imageHeight: 207,
    alt: 'Folded black, navy, and olive boxers',
  },
];

export function CategoryCards() {
  return (
    <section className="bg-white py-2 sm:py-3">
      <Container size="full" className="!px-0">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
          {collections.map((collection) => (
            <Link
              key={collection.title}
              to={collection.to}
              className="group relative flex min-h-[205px] min-w-0 overflow-hidden border border-[#EAE5DF] bg-[#F4F0EA] sm:min-h-[245px] lg:min-h-[210px]"
            >
              <div className="relative z-10 flex w-[60%] flex-col items-start justify-center px-4 py-4 sm:w-[56%] sm:px-5 lg:px-6">
                <h2 className="font-sans text-sm font-semibold leading-snug text-[#171716] sm:text-base">
                  {collection.title}
                </h2>
                <p className="mt-2 max-w-[15rem] text-xs leading-4 text-[#393632] sm:text-sm sm:leading-5">
                  {collection.description}
                </p>
                <span className="mt-4 inline-flex min-h-9 items-center gap-1.5 bg-[#111111] px-3 text-[9px] font-semibold tracking-wide text-white transition-colors group-hover:bg-[#343434] sm:min-h-10 sm:gap-2 sm:px-4 sm:text-[10px]">
                  {collection.cta}
                  <ArrowRight
                    className="h-3 w-3 sm:h-3.5 sm:w-3.5"
                    aria-hidden="true"
                  />
                </span>
              </div>

              <div className="absolute inset-y-0 right-0 w-[48%] overflow-hidden sm:w-[50%]">
                <img
                  src={assetUrl(
                    `images/home/approved-reference-crops/${collection.image}`
                  )}
                  alt={collection.alt}
                  width={collection.imageWidth}
                  height={collection.imageHeight}
                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
