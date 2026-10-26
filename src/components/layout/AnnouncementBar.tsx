import React, { useState } from 'react';
import { X } from 'lucide-react';

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative z-50 bg-[#202020] text-white px-4 py-2 text-[11px] sm:text-xs tracking-wide">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex-1 text-center font-medium">
          2427 ÉLAN <span className="mx-2 text-white/40">·</span>
          Everyday Comfort. Elevated.
        </div>

        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="text-white/60 hover:text-white transition-colors ml-2"
          aria-label="Dismiss announcement"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
