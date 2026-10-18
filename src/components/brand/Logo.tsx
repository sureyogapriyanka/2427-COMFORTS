import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  inverted?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSubtitle?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Logo({
  inverted = false,
  size = 'md',
  showSubtitle = true,
  onClick,
  className = '',
}: LogoProps) {
  // Size-specific typography & geometry
  const sizeStyles = {
    sm: {
      mark: 'text-xl tracking-tight',
      sub: 'text-[8px] tracking-[0.24em] mt-0.5',
      frame: 'px-2 py-0.5',
    },
    md: {
      mark: 'text-2xl sm:text-[26px] tracking-tight font-bold',
      sub: 'text-[9px] sm:text-[9.5px] tracking-[0.32em] mt-0.5 font-medium',
      frame: 'px-2.5 py-1',
    },
    lg: {
      mark: 'text-3xl sm:text-4xl tracking-tight font-bold',
      sub: 'text-[10px] sm:text-xs tracking-[0.36em] mt-1 font-semibold',
      frame: 'px-3.5 py-1.5',
    },
    hero: {
      mark: 'text-5xl sm:text-7xl lg:text-8xl tracking-tight font-black',
      sub: 'text-xs sm:text-sm tracking-[0.45em] mt-2 font-medium',
      frame: 'px-6 py-3',
    },
  }[size];

  return (
    <Link
      to="/"
      onClick={onClick}
      className={`group inline-flex flex-col items-start transition-opacity hover:opacity-90 ${className}`}
      aria-label="2427 Innerwear & Essentials Home"
    >
      <div className="flex items-center gap-2">
        {/* Typographic Monogram Emblem */}
        <div
          className={`relative flex items-center justify-center rounded-lg border font-numeral transition-colors ${
            inverted
              ? 'border-[#FAF8F5]/30 bg-[#FAF8F5]/10 text-[#FAF8F5] group-hover:border-[#637666]'
              : 'border-[#1F2022]/15 bg-[#1F2022] text-[#FAF8F5] group-hover:bg-[#2A2C30]'
          } ${sizeStyles.frame}`}
        >
          <span className="font-numeral font-bold tracking-tighter">24</span>
          <span className="mx-1 h-3 w-[1.5px] rounded-full bg-[#637666]" />
          <span className="font-numeral font-bold tracking-tighter text-[#E8E1D7]">27</span>
        </div>

        {/* Brand Name Spelled Wordmark */}
        <span
          className={`font-numeral font-bold leading-none ${sizeStyles.mark} ${
            inverted ? 'text-[#FAF8F5]' : 'text-[#1F2022]'
          }`}
        >
          2427
        </span>
      </div>

      {showSubtitle && (
        <span
          className={`uppercase font-sans ${sizeStyles.sub} ${
            inverted ? 'text-[#FAF8F5]/60' : 'text-[#637666]'
          }`}
        >
          Innerwear &bull; Atelier
        </span>
      )}
    </Link>
  );
}
