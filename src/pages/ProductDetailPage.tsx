
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
import { Button } from '../components/ui/Button';
import { useCatalog } from '../context/CatalogContext';
import { ProductAvailabilityNote } from '../components/product/ProductAvailabilityNote';
import { getSizeAvailability } from '../data/sizeInventory';
import { ProductImage } from '../components/product/ProductImage';
import { productImageNotice } from '../lib/productImages';

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
      <div className="flex min-h-[65vh] items-center justify-center bg-elan-ivory py-20">
        <Container className="text-center">
          <h1 className="font-display text-3xl text-elan-ink">
            {catalogLoading ? 'Loading Product' : 'Product Not Found'}
          </h1>

          <p role={catalogLoading ? 'status' : undefined} className="mt-3 text-sm text-elan-muted">
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
  const isWomensBra = product.category === 'women-bras';
  const imageNotice = productImageNotice(product);

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
    if (getSizeAvailability(product, size).status === 'sold_out') return;
    setSelectedSize(size);
    setSizeError(false);
    setAdded(false);
  };

  const handleAddToCart = () => {
    if (product.inventoryStatus === 'out_of_stock') return;
    if (selectedSize && getSizeAvailability(product, selectedSize).status === 'sold_out') return;
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
    <div className="min-h-screen bg-elan-ivory pb-20">
      <Container>
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 py-5 text-xs text-elan-muted sm:py-6"
        >
          <Link
            to="/"
            className="hover:text-elan-ink"
          >
            Home
          </Link>

          <ChevronRight size={13} />

          <Link
            to={`/category/${product.category}`}
            className="hover:text-elan-ink"
          >
            {product.categoryLabel}
          </Link>

          <ChevronRight size={13} />

          <span className="line-clamp-1 font-medium text-elan-ink">
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
                    <ProductImage
                      src={image.src}
                      alt={image.label}
                      className={`h-full w-full object-contain ${
                        isWomensBra ? 'scale-[1.7]' : ''
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Main Product Image */}
              <div className="relative min-w-0 flex-1 overflow-hidden rounded-2xl border border-[#EEE7DE] bg-white sm:rounded-3xl">
                <div className="relative flex aspect-[4/5] items-center justify-center p-4 sm:p-8">
                  <ProductImage
                    src={currentImage}
                    alt={product.name}
                    className={`h-full w-full object-contain ${
                      isWomensBra ? 'scale-[1.7]' : ''
                    }`}
                  />

                  <div className="absolute left-4 top-4 flex flex-col items-start gap-2">
                    {product.badge && (
                      <span className="rounded-full bg-elan-ink px-3 py-1.5 text-[10px] font-bold text-elan-ivory">
                        {product.badge}
                      </span>
                    )}

                    {hasDiscount && (
                      <span className="rounded-full bg-[#A85A3C] px-3 py-1.5 text-[10px] font-bold text-elan-ivory">
                        {discountPercentage}% OFF
                      </span>
                    )}

                  </div>

                  <button
                    type="button"
                    onClick={() => setShowZoom(true)}
                    aria-label="Enlarge product image"
                    className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border border-[#EEE7DE] bg-white text-elan-ink shadow-sm transition-colors hover:bg-[#F4F2EF]"
                  >
                    <ZoomIn size={19} />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-elan-muted">
              <PackageCheck size={15} />
              Select a thumbnail to explore more views
            </div>
            {imageNotice && (
              <p role="note" className="mx-auto mt-3 max-w-xl text-center text-xs leading-5 text-elan-muted">
                {imageNotice}
              </p>
            )}
          </div>

          {/* Product Information */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-[#EEE7DE] bg-white p-5 sm:rounded-3xl sm:p-7 xl:p-8">
              {/* Category & Rating */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-elan-sage">
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
              <h1 className="font-display text-2xl font-medium leading-tight text-elan-ink sm:text-3xl xl:text-4xl">
                {product.name}
              </h1>

              <p className="mt-3 text-sm leading-6 text-elan-muted">
                {product.subtitle}
              </p>

              {product.code && (
                <p className="mt-3 text-xs text-elan-muted">
                  Product Code: {product.code}
                </p>
              )}

              {/* Price */}
              <div className="mt-6 border-b border-[#EEE7DE] pb-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-numeral text-3xl font-bold text-elan-ink">
                    {formatINR(product.price)}
                  </span>

                  {hasDiscount && (
                    <>
                      <span className="text-base text-elan-muted line-through">
                        {formatINR(product.compareAt!)}
                      </span>

                      <span className="rounded-full bg-[#EDF3ED] px-2.5 py-1 text-xs font-bold text-elan-sage">
                        Save {discountPercentage}%
                      </span>
                    </>
                  )}
                </div>

                <p className="mt-2 text-xs text-elan-muted">
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
                    <h2 className="text-sm font-semibold text-elan-ink">
                      Choose Color
                    </h2>

                    <span className="text-xs font-medium text-elan-sage">
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
                    <h2 className="text-sm font-semibold text-elan-ink">
                      Select Size
                      <span className="ml-1 text-elan-danger">
                        *
                      </span>
                    </h2>

                    <button
                      type="button"
                      onClick={() =>
                        setShowSizeGuide(true)
                      }
                      className="inline-flex items-center gap-1 text-xs font-semibold text-elan-sage underline underline-offset-4"
                    >
                      <Ruler size={14} />
                      Size Guide
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                    {product.sizes.map((size) => (
                      (() => {
                        const availability = getSizeAvailability(product, size);
                        const soldOut = availability.status === 'sold_out';
                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => handleSizeSelect(size)}
                            disabled={soldOut}
                            aria-pressed={selectedSize === size}
                            aria-label={
                              soldOut ? `${size}, sold out` : `Select size ${size}`
                            }
                            className={`flex min-h-12 flex-col items-center justify-center rounded-xl border px-2 text-xs font-bold transition-all disabled:cursor-not-allowed ${
                              soldOut
                                ? 'border-[#E8E1D7] bg-[#F0EDE8] text-elan-muted'
                                : selectedSize === size
                                  ? 'border-elan-ink bg-elan-ink text-elan-ivory'
                                  : 'border-[#E8E1D7] bg-elan-ivory text-elan-ink hover:border-[#637666]'
                            }`}
                          >
                            <span className={soldOut ? 'line-through' : ''}>{size}</span>
                            {soldOut && <span className="text-[9px] font-medium">Sold Out</span>}
                          </button>
                        );
                      })()
                    ))}
                  </div>

                  {selectedSize && (() => {
                    const availability = getSizeAvailability(product, selectedSize);
                    const message = availability.status === 'unknown'
                      ? 'Stock not confirmed for this size.'
                      : availability.status === 'sold_out'
                        ? `Size ${selectedSize} is sold out.`
                        : availability.status === 'low'
                          ? `Only ${availability.quantity} left in size ${selectedSize}.`
                          : `Available in size ${selectedSize}.`;
                    return (
                      <p
                        role="status"
                        className={`mt-3 text-xs ${
                          availability.status === 'sold_out'
                            ? 'text-elan-danger'
                            : 'text-elan-muted'
                        }`}
                      >
                        {message}
                      </p>
                    );
                  })()}

                  {sizeError && (
                    <p
                      role="alert"
                      className="mt-3 flex items-center gap-2 text-xs font-medium text-elan-danger"
                    >
                      <AlertCircle size={15} />
                      Please select your size before adding to bag.
                    </p>
                  )}
                </div>
              )}

              {/* Quantity */}
              <div className="mt-7">
                <h2 className="mb-3 text-sm font-semibold text-elan-ink">
                  Quantity
                </h2>

                <div className="inline-flex items-center rounded-xl border border-[#E8E1D7] bg-elan-ivory p-1">
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

                  <span className="w-12 text-center text-sm font-bold text-elan-ink">
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
                  className={`flex min-h-14 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-elan-ivory transition-all active:scale-[0.99] ${added
                      ? 'bg-elan-sage'
                      : 'bg-elan-ink hover:bg-elan-ink-hover'
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
                      ? 'border-[#A85A3C] bg-[#FFF5F0] text-elan-danger'
                      : 'border-[#E8E1D7] text-elan-ink hover:border-[#637666]'
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
                  className="mt-3 flex items-center gap-2 text-xs font-medium text-elan-sage"
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
                  className="flex w-full items-center justify-between py-5 text-left text-sm font-semibold text-elan-ink"
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
                              className="flex items-start gap-3 text-sm leading-6 text-elan-muted"
                            >
                              <Check
                                size={16}
                                className="mt-1 shrink-0 text-elan-sage"
                              />

                              <span>{feature}</span>
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p className="text-sm text-elan-muted">
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
                  className="flex w-full items-center justify-between py-5 text-left text-sm font-semibold text-elan-ink"
                >
                  Delivery & Returns

                  {showDelivery ? (
                    <Minus size={17} />
                  ) : (
                    <Plus size={17} />
                  )}
                </button>

                {showDelivery && (
                  <div className="space-y-3 pb-5 text-sm leading-6 text-elan-muted">
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
                    className="mx-auto mb-2 text-elan-sage"
                  />

                  <p className="text-[11px] leading-4 text-elan-muted">
                    Quality Focused
                  </p>
                </div>

                <div className="text-center">
                  <Truck
                    size={20}
                    className="mx-auto mb-2 text-elan-sage"
                  />

                  <p className="text-[11px] leading-4 text-elan-muted">
                    Shipping not confirmed
                  </p>
                </div>

                <div className="text-center">
                  <RotateCcw
                    size={20}
                    className="mx-auto mb-2 text-elan-sage"
                  />

                  <p className="text-[11px] leading-4 text-elan-muted">
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
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-elan-sage">
                  You May Also Like
                </p>

                <h2 className="mt-1 font-display text-2xl font-medium text-elan-ink sm:text-3xl">
                  More in {product.categoryLabel}
                </h2>
              </div>

              <Link
                to={`/category/${product.category}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-elan-ink hover:text-elan-sage sm:text-sm"
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
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white text-elan-ink"
          >
            <X size={22} />
          </button>

          <ProductImage
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
                className="font-display text-2xl text-elan-ink"
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

            <p className="mb-4 text-sm leading-6 text-elan-muted">
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
                      ? 'border-elan-ink bg-elan-ink text-elan-ivory'
                      : 'border-[#E8E1D7] bg-elan-ivory text-elan-ink'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>

            <p className="mt-5 text-xs text-elan-muted">
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
