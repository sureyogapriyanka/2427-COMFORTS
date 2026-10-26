
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Plus,
  Minus,
  PackageCheck,
  Ruler,
  ArrowRight,
  ZoomIn,
  X,
  AlertCircle,
} from 'lucide-react';

import { Container } from '../components/ui/Container';
import { formatINR } from '../data/catalog';
import { useStore } from '../context/StoreContext';
import { ColorDots } from '../components/product/ColorDots';
import { RatingStars } from '../components/product/RatingStars';
import { ProductCard } from '../components/product/ProductCard';
import { DemoBadge } from '../components/brand/DemoBadge';
import { Button } from '../components/ui/Button';
import { useCatalog } from '../context/CatalogContext';
import { ProductAvailabilityNote } from '../components/product/ProductAvailabilityNote';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { products, isLoading: catalogLoading } = useCatalog();

  const {
    addToCart,
    isInWishlist,
    toggleWishlist,
  } = useStore();

  const product = products.find(
    (item) => item.slug === slug
  );

  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const [showDelivery, setShowDelivery] = useState(false);

  useEffect(() => {
    if (!product) return;

    setSelectedColor(product.colors[0]?.name || '');
    setSelectedSize('');
    setActiveImage(product.image);
    setQuantity(1);
    setAdded(false);
    setSizeError(false);
    setShowZoom(false);
    setShowSizeGuide(false);
    setShowDetails(true);
    setShowDelivery(false);
  }, [product?.id]);

  useEffect(() => {
    if (!added) return;

    const timer = window.setTimeout(() => {
      setAdded(false);
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [added]);

  useEffect(() => {
    if (!showZoom && !showSizeGuide) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowZoom(false);
        setShowSizeGuide(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [showZoom, showSizeGuide]);

  if (!product) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-[#FAF8F5] py-20">
        <Container className="text-center">
          <h1 className="font-display text-3xl text-[#1F2022]">
            {catalogLoading ? 'Loading Product' : 'Product Not Found'}
          </h1>

          <p role={catalogLoading ? 'status' : undefined} className="mt-3 text-sm text-[#77736E]">
            {catalogLoading ? 'Checking the catalog…' : 'This product is not available in the current catalog.'}
          </p>

          {!catalogLoading && (
            <Button href="/" variant="primary" className="mt-6">
              Continue Shopping
            </Button>
          )}
        </Container>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);

  const images = [
    {
      src: product.image,
      label: product.imageLabel || 'Front View',
    },
    ...(
      product.hoverImage &&
        product.hoverImage !== product.image
        ? [{
          src: product.hoverImage,
          label: 'Additional View',
        }]
        : []
    ),
  ];

  const currentImage = activeImage || product.image;

  const related = products.filter(
    (item) =>
      item.category === product.category &&
      item.id !== product.id
  ).slice(0, 4);

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

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setSizeError(false);
    setAdded(false);
  };

  const handleAddToCart = () => {
    if (product.inventoryStatus === 'out_of_stock') return;
    if (product.sizes.length > 0 && !selectedSize) {
      setSizeError(true);

      document
        .getElementById('product-size-selector')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });

      return;
    }

    addToCart(
      product,
      selectedColor || product.colors[0]?.name || '',
      selectedSize,
      quantity
    );

    setAdded(true);
    setSizeError(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-20">
      <Container>
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 py-5 text-xs text-[#77736E] sm:py-6"
        >
          <Link
            to="/"
            className="hover:text-[#1F2022]"
          >
            Home
          </Link>

          <ChevronRight size={13} />

          <Link
            to={`/category/${product.category}`}
            className="hover:text-[#1F2022]"
          >
            {product.categoryLabel}
          </Link>

          <ChevronRight size={13} />

          <span className="line-clamp-1 font-medium text-[#1F2022]">
            {product.name}
          </span>
        </nav>

        {/* Product Main Layout */}
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          {/* Gallery */}
          <div className="lg:col-span-7">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:gap-4">
              {/* Thumbnails */}
              <div className="flex gap-3 sm:flex-col">
                {images.map((image) => (
                  <button
                    key={image.src}
                    type="button"
                    onClick={() =>
                      setActiveImage(image.src)
                    }
                    aria-label={`Show ${image.label}`}
                    aria-pressed={
                      currentImage === image.src
                    }
                    className={`h-20 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-white p-1 transition-all sm:h-24 sm:w-20 ${currentImage === image.src
                        ? 'border-[#637666]'
                        : 'border-[#E8E1D7] hover:border-[#637666]'
                      }`}
                  >
                    <img
                      src={image.src}
                      alt={image.label}
                      className="h-full w-full object-contain"
                    />
                  </button>
                ))}
              </div>

              {/* Main Product Image */}
              <div className="relative min-w-0 flex-1 overflow-hidden rounded-2xl border border-[#EEE7DE] bg-white sm:rounded-3xl">
                <div className="relative flex aspect-[4/5] items-center justify-center p-4 sm:p-8">
                  <img
                    src={currentImage}
                    alt={product.name}
                    className="h-full w-full object-contain"
                  />

                  <div className="absolute left-4 top-4 flex flex-col items-start gap-2">
                    {product.badge && (
                      <span className="rounded-full bg-[#1F2022] px-3 py-1.5 text-[10px] font-bold text-white">
                        {product.badge}
                      </span>
                    )}

                    {hasDiscount && (
                      <span className="rounded-full bg-[#A85A3C] px-3 py-1.5 text-[10px] font-bold text-white">
                        {discountPercentage}% OFF
                      </span>
                    )}

                    <DemoBadge
                      variant="pill"
                      className="bg-white/95 shadow-sm"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowZoom(true)}
                    aria-label="Enlarge product image"
                    className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border border-[#EEE7DE] bg-white text-[#1F2022] shadow-sm transition-colors hover:bg-[#F4F2EF]"
                  >
                    <ZoomIn size={19} />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#77736E]">
              <PackageCheck size={15} />
              Select a thumbnail to explore more views
            </div>
          </div>

          {/* Product Information */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-[#EEE7DE] bg-white p-5 sm:rounded-3xl sm:p-7 xl:p-8">
              {/* Category & Rating */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#637666]">
                  {product.fabricBadge ||
                    product.categoryLabel}
                </span>

                {product.rating && !product.isDemoContent ? (
                  <RatingStars
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                  />
                ) : null}
              </div>

              {/* Product Name */}
              <h1 className="font-display text-2xl font-medium leading-tight text-[#1F2022] sm:text-3xl xl:text-4xl">
                {product.name}
              </h1>

              <p className="mt-3 text-sm leading-6 text-[#77736E]">
                {product.subtitle}
              </p>

              {product.code && (
                <p className="mt-3 text-xs text-[#99938B]">
                  Product Code: {product.code}
                </p>
              )}

              {/* Price */}
              <div className="mt-6 border-b border-[#EEE7DE] pb-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-numeral text-3xl font-bold text-[#1F2022]">
                    {formatINR(product.price)}
                  </span>

                  {hasDiscount && (
                    <>
                      <span className="text-base text-[#99938B] line-through">
                        {formatINR(product.compareAt!)}
                      </span>

                      <span className="rounded-full bg-[#EDF3ED] px-2.5 py-1 text-xs font-bold text-[#637666]">
                        Save {discountPercentage}%
                      </span>
                    </>
                  )}
                </div>

                <p className="mt-2 text-xs text-[#99938B]">
                  {product.isDemoPrice
                    ? 'Sample price for demonstration. Final price and applicable taxes require approval.'
                    : 'Applicable tax treatment has not been confirmed.'}
                </p>
                <ProductAvailabilityNote product={product} />
              </div>

              {/* Color Selection */}
              {product.colors.length > 0 && (
                <div className="mt-6">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h2 className="text-sm font-semibold text-[#1F2022]">
                      Choose Color
                    </h2>

                    <span className="text-xs font-medium text-[#637666]">
                      {selectedColor ||
                        product.colors[0]?.name}
                    </span>
                  </div>

                  <ColorDots
                    colors={product.colors}
                    selectedColor={
                      selectedColor ||
                      product.colors[0]?.name ||
                      ''
                    }
                    onSelect={(color) => {
                      setSelectedColor(color);
                      setAdded(false);
                    }}
                    size="md"
                  />
                </div>
              )}

              {/* Size Selection */}
              {product.sizes.length > 0 && (
                <div
                  id="product-size-selector"
                  className="mt-7 scroll-mt-28"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h2 className="text-sm font-semibold text-[#1F2022]">
                      Select Size
                      <span className="ml-1 text-[#A85A3C]">
                        *
                      </span>
                    </h2>

                    <button
                      type="button"
                      onClick={() =>
                        setShowSizeGuide(true)
                      }
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#637666] underline underline-offset-4"
                    >
                      <Ruler size={14} />
                      Size Guide
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() =>
                          handleSizeSelect(size)
                        }
                        aria-pressed={
                          selectedSize === size
                        }
                        className={`min-h-12 rounded-xl border px-2 text-xs font-bold transition-all ${selectedSize === size
                            ? 'border-[#1F2022] bg-[#1F2022] text-white'
                            : 'border-[#E8E1D7] bg-[#FAF8F5] text-[#1F2022] hover:border-[#637666]'
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  {sizeError && (
                    <p
                      role="alert"
                      className="mt-3 flex items-center gap-2 text-xs font-medium text-[#A85A3C]"
                    >
                      <AlertCircle size={15} />
                      Please select your size before adding to bag.
                    </p>
                  )}
                </div>
              )}

              {/* Quantity */}
              <div className="mt-7">
                <h2 className="mb-3 text-sm font-semibold text-[#1F2022]">
                  Quantity
                </h2>

                <div className="inline-flex items-center rounded-xl border border-[#E8E1D7] bg-[#FAF8F5] p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setQuantity((value) =>
                        Math.max(1, value - 1)
                      );
                      setAdded(false);
                    }}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-white disabled:opacity-40"
                  >
                    <Minus size={16} />
                  </button>

                  <span className="w-12 text-center text-sm font-bold text-[#1F2022]">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setQuantity((value) =>
                        Math.min(99, value + 1)
                      );
                      setAdded(false);
                    }}
                    disabled={quantity >= 99}
                    aria-label="Increase quantity"
                    className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-white disabled:opacity-40"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Add to Bag / Wishlist */}
              <div className="mt-7 flex gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.inventoryStatus === 'out_of_stock'}
                  aria-label={product.inventoryStatus === 'out_of_stock' ? 'Product currently unavailable' : undefined}
                  className={`flex min-h-14 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-white transition-all active:scale-[0.99] ${added
                      ? 'bg-[#637666]'
                      : 'bg-[#1F2022] hover:bg-[#34373C]'
                    }`}
                >
                  {product.inventoryStatus === 'out_of_stock' ? (
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
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border transition-colors ${isFavorited
                      ? 'border-[#A85A3C] bg-[#FFF5F0] text-[#A85A3C]'
                      : 'border-[#E8E1D7] text-[#1F2022] hover:border-[#637666]'
                    }`}
                >
                  <Heart
                    size={20}
                    fill={
                      isFavorited
                        ? 'currentColor'
                        : 'none'
                    }
                  />
                </button>
              </div>

              {added && (
                <p
                  role="status"
                  className="mt-3 flex items-center gap-2 text-xs font-medium text-[#637666]"
                >
                  <Check size={15} />
                  {quantity}{' '}
                  {quantity === 1 ? 'item' : 'items'} added
                  to your shopping bag.
                </p>
              )}

              {/* Product Details Accordion */}
              <div className="mt-8 border-t border-[#EEE7DE]">
                <button
                  type="button"
                  onClick={() =>
                    setShowDetails((value) => !value)
                  }
                  aria-expanded={showDetails}
                  className="flex w-full items-center justify-between py-5 text-left text-sm font-semibold text-[#1F2022]"
                >
                  Product Highlights

                  {showDetails ? (
                    <Minus size={17} />
                  ) : (
                    <Plus size={17} />
                  )}
                </button>

                {showDetails && (
                  <div className="pb-5">
                    {product.features.length > 0 ? (
                      <ul className="space-y-3">
                        {product.features.map(
                          (feature, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-3 text-sm leading-6 text-[#696C68]"
                            >
                              <Check
                                size={16}
                                className="mt-1 shrink-0 text-[#637666]"
                              />

                              <span>{feature}</span>
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p className="text-sm text-[#77736E]">
                        Designed for everyday comfort.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Delivery Accordion */}
              <div className="border-t border-[#EEE7DE]">
                <button
                  type="button"
                  onClick={() =>
                    setShowDelivery((value) => !value)
                  }
                  aria-expanded={showDelivery}
                  className="flex w-full items-center justify-between py-5 text-left text-sm font-semibold text-[#1F2022]"
                >
                  Delivery & Returns

                  {showDelivery ? (
                    <Minus size={17} />
                  ) : (
                    <Plus size={17} />
                  )}
                </button>

                {showDelivery && (
                  <div className="space-y-3 pb-5 text-sm leading-6 text-[#77736E]">
                    <p>
                      Delivery options and charges have not
                      been confirmed. This website does not
                      process real orders.
                    </p>

                    <p>
                      Return terms must be confirmed by the
                      store before launch.
                    </p>
                  </div>
                )}
              </div>

              {/* Trust Information */}
              <div className="grid grid-cols-3 gap-2 border-t border-[#EEE7DE] pt-6">
                <div className="text-center">
                  <ShieldCheck
                    size={20}
                    className="mx-auto mb-2 text-[#637666]"
                  />

                  <p className="text-[11px] leading-4 text-[#77736E]">
                    Quality Focused
                  </p>
                </div>

                <div className="text-center">
                  <Truck
                    size={20}
                    className="mx-auto mb-2 text-[#637666]"
                  />

                  <p className="text-[11px] leading-4 text-[#77736E]">
                    Shipping not confirmed
                  </p>
                </div>

                <div className="text-center">
                  <RotateCcw
                    size={20}
                    className="mx-auto mb-2 text-[#637666]"
                  />

                  <p className="text-[11px] leading-4 text-[#77736E]">
                    Return terms not confirmed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-14 sm:mt-16">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#637666]">
                  You May Also Like
                </p>

                <h2 className="mt-1 font-display text-2xl font-medium text-[#202020] sm:text-3xl">
                  More in {product.categoryLabel}
                </h2>
              </div>

              <Link
                to={`/category/${product.category}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#202020] hover:text-[#637666] sm:text-sm"
              >
                View All
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                />
              ))}
            </div>
          </section>
        )}
      </Container>

      {/* Image Zoom Modal */}
      {showZoom && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged product image"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setShowZoom(false)}
        >
          <button
            type="button"
            onClick={() => setShowZoom(false)}
            aria-label="Close image"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#1F2022]"
          >
            <X size={22} />
          </button>

          <img
            src={currentImage}
            alt={product.name}
            onClick={(event) =>
              event.stopPropagation()
            }
            className="max-h-[85vh] max-w-full rounded-xl bg-white object-contain p-3"
          />
        </div>
      )}

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="size-guide-title"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
          onClick={() => setShowSizeGuide(false)}
        >
          <div
            onClick={(event) =>
              event.stopPropagation()
            }
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2
                id="size-guide-title"
                className="font-display text-2xl text-[#1F2022]"
              >
                Size Guide
              </h2>

              <button
                type="button"
                onClick={() =>
                  setShowSizeGuide(false)
                }
                aria-label="Close size guide"
                className="rounded-full p-2 hover:bg-[#F4F2EF]"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mb-4 text-sm leading-6 text-[#77736E]">
              Available sizes for this product are
              listed below. Choose your usual size.
              For exact body measurements, contact
              the store before ordering.
            </p>

            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    handleSizeSelect(size);
                    setShowSizeGuide(false);
                  }}
                  className={`min-w-14 rounded-lg border px-4 py-3 text-sm font-semibold ${selectedSize === size
                      ? 'border-[#1F2022] bg-[#1F2022] text-white'
                      : 'border-[#E8E1D7] bg-[#FAF8F5] text-[#1F2022]'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>

            <p className="mt-5 text-xs text-[#99938B]">
              Size measurements vary by product style.
              This panel does not represent an official
              measurement chart.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
