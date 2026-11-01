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
    <div className={`inline-flex items-center gap-1.5 text-xs text-elan-muted ${className}`}>
      <div className="flex items-center text-elan-sage">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`${
              star <= Math.round(rating)
                ? 'fill-[#637666] text-elan-sage'
                : 'fill-transparent text-elan-ivory'
            }`}
          />
        ))}
      </div>
      {showCount && (
        <span className="font-numeral text-[11px] font-medium text-elan-ink">
          {rating.toFixed(1)} {reviewCount ? `(${reviewCount})` : ''}
        </span>
      )}
    </div>
  );
}
