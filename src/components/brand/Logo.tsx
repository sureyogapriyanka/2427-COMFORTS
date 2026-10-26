
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
  const sizeStyles = {
    sm: {
      mark: 'text-sm sm:text-base tracking-[0.08em]',
      frame: 'px-2 py-1 text-base',
      gap: 'gap-2',
    },
    md: {
      mark: 'text-lg sm:text-xl tracking-[0.08em]',
      frame: 'px-2.5 py-1.5 text-lg sm:text-xl',
      gap: 'gap-2.5',
    },
    lg: {
      mark: 'text-2xl sm:text-3xl tracking-[0.08em]',
      frame: 'px-3 py-2 text-2xl sm:text-3xl',
      gap: 'gap-3',
    },
    hero: {
      mark: 'text-3xl sm:text-5xl tracking-[0.08em]',
      frame: 'px-4 py-3 text-3xl sm:text-5xl',
      gap: 'gap-4',
    },
  }[size];

  return (
    <Link
      to="/"
      onClick={onClick}
      className={`group inline-flex items-center ${sizeStyles.gap} transition-opacity hover:opacity-90 ${className}`}
      aria-label="2427 ÉLAN Home"
    >
      {/* Existing 24 | 27 brand emblem */}
      <div
        className={`relative flex shrink-0 items-center justify-center rounded-lg border font-numeral font-bold transition-colors ${inverted
            ? 'border-white/20 bg-white/10 text-white'
            : 'border-[#202020] bg-[#202020] text-white group-hover:bg-black'
          } ${sizeStyles.frame}`}
      >
        <span className="tracking-tighter">24</span>
        <span className="mx-1.5 h-4 w-px rounded-full bg-[#9BAA9D]" />
        <span className="tracking-tighter text-[#E8E1D7]">27</span>
      </div>

      {/* Brand name without duplicate 2427 */}
      {showSubtitle && (
        <span
          className={`whitespace-nowrap font-sans font-bold leading-none ${sizeStyles.mark} ${inverted ? 'text-white' : 'text-[#202020]'
            }`}
        >
          ÉLAN
        </span>
      )}
    </Link>
  );
}
