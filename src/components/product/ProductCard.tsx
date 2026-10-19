
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Product, formatINR } from '../../data/catalog';
import { useStore } from '../../context/StoreContext';
import { ColorDots } from './ColorDots';
import { RatingStars } from './RatingStars';
import { DemoBadge } from '../brand/DemoBadge';

interface ProductCardProps {
  product: Product;
  className?: string;
}

// Resolve image URLs for local development and GitHub Pages
const getImageUrl = (path: string): string => {
  if (!path) return '';

  // Keep external and embedded image URLs unchanged
  if (
    /^(https?:)?\/\//i.test(path) ||
    /^(data:|blob:)/i.test(path)
  ) {
    return path;
  }

  const base = import.meta.env.BASE_URL;
  const cleanPath = path.replace(/^\/+/, '');

  // Prevent adding the deployment base path twice
  if (path.startsWith(base)) {
    return path;
  }

  return `${base}${cleanPath}`;
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

  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAdding(true);
    addToCart(product, selectedColor, selectedSize, 1);

    setTimeout(() => setIsAdding(false), 600);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    toggleWishlist(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    openOverlay('quickview', product);
  };

  return (
    <div
      className={`group relative flex flex-col rounded-2xl bg-white p-3 border border-[#E8E1D7]/70 shadow-xs transition-all duration-300 hover:shadow-lg hover:border-[#637666]/30 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Visual Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#F4EFEB]">

        {/* Clickable Image linking to Product Details Page */}
        <Link
          to={`/product/${product.slug}`}
          className="absolute inset-0 z-0 block cursor-pointer"
          aria-label={`View ${product.name} details`}
        >
          {/* Primary Product Image */}
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-700 ease-out ${isHovered
                ? 'scale-105 opacity-0'
                : 'scale-100 opacity-100'
              }`}
            loading="lazy"
          />

          {/* Hover Product Image */}
          <img
            src={getImageUrl(product.hoverImage)}
            alt={`${product.name} - alternate view`}
            className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-700 ease-out ${isHovered
                ? 'scale-105 opacity-100'
                : 'scale-100 opacity-0'
              }`}
            loading="lazy"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col items-start gap-1.5 z-10 pointer-events-none">
          {product.badge && (
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase shadow-xs ${product.badge.includes('Save')
                  ? 'bg-[#A85A3C] text-white'
                  : product.badge === 'New'
                    ? 'bg-[#637666] text-white'
                    : 'bg-[#1F2022] text-[#FAF8F5]'
                }`}
            >
              {product.badge}
            </span>
          )}

          {product.code && (
            <span className="rounded-full bg-[#1F2022]/90 backdrop-blur-xs px-2 py-0.5 text-[10px] font-numeral font-bold text-white shadow-xs">
              {product.code}
            </span>
          )}

          <DemoBadge
            variant="subtle"
            className="bg-white/85 backdrop-blur-xs px-2 py-0.5 rounded-full"
          />
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label={
            isFavorited
              ? 'Remove from wishlist'
              : 'Save to wishlist'
          }
          className={`absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-xs transition-all duration-200 hover:scale-110 shadow-xs ${isFavorited
              ? 'text-[#A85A3C]'
              : 'text-[#1F2022]/70 hover:text-[#1F2022]'
            }`}
        >
          <Heart
            className={`h-4 w-4 transition-transform ${isFavorited
                ? 'fill-[#A85A3C] scale-110'
                : ''
              }`}
          />
        </button>

        {/* Quick View Button */}
        <button
          type="button"
          onClick={handleQuickView}
          aria-label="Quick look at product details"
          className="absolute bottom-14 left-1/2 -translate-x-1/2 z-10 hidden sm:flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-[#1F2022] shadow-md opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-1 hover:bg-[#FAF8F5]"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>Quick Look</span>
        </button>

        {/* Quick Add Overlay Drawer */}
        <div className="absolute inset-x-2 bottom-2 z-10 transition-all duration-300 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
          <div className="rounded-xl bg-[#FAF8F5]/95 backdrop-blur-md p-2 shadow-lg border border-[#E8E1D7]">

            {/* Size Selector */}
            <div className="flex items-center justify-between mb-1.5 px-1">
              <span className="text-[10px] uppercase font-semibold text-[#6B6F76] tracking-wider">
                Size:
              </span>

              <div className="flex gap-1">
                {product.sizes.slice(0, 4).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedSize(size);
                    }}
                    className={`h-5 min-w-5 px-1 text-[10px] rounded font-numeral font-medium transition-colors ${selectedSize === size
                        ? 'bg-[#1F2022] text-white'
                        : 'bg-white text-[#1F2022] hover:bg-[#E8E1D7]'
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
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#1F2022] py-2 text-xs font-medium text-[#FAF8F5] transition-all hover:bg-[#34373C] active:scale-[0.98]"
            >
              <ShoppingBag className="h-3.5 w-3.5" />

              <span>
                {isAdding
                  ? 'Added to Bag!'
                  : `Add to Bag • ${selectedSize}`}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="mt-3 flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-[#6B6F76] mb-1">
            <span className="font-medium text-[#637666] text-[11px] uppercase tracking-wider">
              {product.fabricBadge}
            </span>

            {product.rating ? (
              <RatingStars
                rating={product.rating}
                reviewCount={product.reviewCount}
              />
            ) : product.code ? (
              <span className="font-numeral text-[10px] font-semibold text-[#8C9097] uppercase tracking-wider">
                Ref: {product.code}
              </span>
            ) : null}
          </div>

          {/* Product Name */}
          <Link
            to={`/product/${product.slug}`}
            className="block group-hover:text-[#637666]"
          >
            <h3 className="font-display text-lg font-medium text-[#1F2022] line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Product Subtitle */}
          <p className="text-xs text-[#5E6064] line-clamp-1 mt-0.5">
            {product.subtitle}
          </p>
        </div>

        {/* Bottom Color Swatches & Price */}
        <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#E8E1D7]/50">
          <ColorDots
            colors={product.colors}
            selectedColor={selectedColor}
            onSelect={setSelectedColor}
          />

          <div className="flex items-baseline gap-1 font-numeral">
            <span className="font-bold text-base text-[#1F2022]">
              {formatINR(product.price)}
            </span>

            {product.isDemoPrice && (
              <span className="text-[10px] text-[#8C9097] font-normal font-sans">
                (Demo)
              </span>
            )}

            {product.compareAt && (
              <span className="text-xs text-[#6B6F76] line-through ml-1">
                {formatINR(product.compareAt)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
