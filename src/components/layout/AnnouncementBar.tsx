import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const ANNOUNCEMENTS = [
  {
    text: 'Introductory Curation: Complimentary Pan-India Delivery on all orders above ₹999',
    cta: 'Explore Essentials',
    href: '/category/bundles',
  },
  {
    text: 'First Pair Comfort Guarantee: Love the fit in 30 days or enjoy a hassle-free exchange',
    cta: 'Learn More',
    href: '/about',
  },
  {
    text: 'Architectural Comfort: Discover Austrian MicroModal Air™ botanical second-skin',
    cta: 'Shop Innovation',
    href: '/category/new-arrivals',
  },
];

export function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  const current = ANNOUNCEMENTS[currentIndex];

  return (
    <div className="relative z-50 bg-[#1F2022] text-[#FAF8F5] px-4 py-2 text-xs transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="hidden sm:flex items-center gap-1.5 text-[#637666]">
          <Sparkles className="h-3.5 w-3.5" />
          <span className="font-semibold tracking-wider uppercase text-[10px] text-[#D9CBB7]">
            2427 Atelier
          </span>
        </div>

        {/* Central Rotating Message */}
        <div className="flex-1 text-center font-medium overflow-hidden">
          <div className="inline-flex items-center gap-2 transition-all duration-500">
            <span>{current.text}</span>
            <Link
              to={current.href}
              className="inline-flex items-center gap-0.5 underline underline-offset-4 text-[#D9CBB7] hover:text-white transition-colors"
            >
              <span>{current.cta}</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="text-[#FAF8F5]/60 hover:text-white transition-colors ml-2"
          aria-label="Dismiss banner"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
