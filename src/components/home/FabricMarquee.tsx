
import React from 'react';
import { Container } from '../ui/Container';

const MARQUEE_ITEMS = [
  'Austrian MicroModal Air™',
  'Pure Supima® 80s Cotton',
  'Zero-Wire Ergonomic Lift',
  'Thermal Sonic Bonded Edges',
  'Natural Bamboo Eco-Mesh',
  'No-Roll Brushed Waistbands',
  'OEKO-TEX® Certified Non-Toxic',
  'Four-Way Multidirectional Stretch',
  'Zero Panty Line Guarantee',
];

export function FabricMarquee() {
  return (
    <section className="bg-[#FAF8F5] py-4 sm:py-5">
      <Container>
        <div className="relative w-full overflow-hidden rounded-xl border border-[#E8E1D7] bg-[#F4EFEB] py-3.5 sm:py-4">

          {/* Continuous Rolling Text */}
          <div className="animate-ticker flex w-max items-center gap-8 whitespace-nowrap">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
              <div
                key={idx}
                className="flex shrink-0 items-center gap-6"
              >
                <span className="font-numeral text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1F2022] sm:text-xs">
                  {item}
                </span>

                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#637666]" />
              </div>
            ))}
          </div>

          {/* Subtle Premium Edge Gradients */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#F4EFEB] to-transparent sm:w-12" />

          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#F4EFEB] to-transparent sm:w-12" />

        </div>
      </Container>
    </section>
  );
}
