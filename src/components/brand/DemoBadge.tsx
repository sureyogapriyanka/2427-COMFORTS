import React from 'react';
import { Info } from 'lucide-react';

interface DemoBadgeProps {
  className?: string;
  variant?: 'subtle' | 'pill' | 'banner';
}

export function DemoBadge({ className = '', variant = 'pill' }: DemoBadgeProps) {
  if (variant === 'banner') {
    return (
      <div className={`flex items-center justify-center gap-2 border-b border-[#E8E1D7] bg-[#F4EFEB] px-4 py-1.5 text-center text-xs text-[#5E6064] ${className}`}>
        <Info className="h-3.5 w-3.5 text-[#637666] shrink-0" />
        <span>
          <strong className="font-semibold text-[#1F2022]">Phase 1 Development Preview:</strong> All product specifications, prices, fabrics, and reviews are prototype demo data.
        </span>
      </div>
    );
  }

  if (variant === 'subtle') {
    return (
      <span className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#6B6F76] ${className}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-[#637666]/60 animate-pulse" />
        Demo Item
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-[#E8E1D7] bg-[#FAF8F5]/90 px-2 py-0.5 text-[10px] font-medium tracking-wider text-[#6B6F76] backdrop-blur-xs shadow-xs ${className}`}
      title="Unverified prototype sample data for interface demonstration"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#637666]" />
      Demo Content
    </span>
  );
}
