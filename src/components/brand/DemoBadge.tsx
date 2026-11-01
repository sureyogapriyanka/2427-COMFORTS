import React from 'react';
import { Info } from 'lucide-react';

interface DemoBadgeProps {
  className?: string;
  variant?: 'subtle' | 'pill' | 'banner';
}

export function DemoBadge({ className = '', variant = 'pill' }: DemoBadgeProps) {
  if (variant === 'banner') {
    return (
      <div className={`flex items-center justify-center gap-2 border-b border-[#E8E1D7] bg-[#F4EFEB] px-4 py-1.5 text-center text-xs text-elan-muted ${className}`}>
        <Info className="h-3.5 w-3.5 text-elan-sage shrink-0" />
        <span>
          <strong className="font-semibold text-elan-ink">Client preview:</strong> Product details, prices, availability and any review indicators are demonstration data and require business approval.
        </span>
      </div>
    );
  }

  if (variant === 'subtle') {
    return (
      <span className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-elan-muted ${className}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-elan-sage/60 animate-pulse" />
        Demo Item
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-[#E8E1D7] bg-elan-ivory/90 px-2 py-0.5 text-[10px] font-medium tracking-wider text-elan-muted backdrop-blur-xs shadow-xs ${className}`}
      title="Demonstration data; product and commercial details are not verified"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-elan-sage" />
      Demo Content
    </span>
  );
}
