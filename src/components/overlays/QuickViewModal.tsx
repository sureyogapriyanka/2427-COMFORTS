import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Heart, ShoppingBag, ShieldCheck, Check, Sparkles, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../data/catalog';
import { ColorDots } from '../product/ColorDots';
import { RatingStars } from '../product/RatingStars';
import { Button } from '../ui/Button';
import { DemoBadge } from '../brand/DemoBadge';

export function QuickViewModal() {
  const { overlay, closeOverlay, quickViewProduct, addToCart, isInWishlist, toggleWishlist } =
    useStore();

  if (overlay !== 'quickview' || !quickViewProduct) return null;

  const [selectedColor, setSelectedColor] = useState(
    quickViewProduct.colors[0]?.name || ''
  );
  const [selectedSize, setSelectedSize] = useState(
    quickViewProduct.sizes[0] || 'M'
  );
  const [activeImage, setActiveImage] = useState(quickViewProduct.image);
  const [added, setAdded] = useState(false);

  const isFavorited = isInWishlist(quickViewProduct.id);

  const handleAdd = () => {
    addToCart(quickViewProduct, selectedColor, selectedSize, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={closeOverlay} />

      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-[#FAF8F5] shadow-2xl border border-[#E8E1D7] animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={closeOverlay}
          className="absolute top-4 right-4 z-20 rounded-full bg-white/90 p-2 text-[#1F2022] hover:bg-white shadow-xs"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Images */}
          <div className="relative bg-[#F4EFEB] p-4 flex flex-col justify-between">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl">
              <img
                src={activeImage}
                alt={quickViewProduct.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {quickViewProduct.badge && (
                  <span className="rounded-full bg-[#1F2022] px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-xs">
                    {quickViewProduct.badge}
                  </span>
                )}
                {quickViewProduct.code && (
                  <span className="rounded-full bg-[#1F2022] px-2.5 py-0.5 text-[10px] font-numeral font-bold text-white shadow-xs">
                    {quickViewProduct.code}
                  </span>
                )}
                <DemoBadge variant="subtle" className="bg-white/90 px-2 py-0.5 rounded-full" />
              </div>
            </div>

            {/* Thumbnail selector */}
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setActiveImage(quickViewProduct.image)}
                className={`h-14 w-12 overflow-hidden rounded-lg border-2 ${
                  activeImage === quickViewProduct.image
                    ? 'border-[#637666]'
                    : 'border-transparent'
                }`}
              >
                <img
                  src={quickViewProduct.image}
                  alt="Thumb 1"
                  className="h-full w-full object-cover"
                />
              </button>
              <button
                type="button"
                onClick={() => setActiveImage(quickViewProduct.hoverImage)}
                className={`h-14 w-12 overflow-hidden rounded-lg border-2 ${
                  activeImage === quickViewProduct.hoverImage
                    ? 'border-[#637666]'
                    : 'border-transparent'
                }`}
              >
                <img
                  src={quickViewProduct.hoverImage}
                  alt="Thumb 2"
                  className="h-full w-full object-cover"
                />
              </button>
            </div>
          </div>

          {/* Right: Details & Options */}
          <div className="flex flex-col justify-between p-6 sm:p-8 bg-white overflow-y-auto max-h-[80vh]">
            <div>
              <div className="flex items-center justify-between text-xs text-[#637666] font-semibold tracking-wider uppercase mb-1">
                <span>{quickViewProduct.fabricBadge}</span>
                {quickViewProduct.rating && (
                  <RatingStars
                    rating={quickViewProduct.rating}
                    reviewCount={quickViewProduct.reviewCount}
                  />
                )}
              </div>

              <h3 className="font-display text-2xl font-medium text-[#1F2022]">
                {quickViewProduct.name}
              </h3>
              <p className="mt-1 text-xs text-[#5E6064]">
                {quickViewProduct.subtitle}
              </p>

              <Link
                to={`/product/${quickViewProduct.slug}`}
                onClick={closeOverlay}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#637666] hover:text-[#1F2022] mt-1 transition-colors"
              >
                <span>View Full Product Details Page</span>
                <ArrowRight className="h-3 w-3" />
              </Link>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-2 font-numeral">
                <span className="text-2xl font-bold text-[#1F2022]">
                  {formatINR(quickViewProduct.price)}
                </span>
                {quickViewProduct.compareAt && (
                  <span className="text-sm text-[#6B6F76] line-through">
                    {formatINR(quickViewProduct.compareAt)}
                  </span>
                )}
                {quickViewProduct.compareAt && (
                  <span className="rounded bg-[#637666]/10 px-2 py-0.5 text-xs font-semibold text-[#47584A]">
                    Save {Math.round(((quickViewProduct.compareAt - quickViewProduct.price) / quickViewProduct.compareAt) * 100)}%
                  </span>
                )}
              </div>

              {/* Color Selection */}
              <div className="mt-5 border-t border-[#E8E1D7] pt-4">
                <div className="flex justify-between text-xs font-medium text-[#1F2022] mb-2">
                  <span>Color:</span>
                  <span className="text-[#637666] font-semibold">{selectedColor}</span>
                </div>
                <ColorDots
                  colors={quickViewProduct.colors}
                  selectedColor={selectedColor}
                  onSelect={setSelectedColor}
                  size="md"
                />
              </div>

              {/* Size Selection */}
              <div className="mt-5 border-t border-[#E8E1D7] pt-4">
                <div className="flex justify-between text-xs font-medium text-[#1F2022] mb-2">
                  <span>Select Size:</span>
                  <span className="text-[#637666] font-semibold underline cursor-pointer">
                    Size Guide
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {quickViewProduct.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`h-9 rounded-lg border font-numeral text-xs font-semibold transition-all ${
                        selectedSize === size
                          ? 'border-[#1F2022] bg-[#1F2022] text-white shadow-xs'
                          : 'border-[#E8E1D7] bg-[#FAF8F5] text-[#1F2022] hover:border-[#637666]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description & Features */}
              <div className="mt-5 border-t border-[#E8E1D7] pt-4">
                <p className="text-xs text-[#5E6064] leading-relaxed">
                  {quickViewProduct.description}
                </p>
                <ul className="mt-3 space-y-1.5 text-xs text-[#1F2022]">
                  {quickViewProduct.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-[#637666] shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3 pt-4 border-t border-[#E8E1D7]">
              <button
                type="button"
                onClick={handleAdd}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1F2022] py-3 text-sm font-semibold text-[#FAF8F5] transition-all hover:bg-[#34373C] active:scale-[0.98] shadow-md"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>{added ? 'Added to Bag!' : `Add to Bag (${selectedSize})`}</span>
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(quickViewProduct.id)}
                className={`flex h-12 w-12 items-center justify-center rounded-xl border border-[#E8E1D7] transition-all hover:border-[#637666] ${
                  isFavorited ? 'text-[#A85A3C] bg-[#FAF8F5]' : 'text-[#1F2022]'
                }`}
                aria-label="Wishlist toggle"
              >
                <Heart className={`h-5 w-5 ${isFavorited ? 'fill-[#A85A3C]' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
