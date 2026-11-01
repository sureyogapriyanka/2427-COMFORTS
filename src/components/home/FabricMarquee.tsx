
import React from 'react';
import { Container } from '../ui/Container';

const MARQUEE_ITEMS = [
  'FEEL GOOD. WEAR BETTER.',
  'COMFORT THAT MOVES WITH YOU.',
  'MADE FOR YOUR EVERYDAY.',
  'YOUR COMFORT. YOUR ÉLAN.',
];

export function FabricMarquee() {
  return (
    <section className="bg-elan-ivory py-4 sm:py-5">
      <Container>
        <div className="relative w-full min-w-0 overflow-hidden rounded-xl border border-[#E8E1D7] bg-[#F4EFEB] py-3.5 sm:py-4">
          <div className="animate-ticker flex w-max items-center whitespace-nowrap">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                aria-hidden={copy === 1}
                className="flex shrink-0 items-center gap-7 pr-7"
              >
                {MARQUEE_ITEMS.map((item) => (
                  <div
                    key={`${copy}-${item}`}
                    className="flex shrink-0 items-center gap-5"
                  >
                    <span className="font-numeral text-[11px] font-semibold uppercase tracking-[0.16em] text-elan-ink sm:text-xs sm:tracking-[0.18em]">
                      {item}
                    </span>

                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-elan-sage" />
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#F4EFEB] to-transparent sm:w-12" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#F4EFEB] to-transparent sm:w-12" />
        </div>
      </Container>
    </section>
  );
}
