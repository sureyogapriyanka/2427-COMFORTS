
import {
  useEffect,
  useState,
} from 'react';

import { Link } from 'react-router-dom';

import {
  X,
  Heart,
  ShoppingBag,
  Check,
  ArrowRight,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../data/catalog';
import { ProductAvailabilityNote } from '../product/ProductAvailabilityNote';

export function QuickViewModal() {
  const {
    overlay,
    closeOverlay,
    quickViewProduct,
    addToCart,
    isInWishlist,
    toggleWishlist,
    openOverlay,
  } = useStore();

  const isOpen =
    overlay === 'quickview' &&
    quickViewProduct !== null;

  const [selectedColor, setSelectedColor] =
    useState('');

  const [selectedSize, setSelectedSize] =
    useState('');

  const [quantity, setQuantity] = useState(1);

  const [activeImageIndex, setActiveImageIndex] =
    useState(0);

  const [added, setAdded] = useState(false);

  const [showSizeInfo, setShowSizeInfo] =
    useState(false);

  useEffect(() => {
    if (!isOpen || !quickViewProduct) return;

    setSelectedColor(
      quickViewProduct.colors[0]?.name || ''
    );

    setSelectedSize(
      quickViewProduct.sizes[0] || ''
    );

    setQuantity(1);
    setActiveImageIndex(0);
    setAdded(false);
    setShowSizeInfo(false);
  }, [isOpen, quickViewProduct]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeOverlay();
      }
    };

    window.addEventListener(
      'keydown',
      handleEscape
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handleEscape
      );
    };
  }, [isOpen, closeOverlay]);

  if (!isOpen || !quickViewProduct) {
    return null;
  }

  const product = quickViewProduct;
  const isUnavailable = product.inventoryStatus === 'out_of_stock';

  const images = [
    product.image,
    product.hoverImage,
  ].filter(
    (image, index, all): image is string =>
      Boolean(image) &&
      all.indexOf(image) === index
  );

  const activeImage =
    images[activeImageIndex] || product.image;

  const isFavorited = isInWishlist(product.id);

  const hasDiscount =
    product.compareAt != null &&
    product.compareAt > product.price;

  const discountPercentage = hasDiscount
    ? Math.round(
      ((product.compareAt! - product.price) /
        product.compareAt!) *
      100
    )
    : 0;

  const nextImage = () => {
    setActiveImageIndex(
      (previous) => (previous + 1) % images.length
    );
  };

  const previousImage = () => {
    setActiveImageIndex(
      (previous) =>
        (previous - 1 + images.length) %
        images.length
    );
  };

  const handleAddToBag = () => {
    if (!selectedSize || !selectedColor || isUnavailable) return;

    addToCart(
      product,
      selectedColor,
      selectedSize,
      quantity
    );

    setAdded(true);
  };

  const handleViewBag = () => {
    openOverlay('cart');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-3 backdrop-blur-sm sm:p-6">
      {/* Backdrop */}
      <button
        type="button"
        onClick={closeOverlay}
        aria-label="Close quick view"
        className="absolute inset-0 h-full w-full cursor-default"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Quick view ${product.name}`}
        className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-y-auto rounded-2xl border border-[#E8E1D7] bg-white shadow-2xl md:overflow-hidden md:rounded-3xl"
      >
        {/* Close */}
        <button
          type="button"
          onClick={closeOverlay}
          aria-label="Close quick view"
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#1F2022] shadow-md transition-colors hover:bg-[#F4EFEB]"
        >
          <X size={19} />
        </button>

        <div className="grid min-h-0 md:grid-cols-2">
          {/* Product Images */}
          <div className="bg-[#F4EFEB] p-4 sm:p-6">
            <div className="relative mx-auto aspect-[4/5] max-h-[55vh] w-full overflow-hidden rounded-2xl bg-[#F9F6F1] md:max-h-[70vh]">
              <img
                src={activeImage}
                alt={product.name}
                className="h-full w-full object-contain"
              />

              {/* Badges */}
              <div className="absolute left-3 top-3 flex flex-col items-start gap-2">
                {product.badge && (
                  <span className="rounded-full bg-[#1F2022] px-3 py-1 text-[10px] font-semibold text-white">
                    {product.badge}
                  </span>
                )}

                {hasDiscount && (
                  <span className="rounded-full bg-[#637666] px-3 py-1 text-[10px] font-semibold text-white">
                    {discountPercentage}% OFF
                  </span>
                )}
              </div>

              {/* Gallery Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={previousImage}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#1F2022] shadow-sm hover:bg-white"
                  >
                    <ChevronLeft size={19} />
                  </button>

                  <button
                    type="button"
                    onClick={nextImage}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#1F2022] shadow-sm hover:bg-white"
                  >
                    <ChevronRight size={19} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="mt-4 flex justify-center gap-3">
                {images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() =>
                      setActiveImageIndex(index)
                    }
                    aria-label={`View image ${index + 1}`}
                    className={`h-16 w-14 overflow-hidden rounded-lg border-2 bg-white p-1 ${activeImageIndex === index
                      ? 'border-[#637666]'
                      : 'border-transparent'
                      }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="h-full w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="min-h-0 overflow-y-auto p-5 sm:p-7 md:max-h-[85vh]">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#637666]">
              {product.categoryLabel}
            </p>

            <h2 className="mt-2 pr-8 font-display text-2xl font-medium leading-tight text-[#1F2022] sm:text-3xl">
              {product.name}
            </h2>

            <p className="mt-2 text-sm text-[#77736E]">
              {product.subtitle}
            </p>

            <Link
              to={`/product/${product.slug}`}
              onClick={closeOverlay}
              className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[#637666] hover:text-[#1F2022]"
            >
              View Full Product Details
              <ArrowRight size={15} />
            </Link>

            {/* Price */}
            <div className="mt-6 flex flex-wrap items-center gap-3 border-b border-[#E8E1D7] pb-5">
              <span className="font-numeral text-2xl font-bold text-[#1F2022]">
                {formatINR(product.price)}
              </span>

              {hasDiscount && (
                <>
                  <span className="text-sm text-[#99938B] line-through">
                    {formatINR(product.compareAt!)}
                  </span>

                  <span className="rounded-lg bg-[#F2F4EF] px-2 py-1 text-xs font-semibold text-[#637666]">
                    Save {discountPercentage}%
                  </span>
                </>
              )}
            </div>
            <ProductAvailabilityNote product={product} />

            {/* Color Selection */}
            <div className="mt-5">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="text-xs font-semibold text-[#1F2022]">
                  Select Color
                </h3>

                <span className="text-xs font-medium text-[#637666]">
                  {selectedColor || 'Choose color'}
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => {
                  const isSelected =
                    selectedColor === color.name;

                  return (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => {
                        setSelectedColor(color.name);
                        setAdded(false);
                      }}
                      title={color.name}
                      aria-label={`Select ${color.name}`}
                      aria-pressed={isSelected}
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 p-1 transition-all ${isSelected
                        ? 'border-[#1F2022]'
                        : 'border-[#E8E1D7] hover:border-[#637666]'
                        }`}
                    >
                      <span
                        className="flex h-full w-full items-center justify-center rounded-full border border-black/10"
                        style={{
                          backgroundColor: color.hex,
                        }}
                      >
                        {isSelected && (
                          <Check
                            size={15}
                            className="text-[#1F2022] drop-shadow-[0_1px_2px_white]"
                          />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mt-6 border-t border-[#E8E1D7] pt-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xs font-semibold text-[#1F2022]">
                  Select Size
                </h3>

                <button
                  type="button"
                  onClick={() =>
                    setShowSizeInfo((value) => !value)
                  }
                  className="text-xs font-semibold text-[#637666] underline"
                >
                  Size Information
                </button>
              </div>

              {showSizeInfo && (
                <p className="mb-4 rounded-xl bg-[#F2F4EF] p-3 text-xs leading-5 text-[#47584A]">
                  Sizes vary by product. Please
                  confirm measurements with the
                  store before ordering. An official
                  size chart has not been provided.
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      setSelectedSize(size);
                      setAdded(false);
                    }}
                    aria-pressed={
                      selectedSize === size
                    }
                    className={`min-w-12 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-colors ${selectedSize === size
                      ? 'border-[#1F2022] bg-[#1F2022] text-white'
                      : 'border-[#E8E1D7] bg-[#FAF8F5] text-[#1F2022] hover:border-[#637666]'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-6 border-t border-[#E8E1D7] pt-5">
              <h3 className="mb-3 text-xs font-semibold text-[#1F2022]">
                Quantity
              </h3>

              <div className="inline-flex items-center overflow-hidden rounded-xl border border-[#E8E1D7]">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => {
                    setQuantity((value) =>
                      Math.max(1, value - 1)
                    );
                    setAdded(false);
                  }}
                  aria-label="Decrease quantity"
                  className="p-3 disabled:opacity-40"
                >
                  <Minus size={16} />
                </button>

                <span className="w-10 text-center text-sm font-bold">
                  {quantity}
                </span>

                <button
                  type="button"
                  disabled={quantity >= 99}
                  onClick={() => {
                    setQuantity((value) =>
                      Math.min(99, value + 1)
                    );
                    setAdded(false);
                  }}
                  aria-label="Increase quantity"
                  className="p-3 disabled:opacity-40"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Product Features */}
            {product.features?.length > 0 && (
              <div className="mt-6 border-t border-[#E8E1D7] pt-5">
                <h3 className="mb-3 text-xs font-semibold text-[#1F2022]">
                  Product Highlights
                </h3>

                <ul className="space-y-2">
                  {product.features.slice(0, 4).map(
                    (feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-xs leading-5 text-[#77736E]"
                      >
                        <Check
                          size={15}
                          className="mt-0.5 shrink-0 text-[#637666]"
                        />
                        {feature}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="mt-7 border-t border-[#E8E1D7] pt-5">
              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={!selectedSize || !selectedColor || isUnavailable}
                  onClick={handleAddToBag}
                  className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#1F2022] px-4 text-sm font-semibold text-white hover:bg-[#34373C] disabled:opacity-40"
                >
                  {isUnavailable ? (
                    'Currently Unavailable'
                  ) : added ? (
                    <>
                      <Check size={18} />
                      Added to Bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} />
                      Add to Bag
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    toggleWishlist(product.id)
                  }
                  aria-label={
                    isFavorited
                      ? 'Remove from wishlist'
                      : 'Add to wishlist'
                  }
                  aria-pressed={isFavorited}
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-colors ${isFavorited
                    ? 'border-[#A85A3C] bg-[#FAF8F5] text-[#A85A3C]'
                    : 'border-[#E8E1D7] text-[#1F2022] hover:border-[#637666]'
                    }`}
                >
                  <Heart
                    size={20}
                    className={
                      isFavorited
                        ? 'fill-current'
                        : ''
                    }
                  />
                </button>
              </div>

              {added && (
                <button
                  type="button"
                  onClick={handleViewBag}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#637666] px-4 py-3 text-sm font-semibold text-[#637666] hover:bg-[#F2F4EF]"
                >
                  View Shopping Bag
                  <ArrowRight size={16} />
                </button>
              )}

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#77736E]">
                <ShieldCheck
                  size={15}
                  className="text-[#637666]"
                />
                Review details before checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
