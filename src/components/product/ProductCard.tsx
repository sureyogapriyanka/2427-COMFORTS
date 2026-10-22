
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Eye,
  Check,
} from 'lucide-react';

import { Product, formatINR } from '../../data/catalog';
import { useStore } from '../../context/StoreContext';
import { ColorDots } from './ColorDots';
import { RatingStars } from './RatingStars';
import { DemoBadge } from '../brand/DemoBadge';

interface ProductCardProps {
  product: Product;
  className?: string;
}

// Works with local development and GitHub Pages
const getImageUrl = (path: string): string => {
  if (!path) return '';

  if (
    /^(https?:)?\/\//i.test(path) ||
    /^(data:|blob:)/i.test(path)
  ) {
    return path;
  }

  const base = import.meta.env.BASE_URL || '/';

  if (path.startsWith(base)) {
    return path;
  }

  return `${base}${path.replace(/^\/+/, '')}`;
};

export function ProductCard({
  product,
  className = '',
}: ProductCardProps) {
  const {
    isInWishlist,
    toggleWishlist,
    addToCart,
    openOverlay,
  } = useStore();

  const [selectedColor, setSelectedColor] = useState(
    product.colors[0]?.name || ''
  );

  const [selectedSize, setSelectedSize] = useState(
    product.sizes[0] || 'M'
  );

  const [isAdding, setIsAdding] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const primaryImage = getImageUrl(product.image);
  const alternateImage = getImageUrl(
    product.hoverImage || product.image
  );

  const hasAlternateImage =
    Boolean(product.hoverImage) &&
    alternateImage !== primaryImage;

  useEffect(() => {
    setSelectedColor(product.colors[0]?.name || '');
    setSelectedSize(product.sizes[0] || 'M');
    setIsAdding(false);
  }, [product.id]);

  useEffect(() => {
    if (!isAdding) return;

    const timer = window.setTimeout(() => {
      setIsAdding(false);
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [isAdding]);

  const handleQuickAdd = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAdding) return;

    addToCart(product, selectedColor, selectedSize, 1);
    setIsAdding(true);
  };

  const handleWishlistClick = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    toggleWishlist(product.id);
  };

  const handleQuickView = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    openOverlay('quickview', product);
  };

  return (
    <article
      className={`group relative flex min-w-0 flex-col overflow-hidden rounded-[20px] border border-[#E8E1D7] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#C8D0C5] hover:shadow-lg ${className}`}
    >
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#F4F0EB]">

        <Link
          to={`/product/${product.slug}`}
          className="absolute inset-0 block"
          aria-label={`View ${product.name} details`}
        >
          <img
            src={primaryImage}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-[1.04]"
          />

          {hasAlternateImage && (
            <img
              src={alternateImage}
              alt={`${product.name} alternate view`}
              loading="lazy"
              className="pointer-events-none absolute inset-0 h-full w-full object-contain p-2 opacity-0 transition-all duration-500 group-hover:opacity-100"
            />
          )}
        </Link>

        {/* Product Badges */}
        <div className="pointer-events-none absolute left-2.5 top-2.5 z-10 flex max-w-[65%] flex-col items-start gap-1">
          {product.badge && (
            <span
              className={`rounded-full px-2 py-1 text-[9px] font-semibold uppercase tracking-wide ${product.badge.includes('Save')
                  ? 'bg-[#A85A3C] text-white'
                  : product.badge === 'New'
                    ? 'bg-[#637666] text-white'
                    : 'bg-[#1F2022] text-white'
                }`}
            >
              {product.badge}
            </span>
          )}

          <DemoBadge
            variant="subtle"
            className="rounded-full bg-white/90 px-2 py-0.5"
          />
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label={
            isFavorited
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={isFavorited}
          className={`absolute right-2.5 top-2.5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-sm transition-transform hover:scale-110 ${isFavorited
              ? 'text-[#A85A3C]'
              : 'text-[#1F2022]'
            }`}
        >
          <Heart
            className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''
              }`}
          />
        </button>

        {/* Quick View */}
        <button
          type="button"
          onClick={handleQuickView}
          aria-label={`Quick view ${product.name}`}
          className="absolute bottom-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#1F2022] shadow-sm transition-all hover:bg-[#637666] hover:text-white"
        >
          <Eye className="h-4 w-4" />
        </button>
      </div>

      {/* Product Information */}
      <div className="flex flex-1 flex-col p-3 sm:p-4">

        <div className="mb-1 flex flex-wrap items-center justify-between gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#637666]">
            {product.fabricBadge}
          </span>

          {product.rating ? (
            <RatingStars
              rating={product.rating}
              reviewCount={product.reviewCount}
            />
          ) : null}
        </div>

        {/* Product Name */}
        <Link to={`/product/${product.slug}`}>
          <h3 className="line-clamp-2 min-h-[40px] font-display text-base font-medium leading-snug text-[#1F2022] transition-colors hover:text-[#637666] sm:text-lg">
            {product.name}
          </h3>
        </Link>

        {/* Subtitle */}
        <p className="mt-1 line-clamp-1 text-[11px] text-[#6B6F76] sm:text-xs">
          {product.subtitle}
        </p>

        {/* Price */}
        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          <span className="font-numeral text-lg font-bold text-[#1F2022]">
            {formatINR(product.price)}
          </span>

          {product.compareAt && (
            <span className="text-xs text-[#92938D] line-through">
              {formatINR(product.compareAt)}
            </span>
          )}

          {product.isDemoPrice && (
            <span className="text-[10px] text-[#8C9097]">
              (Demo)
            </span>
          )}
        </div>

        {/* Colors */}
        <div className="mt-3 border-t border-[#EEEAE4] pt-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#85877E]">
              Colors
            </span>

            <span className="max-w-[90px] truncate text-[10px] text-[#637666]">
              {selectedColor}
            </span>
          </div>

          <ColorDots
            colors={product.colors}
            selectedColor={selectedColor}
            onSelect={setSelectedColor}
          />
        </div>

        {/* Size Selector */}
        <div className="mt-3">
          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-[#85877E]">
            Select Size
          </span>

          <div className="flex flex-wrap gap-1.5">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                aria-pressed={selectedSize === size}
                className={`flex h-8 min-w-8 items-center justify-center rounded-lg border px-2 text-[11px] font-semibold transition-colors ${selectedSize === size
                    ? 'border-[#1F2022] bg-[#1F2022] text-white'
                    : 'border-[#E8E1D7] bg-[#FAF8F5] text-[#555A54] hover:border-[#637666]'
                  }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Add to Bag */}
        <button
          type="button"
          onClick={handleQuickAdd}
          disabled={isAdding}
          className={`mt-auto flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all active:scale-[0.98] sm:text-sm ${isAdding
              ? 'bg-[#637666] text-white'
              : 'bg-[#1F2022] text-white hover:bg-[#526755]'
            }`}
          style={{ marginTop: '16px' }}
        >
          {isAdding ? (
            <>
              <Check className="h-4 w-4" />
              Added to Bag!
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" />
              Add to Bag • {selectedSize}
            </>
          )}
        </button>
      </div>
    </article>
  );
}
