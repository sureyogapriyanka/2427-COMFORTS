
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
} from 'lucide-react';

import { Container } from '../components/ui/Container';
import { PRODUCTS, formatINR } from '../data/catalog';
import { useStore } from '../context/StoreContext';
import { ColorDots } from '../components/product/ColorDots';
import { RatingStars } from '../components/product/RatingStars';
import { ProductCard } from '../components/product/ProductCard';
import { DemoBadge } from '../components/brand/DemoBadge';
import { Button } from '../components/ui/Button';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart, isInWishlist, toggleWishlist } = useStore();

  const product = PRODUCTS.find((p) => p.slug === slug);

  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!product) return;

    setSelectedColor(product.colors[0]?.name || '');
    setSelectedSize(product.sizes[0] || '');
    setActiveImage(product.image);
    setQuantity(1);
    setAdded(false);
  }, [product?.id]);

  useEffect(() => {
    if (!added) return;

    const timer = window.setTimeout(() => {
      setAdded(false);
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [added]);

  if (!product) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center bg-[#FAF8F5] py-20">
        <Container className="text-center">
          <h1 className="font-display text-3xl text-[#1F2022]">
            Product Not Found
          </h1>

          <p className="mt-3 text-sm text-[#77736E]">
            This product is currently unavailable.
          </p>

          <Button href="/" variant="primary" className="mt-6">
            Continue Shopping
          </Button>
        </Container>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);

  const images = [
    { src: product.image, label: 'Front View' },
    ...(product.hoverImage && product.hoverImage !== product.image
      ? [{ src: product.hoverImage, label: 'Back View' }]
      : []),
  ];

  const related = PRODUCTS.filter(
    (item) =>
      item.category === product.category &&
      item.id !== product.id
  ).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(
      product,
      selectedColor || product.colors[0]?.name || '',
      selectedSize || product.sizes[0] || '',
      quantity
    );

    setAdded(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-20">
      <Container>
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 py-6 text-xs text-[#77736E]"
        >
          <Link to="/" className="hover:text-[#1F2022]">
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

          <span className="font-medium text-[#1F2022]">
            {product.name}
          </span>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">

          {/* Product Gallery */}
          <div className="lg:col-span-7">
            <div className="flex flex-col-reverse gap-4 sm:flex-row">

              {/* Thumbnails */}
              <div className="flex gap-3 sm:flex-col">
                {images.map((image) => (
                  <button
                    key={image.src}
                    type="button"
                    onClick={() => setActiveImage(image.src)}
                    aria-label={`Show ${image.label}`}
                    aria-pressed={
                      (activeImage || product.image) === image.src
                    }
                    className={`h-24 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white p-1 transition-all ${(activeImage || product.image) === image.src
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

              {/* Main Image */}
              <div className="relative flex-1 overflow-hidden rounded-3xl border border-[#EEE7DE] bg-white">
                <div className="relative flex aspect-[4/5] items-center justify-center p-4 sm:p-8">
                  <img
                    src={activeImage || product.image}
                    alt={product.name}
                    className="h-full w-full object-contain transition-all duration-300"
                  />

                  <div className="absolute left-4 top-4 flex flex-col items-start gap-2">
                    {product.code && (
                      <span className="rounded-full bg-[#242625] px-3 py-1.5 text-[10px] font-semibold tracking-wide text-white">
                        {product.code}
                      </span>
                    )}

                    <DemoBadge
                      variant="pill"
                      className="bg-white/95 shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery Footer */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#77736E]">
              <PackageCheck size={15} />
              <span>Explore the product from different views</span>
            </div>
          </div>

          {/* Product Information */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-[#EEE7DE] bg-white p-6 sm:p-8">

              {/* Category & Rating */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#637666]">
                  {product.fabricBadge || product.categoryLabel}
                </span>

                {product.rating ? (
                  <RatingStars
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                  />
                ) : null}
              </div>

              {/* Name */}
              <h1 className="font-display text-3xl font-medium leading-tight text-[#1F2022] sm:text-4xl">
                {product.name}
              </h1>

              <p className="mt-3 text-sm leading-6 text-[#77736E]">
                {product.subtitle}
              </p>

              {/* Price */}
              <div className="mt-6 border-b border-[#EEE7DE] pb-6">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-[#77736E]">
                      Price
                    </p>

                    <p className="mt-1 font-numeral text-3xl font-bold text-[#1F2022]">
                      {formatINR(product.price)}
                    </p>
                  </div>

                  <span className="rounded-full bg-[#EDF3ED] px-3 py-1.5 text-[10px] font-semibold text-[#637666]">
                    Inclusive of Taxes
                  </span>
                </div>

                {product.isDemoPrice && (
                  <p className="mt-2 text-xs text-[#99938B]">
                    Sample price shown for demonstration.
                  </p>
                )}
              </div>

              {/* Colors */}
              {product.colors.length > 0 && (
                <div className="mt-6">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-[#1F2022]">
                      Choose Color
                    </h2>

                    <span className="text-xs font-medium text-[#637666]">
                      {selectedColor || product.colors[0]?.name}
                    </span>
                  </div>

                  <ColorDots
                    colors={product.colors}
                    selectedColor={selectedColor || product.colors[0]?.name || ''}
                    onSelect={setSelectedColor}
                    size="md"
                  />
                </div>
              )}

              {/* Sizes */}
              {product.sizes.length > 0 && (
                <div className="mt-7">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-[#1F2022]">
                      Select Size
                    </h2>

                    <Link
                      to="/contact#size-guide"
                      className="flex items-center gap-1 text-xs font-medium text-[#637666] underline underline-offset-4"
                    >
                      <Ruler size={14} />
                      Size Guide
                    </Link>
                  </div>

                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        aria-pressed={
                          (selectedSize || product.sizes[0]) === size
                        }
                        className={`min-h-12 rounded-xl border px-2 text-xs font-bold transition-all ${(selectedSize || product.sizes[0]) === size
                            ? 'border-[#1F2022] bg-[#1F2022] text-white'
                            : 'border-[#E8E1D7] bg-[#FAF8F5] text-[#1F2022] hover:border-[#637666]'
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
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
                    onClick={() =>
                      setQuantity((value) => Math.max(1, value - 1))
                    }
                    disabled={quantity === 1}
                    aria-label="Decrease quantity"
                    className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-white disabled:opacity-40"
                  >
                    <Minus size={16} />
                  </button>

                  <span className="w-12 text-center text-sm font-bold">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((value) => Math.min(99, value + 1))
                    }
                    disabled={quantity === 99}
                    aria-label="Increase quantity"
                    className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-white disabled:opacity-40"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Cart and Wishlist */}
              <div className="mt-7 flex gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex min-h-14 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-white transition-all active:scale-[0.99] ${added
                      ? 'bg-[#637666]'
                      : 'bg-[#1F2022] hover:bg-[#34373C]'
                    }`}
                >
                  {added ? (
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
                  onClick={() => toggleWishlist(product.id)}
                  aria-label={
                    isFavorited
                      ? 'Remove from wishlist'
                      : 'Add to wishlist'
                  }
                  aria-pressed={isFavorited}
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border transition-all ${isFavorited
                      ? 'border-[#A85A3C] bg-[#FFF5F0] text-[#A85A3C]'
                      : 'border-[#E8E1D7] text-[#1F2022] hover:border-[#637666]'
                    }`}
                >
                  <Heart
                    size={20}
                    fill={isFavorited ? 'currentColor' : 'none'}
                  />
                </button>
              </div>

              {/* Product Features */}
              {product.features.length > 0 && (
                <div className="mt-8 border-t border-[#EEE7DE] pt-6">
                  <h2 className="mb-4 text-sm font-semibold text-[#1F2022]">
                    Product Highlights
                  </h2>

                  <ul className="space-y-3">
                    {product.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm leading-5 text-[#696C68]"
                      >
                        <Check
                          size={16}
                          className="mt-0.5 shrink-0 text-[#637666]"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Shopping Information */}
              <div className="mt-8 grid grid-cols-3 gap-3 border-t border-[#EEE7DE] pt-6">
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
                    Delivery Details at Checkout
                  </p>
                </div>

                <div className="text-center">
                  <RotateCcw
                    size={20}
                    className="mx-auto mb-2 text-[#637666]"
                  />
                  <p className="text-[11px] leading-4 text-[#77736E]">
                    Check Return Policy
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-16 sm:mt-20">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#637666]">
                  You May Also Like
                </p>

                <h2 className="mt-2 font-display text-3xl font-medium text-[#1F2022]">
                  More in {product.categoryLabel}
                </h2>
              </div>

              <Link
                to={`/category/${product.category}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#637666] hover:text-[#1F2022]"
              >
                View All
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
    </div>
  );
}
