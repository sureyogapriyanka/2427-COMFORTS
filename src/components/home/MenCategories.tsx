
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { MEN_CATEGORIES } from '../../data/catalog';
import { DemoBadge } from '../brand/DemoBadge';

export function MenCategories() {
  return (
    <section className="py-16 sm:py-20 bg-[#FAF8F5]">
      <Container>
        <SectionHeading
          eyebrow="The Men's Rotation"
          title="Engineered for Everyday Movement"
          description="Innerwear and foundation layers that stay put through grueling flights, active studio sessions, and long commutes."
          action={
            <Link
              to="/category/men-underwear"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#637666] hover:text-[#1F2022] transition-colors"
            >
              <span>View All Men's Styles</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MEN_CATEGORIES.map((cat, index) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-[#E8E1D7] shadow-xs transition-all duration-300 hover:shadow-xl hover:border-[#637666]/40 hover:-translate-y-1"
            >
              {/* Image Container with Zoom */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F4EFEB]">
                <img
                  src={
                    cat.image.startsWith('http')
                      ? cat.image
                      : `${import.meta.env.BASE_URL}${cat.image.replace(/^\/+/, '')}`
                  }
                  alt={`2427 ${cat.title}`}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#1F2022]/80 via-[#1F2022]/20 to-transparent" />

                {/* Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="rounded-full bg-white/90 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-numeral font-bold text-[#1F2022] shadow-xs">
                    0{index + 1} &bull; Men
                  </span>
                </div>

                <div className="absolute top-3 right-3 z-10">
                  <DemoBadge
                    variant="subtle"
                    className="bg-white/80 px-2 py-0.5 rounded-full"
                  />
                </div>

                {/* Arrow Icon in Image */}
                <div className="absolute bottom-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#1F2022] shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#637666] group-hover:text-white">
                  <ArrowUpRight className="h-4 w-4" />
                </div>

                {/* Overlay Text in Image */}
                <div className="absolute bottom-4 left-4 right-16 z-10 text-[#FAF8F5]">
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-[#D9CBB7]">
                    {cat.tagline}
                  </span>
                  <h3 className="font-display text-2xl font-medium leading-tight">
                    {cat.title}
                  </h3>
                </div>
              </div>

              {/* Bottom Card Copy */}
              <div className="p-4 flex flex-1 flex-col justify-between bg-white">
                <p className="text-xs text-[#5E6064] line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>

                <div className="mt-3 flex items-center justify-between text-[11px] font-medium text-[#6B6F76] pt-2 border-t border-[#E8E1D7]/50">
                  <span className="text-[#637666] font-semibold">
                    Explore Edit
                  </span>
                  <span className="font-numeral">
                    {cat.itemCountDemo}
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
