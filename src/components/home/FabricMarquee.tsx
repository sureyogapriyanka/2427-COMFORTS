import React from 'react';

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
    <div className="border-y border-[#E8E1D7] bg-[#F4EFEB] py-3.5 overflow-hidden">
      <div className="animate-ticker flex items-center gap-8 whitespace-nowrap">
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
          <div key={idx} className="flex items-center gap-6">
            <span className="font-numeral text-xs font-semibold uppercase tracking-[0.2em] text-[#1F2022]">
              {item}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#637666]" />
          </div>
        ))}
      </div>
    </div>
  );
}
