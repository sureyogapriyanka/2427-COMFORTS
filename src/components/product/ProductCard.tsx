
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Eye,
  ArrowUpRight,
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
    }, 1400);

    return () => window.clearTimeout(timer);
  }, [isAdding]);

  const handleQuickAdd = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAdding) return;

    addToCart(
      product,
      selectedColor,
      selectedSize,
      1
    );

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
      className={`group relative flex min-w-0 flex-col overflow-hidden rounded-[20px] border border-[#E8E1D7] bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-[#C8D0C5] hover:shadow-[0_20px_50px_-25px_rgba(31,32,34,0.35)] sm:rounded-[24px] ${className}`}
    >
      {/* Premium Product Image */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F1EDE7]">
        <Link
          to={`/product/${product.slug}`}
          className="absolute inset-0 z-0 block"
          aria-label={`View ${product.name} details`}
        >
          <img
            src={primaryImage}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-[1.06]"
          />

          {hasAlternateImage && (
            <img
              src={alternateImage}
              alt={`${product.name} alternate view`}
              loading="lazy"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-0 transition-all duration-700 ease-out group-hover:scale-[1.06] group-hover:opacity-100"
            />
          )}
        </Link>

        {/* Soft Image Shading */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10" />

        {/* Product Labels */}
        <div className="pointer-events-none absolute left-3 top-3 z-10 flex max-w-[70%] flex-col items-start gap-1.5">
          {product.badge && (
            <span
              className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] shadow-sm sm:text-[10px] ${product.badge.includes('Save')
                ? 'bg-[#A85A3C] text-white'
                : product.badge === 'New'
                  ? 'bg-[#637666] text-white'
                  : 'bg-[#1F2022] text-white'
                }`}
            >
              {product.badge}
            </span>
          )}

          {product.code && (
            <span className="rounded-full border border-white/20 bg-[#1F2022]/85 px-2.5 py-1 text-[9px] font-semibold text-white backdrop-blur-sm">
              {product.code}
            </span>
          )}

          <DemoBadge
            variant="subtle"
            className="rounded-full bg-white/85 px-2 py-0.5 backdrop-blur-sm"
          />
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label={
            isFavorited
              ? `Remove ${product.name} from wishlist`
              : `Save ${product.name} to wishlist`
          }
          aria-pressed={isFavorited}
          className={`absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/95 shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-110 ${isFavorited
            ? 'text-[#A85A3C]'
            : 'text-[#1F2022] hover:text-[#A85A3C]'
            }`}
        >
          <Heart
            className={`h-[17px] w-[17px] ${isFavorited ? 'fill-current' : ''
              }`}
          />
        </button>

        {/* Quick View */}
        <button
          type="button"
          onClick={handleQuickView}
          className="absolute bottom-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/95 text-[#1F2022] shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-[#637666] hover:text-white sm:bottom-4 sm:right-4 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:focus:translate-y-0 sm:focus:opacity-100"
          aria-label={`Quick view ${product.name}`}
        >
          <Eye className="h-4 w-4" />
        </button>

        {/* Image Corner Detail */}
        <div className="pointer-events-none absolute bottom-4 left-4 hidden items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white drop-shadow-md sm:flex">
          Discover
          <ArrowUpRight className="h-3 w-3" />
        </div>
      </div>

      {/* Product Information */}
      <div className="flex flex-1 flex-col px-3 pb-4 pt-4 sm:px-4 sm:pb-5 sm:pt-5">
        <div className="mb-2 flex min-h-[20px] flex-wrap items-center justify-between gap-2">
          <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#637666] sm:text-[10px]">
            {product.fabricBadge}
          </span>

          {product.rating ? (
            <RatingStars
              rating={product.rating}
              reviewCount={product.reviewCount}
            />
          ) : product.code ? (
            <span className="text-[10px] text-[#8C9097]">
              Ref: {product.code}
            </span>
          ) : null}
        </div>

        <Link
          to={`/product/${product.slug}`}
          className="block"
        >
          <h3 className="line-clamp-2 min-h-[42px] font-display text-[17px] font-medium leading-[1.25] text-[#1F2022] transition-colors duration-300 hover:text-[#637666] sm:text-xl">
            {product.name}
          </h3>
        </Link>

        <p className="mt-1 line-clamp-2 min-h-[30px] text-[11px] leading-relaxed text-[#737670] sm:text-xs">
          {product.subtitle}
        </p>

        {/* Price */}
        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="font-numeral text-lg font-bold tracking-tight text-[#1F2022] sm:text-xl">
            {formatINR(product.price)}
          </span>

          {product.compareAt && (
            <span className="font-numeral text-xs text-[#8C9097] line-through">
              {formatINR(product.compareAt)}
            </span>
          )}

          {product.isDemoPrice && (
            <span className="text-[10px] text-[#8C9097]">
              (Demo)
            </span>
          )}
        </div>

        {/* Color Selector */}
        <div className="mt-3 border-t border-[#EEEAE4] pt-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#85877E]">
              Available Colors
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
          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#85877E]">
            Select Size
          </span>

          <div className="flex flex-wrap gap-1.5">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                aria-pressed={selectedSize === size}
                className={`flex h-8 min-w-8 items-center justify-center rounded-lg border px-2 text-[11px] font-semibold transition-all duration-200 ${selectedSize === size
                  ? 'border-[#1F2022] bg-[#1F2022] text-white'
                  : 'border-[#E8E1D7] bg-[#FAF8F5] text-[#555A54] hover:border-[#637666]'
                  }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Add to Bag Button */}
        <button
          type="button"
          onClick={handleQuickAdd}
          disabled={isAdding}
          className={`mt-auto flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-semibold transition-all duration-300 active:scale-[0.98] sm:text-sm ${isAdding
            ? 'bg-[#637666] text-white'
            : 'bg-[#1F2022] text-white hover:bg-[#526755] hover:shadow-lg'
            }`}
          style={{ marginTop: '20px' }}
        >
          {isAdding ? (
            <>
              <Check className="h-4 w-4" />
              Added to Bag!
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" />
              Add to Bag
              <span className="text-white/60">
                • {selectedSize}
              </span>
            </>
          )}
        </button>
      </div>
    </article>
  );
}
