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
import { ProductAvailabilityNote } from './ProductAvailabilityNote';
import { getSizeAvailability } from '../../data/sizeInventory';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const getImageUrl = (path: string): string => {
  if (!path) return '';
  if (/^(https?:)?\/\//i.test(path) || /^(data:|blob:)/i.test(path)) {
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
  const isUnavailable = product.inventoryStatus === 'out_of_stock';

  const primaryImage = getImageUrl(product.image);
  const alternateImage = getImageUrl(
    product.hoverImage || product.image
  );

  const hasAlternateImage =
    Boolean(product.hoverImage) &&
    alternateImage !== primaryImage;
  const isWomensBra = product.category === 'women-bras';

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

  const handleQuickAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdding || isUnavailable || getSizeAvailability(product, selectedSize).status === 'sold_out') return;
    addToCart(product, selectedColor, selectedSize, 1);
    setIsAdding(true);
  };

  const handleWishlistClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickView = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    openOverlay('quickview', product);
  };

  return (
    <article
      className={`group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E8E5E0] bg-white shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-[#637666]/40 hover:shadow-md ${className}`}
    >
      {/* Product Image */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F8F7F5]">
        <Link
          to={`/product/${product.slug}`}
          className="absolute inset-0 block"
          aria-label={`View ${product.name} details`}
        >
          <img
            src={primaryImage}
            alt={`${product.name} - ${product.imageLabel || 'front view'}`}
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 h-full w-full object-contain p-4 transition-transform duration-500 ${
              isWomensBra
                ? 'scale-[1.7] group-hover:scale-[1.75]'
                : 'group-hover:scale-105'
            }`}
          />

          {hasAlternateImage && (
            <img
              src={alternateImage}
              alt={`${product.name} alternate view`}
              loading="lazy"
              decoding="async"
              className={`pointer-events-none absolute inset-0 h-full w-full object-contain p-4 opacity-0 transition-all duration-500 ${
                isWomensBra ? 'scale-[1.7]' : ''
              }`}
            />
          )}
        </Link>

        {/* Product Badge */}
        {product.badge && (
          <div className="pointer-events-none absolute left-2.5 top-2.5 z-10 flex flex-col items-start gap-1">
            <span
              className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                product.badge.includes('Save') || product.badge.includes('Offer')
                  ? 'bg-[#A85A3C] text-elan-ivory'
                  : product.badge === 'New'
                  ? 'bg-elan-sage text-elan-ivory'
                  : 'bg-elan-ink text-elan-ivory'
              }`}
            >
              {product.badge}
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label={
            isFavorited
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={isFavorited}
          className={`absolute right-2.5 top-2.5 z-20 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/95 shadow-2xs transition-transform hover:scale-110 ${
            isFavorited ? 'text-elan-danger' : 'text-elan-ink'
          }`}
        >
          <Heart
            className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`}
          />
        </button>

        {/* Quick View Button */}
        <button
          type="button"
          onClick={handleQuickView}
          aria-label={`Quick view ${product.name}`}
          className="absolute bottom-2.5 right-2.5 z-20 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/95 text-elan-ink shadow-2xs transition-all hover:bg-elan-sage hover:text-elan-ivory"
        >
          <Eye className="h-4 w-4" />
        </button>
      </div>

      {/* Product Information */}
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        {/* Fabric Badge */}
        <span className="text-[10px] font-semibold uppercase tracking-wider text-elan-sage line-clamp-1 mb-1">
          {product.fabricBadge}
        </span>

        {/* Product Name */}
        <Link to={`/product/${product.slug}`}>
          <h3 className="line-clamp-2 min-h-[36px] font-display text-sm sm:text-base font-medium leading-snug text-elan-ink transition-colors hover:text-elan-sage">
            {product.name}
          </h3>
        </Link>

        {/* Price & Original Price */}
        <div className="mt-2 flex flex-wrap items-baseline gap-2">
          <span className="font-numeral text-base sm:text-lg font-bold text-elan-ink">
            {formatINR(product.price)}
          </span>

          {product.compareAt && product.compareAt > product.price && (
            <span className="text-xs text-elan-muted line-through">
              {formatINR(product.compareAt)}
            </span>
          )}
        </div>
        <ProductAvailabilityNote product={product} />

        {/* Colors Preview */}
        {product.colors && product.colors.length > 0 && (
          <div className="mt-2.5 border-t border-[#F0EDE8] pt-2">
            <ColorDots
              colors={product.colors}
              selectedColor={selectedColor}
              onSelect={setSelectedColor}
            />
          </div>
        )}

        {/* Available Sizes */}
        <div className="mt-2.5">
          <div className="flex flex-wrap gap-1">
            {product.sizes.map((size) => (
              (() => {
                const soldOut = getSizeAvailability(product, size).status === 'sold_out';
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    disabled={soldOut}
                    aria-pressed={selectedSize === size}
                    aria-label={soldOut ? `${size}, sold out` : `Select size ${size}`}
                    className={`flex h-6 min-w-6 items-center justify-center rounded border px-1.5 text-[10px] font-semibold transition-colors disabled:cursor-not-allowed sm:h-7 sm:min-w-7 sm:text-[11px] ${
                      soldOut
                        ? 'border-[#E8E5E0] bg-[#F0EDE8] text-elan-muted line-through'
                        : selectedSize === size
                          ? 'border-elan-ink bg-elan-ink text-elan-ivory'
                          : 'border-[#E8E5E0] bg-[#F8F7F5] text-neutral-600 hover:border-[#637666]'
                    }`}
                  >
                    {size}
                  </button>
                );
              })()
            ))}
          </div>
        </div>

        {/* Add to Bag Button */}
        <button
          type="button"
          onClick={handleQuickAdd}
          disabled={isAdding || isUnavailable || getSizeAvailability(product, selectedSize).status === 'sold_out'}
          aria-label={
            isUnavailable
              ? `${product.name} is sold out`
              : getSizeAvailability(product, selectedSize).status === 'sold_out'
                ? `Size ${selectedSize} is sold out`
                : undefined
          }
          className={`mt-3 flex min-h-[38px] w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all active:scale-[0.98] ${
            isUnavailable || getSizeAvailability(product, selectedSize).status === 'sold_out'
              ? 'cursor-not-allowed bg-[#E8E5E0] text-elan-muted'
              : isAdding
              ? 'bg-elan-sage text-elan-ivory'
              : 'bg-elan-ink text-elan-ivory hover:bg-elan-ink-hover'
          }`}
        >
          {isUnavailable || getSizeAvailability(product, selectedSize).status === 'sold_out' ? (
            'Sold Out'
          ) : isAdding ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Added!
            </>
          ) : (
            <>
              <ShoppingBag className="h-3.5 w-3.5" />
              Add to Bag • {selectedSize}
            </>
          )}
        </button>
      </div>
    </article>
  );
}
