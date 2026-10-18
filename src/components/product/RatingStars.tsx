import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating?: number;
  reviewCount?: number;
  size?: number;
  showCount?: boolean;
  className?: string;
}

export function RatingStars({
  rating,
  reviewCount,
  size = 13,
  showCount = true,
  className = '',
}: RatingStarsProps) {
  if (!rating || rating <= 0) return null;

  return (
    <div className={`inline-flex items-center gap-1.5 text-xs text-[#5E6064] ${className}`}>
      <div className="flex items-center text-[#637666]">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`${
              star <= Math.round(rating)
                ? 'fill-[#637666] text-[#637666]'
                : 'fill-transparent text-[#E8E1D7]'
            }`}
          />
        ))}
      </div>
      {showCount && (
        <span className="font-numeral text-[11px] font-medium text-[#1F2022]">
          {rating.toFixed(1)} {reviewCount ? `(${reviewCount})` : ''}
        </span>
      )}
    </div>
  );
}
