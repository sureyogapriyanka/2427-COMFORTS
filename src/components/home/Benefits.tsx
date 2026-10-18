import React from 'react';
import { ShieldCheck, Truck, Leaf, Headphones, Star, CheckCircle } from 'lucide-react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { BRAND_VALUES, DEMO_REVIEWS } from '../../data/catalog';
import { DemoBadge } from '../brand/DemoBadge';

export function Benefits() {
  const iconMap: Record<string, React.ReactNode> = {
    ShieldCheck: <ShieldCheck className="h-6 w-6 text-[#637666]" />,
    Truck: <Truck className="h-6 w-6 text-[#637666]" />,
    Leaf: <Leaf className="h-6 w-6 text-[#637666]" />,
    Headphones: <Headphones className="h-6 w-6 text-[#637666]" />,
  };

  return (
    <section className="py-20 sm:py-28 bg-[#F4EFEB]/60 border-y border-[#E8E1D7]">
      <Container>
        {/* Shopping Benefits Pillars */}
        <SectionHeading
          align="center"
          eyebrow="The 2427 Standard"
          title="Designed for Total Peace of Mind"
          description="We obsess over your physical ease. From our first pair trial guarantee to express pan-India doorstep delivery."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BRAND_VALUES.map((val) => (
            <div
              key={val.title}
              className="rounded-2xl bg-white p-6 sm:p-8 border border-[#E8E1D7] shadow-xs transition-all hover:shadow-lg hover:border-[#637666]/40"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#637666]/10 mb-5">
                {iconMap[val.icon]}
              </div>
              <h3 className="font-display text-xl font-medium text-[#1F2022]">
                {val.title}
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-[#5E6064] leading-relaxed">
                {val.description}
              </p>
            </div>
          ))}
        </div>

        {/* Community Feedback / Testimonials (Identified Demo Content) */}
        <div className="mt-20 pt-16 border-t border-[#E8E1D7]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="eyebrow">Community Rotation</span>
                <DemoBadge variant="pill" />
              </div>
              <h3 className="font-display text-3xl sm:text-4xl font-medium text-[#1F2022]">
                Notes from the Daily Rotation
              </h3>
            </div>
            <p className="text-xs text-[#6B6F76] max-w-sm">
              *Prototype Preview: Sample tester experiences for development demonstration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DEMO_REVIEWS.map((rev) => (
              <blockquote
                key={rev.id}
                className="rounded-2xl bg-white p-6 sm:p-8 border border-[#E8E1D7] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex text-[#637666]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-[#637666]" />
                      ))}
                    </div>
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-[#6B6F76] bg-[#FAF8F5] px-2 py-0.5 rounded-full border border-[#E8E1D7]">
                      Demo Feedback
                    </span>
                  </div>

                  <p className="font-display text-lg text-[#1F2022] leading-relaxed italic">
                    “{rev.quote}”
                  </p>
                </div>

                <footer className="mt-6 pt-4 border-t border-[#E8E1D7] text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1F2022]">{rev.author}</span>
                    <span className="text-[#6B6F76]">{rev.location}</span>
                  </div>
                  <span className="text-[11px] text-[#637666] mt-0.5 block">
                    Verified Fit: {rev.product}
                  </span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
