import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Plus,
  Minus,
  Info,
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
  const navigate = useNavigate();
  const { addToCart, isInWishlist, toggleWishlist } = useStore();

  const product = PRODUCTS.find((p) => p.slug === slug);

  const [selectedColor, setSelectedColor] = useState(
    product ? product.colors[0]?.name || '' : ''
  );
  const [selectedSize, setSelectedSize] = useState(
    product ? product.sizes[0] || 'M' : 'M'
  );
  const [activeImage, setActiveImage] = useState(product ? product.image : '');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // If product not found
  if (!product) {
    return (
      <div className="py-20 bg-[#FAF8F5] min-h-[60vh] flex items-center justify-center">
        <Container className="text-center max-w-md">
          <h2 className="font-display text-3xl font-medium text-[#1F2022]">Product Not Found</h2>
          <p className="mt-2 text-xs text-[#5E6064]">
            The product you are looking for is either in preparation or does not exist.
          </p>
          <Button href="/category/men-boxers" variant="primary" className="mt-6">
            View Men's Boxers
          </Button>
        </Container>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Related products from the same category
  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  return (
    <div className="py-10 sm:py-16 bg-[#FAF8F5] min-h-screen">
      <Container>
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-[#6B6F76] mb-8">
          <Link to="/" className="hover:text-[#1F2022] transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link
            to={`/category/${product.category}`}
            className="hover:text-[#1F2022] transition-colors capitalize"
          >
            {product.categoryLabel}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[#1F2022] font-semibold">{product.name}</span>
        </div>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E1D7] shadow-xs">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnail Selectors */}
            <div className="flex sm:flex-col gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setActiveImage(product.image)}
                className={`relative h-20 w-16 sm:h-24 sm:w-20 overflow-hidden rounded-xl border-2 transition-all ${
                  activeImage === product.image ? 'border-[#637666] ring-1 ring-[#637666]' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={product.image}
                  alt={`${product.name} Front`}
                  className="h-full w-full object-cover"
                />
              </button>
              <button
                type="button"
                onClick={() => setActiveImage(product.hoverImage)}
                className={`relative h-20 w-16 sm:h-24 sm:w-20 overflow-hidden rounded-xl border-2 transition-all ${
                  activeImage === product.hoverImage ? 'border-[#637666] ring-1 ring-[#637666]' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={product.hoverImage}
                  alt={`${product.name} Macro Detail`}
                  className="h-full w-full object-cover"
                />
              </button>
            </div>

            {/* Main Stage Image */}
            <div className="relative aspect-[3/4] w-full flex-1 overflow-hidden rounded-2xl bg-[#F4EFEB]">
              <img
                src={activeImage || product.image}
                alt={product.name}
                className="h-full w-full object-cover object-center transition-all duration-500"
              />

              <div className="absolute top-4 left-4 flex flex-col items-start gap-2">
                {product.code && (
                  <span className="rounded-full bg-[#1F2022] px-3 py-1 text-xs font-numeral font-bold text-white shadow-xs">
                    Base Code: {product.code}
                  </span>
                )}
                <DemoBadge variant="pill" className="bg-white/90 shadow-xs" />
              </div>
            </div>
          </div>

          {/* Right Column: Information, Pricing, Size & Bag */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-[#637666] font-semibold uppercase tracking-wider mb-2">
                <span>{product.fabricBadge}</span>
                {product.rating && (
                  <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
                )}
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-medium text-[#1F2022] leading-tight">
                {product.name}
              </h1>

              <p className="mt-1 text-sm text-[#5E6064] font-light">
                {product.subtitle}
              </p>

              {/* Price Banner */}
              <div className="mt-5 rounded-2xl bg-[#FAF8F5] p-4 border border-[#E8E1D7] flex items-baseline justify-between">
                <div>
                  <span className="font-numeral text-3xl font-bold text-[#1F2022]">
                    {formatINR(product.price)}
                  </span>
                  {product.isDemoPrice && (
                    <span className="text-xs text-[#8C9097] ml-2 font-sans font-medium">
                      (Sample Price &bull; Demo)
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-[#637666] font-semibold uppercase tracking-wider">
                  Taxes Included
                </span>
              </div>

              {/* Color Swatches */}
              <div className="mt-6 border-t border-[#E8E1D7] pt-5">
                <div className="flex items-center justify-between text-xs font-medium text-[#1F2022] mb-2.5">
                  <span>Color Selection:</span>
                  <span className="text-[#637666] font-semibold">{selectedColor}</span>
                </div>
                <ColorDots
                  colors={product.colors}
                  selectedColor={selectedColor}
                  onSelect={setSelectedColor}
                  size="md"
                />
              </div>

              {/* Size Selector */}
              <div className="mt-6 border-t border-[#E8E1D7] pt-5">
                <div className="flex items-center justify-between text-xs font-medium text-[#1F2022] mb-2.5">
                  <span>Select Size:</span>
                  <Link to="/contact#size-guide" className="text-[#637666] underline">
                    Size Guide
                  </Link>
                </div>
                <div className="grid grid-cols-5 gap-2 font-numeral">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`h-11 rounded-xl border text-xs font-bold transition-all ${
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

              {/* Quantity & Bag CTA */}
              <div className="mt-6 pt-5 border-t border-[#E8E1D7]">
                <div className="flex items-center gap-3">
                  {/* Quantity Counter */}
                  <div className="flex items-center rounded-xl border border-[#E8E1D7] bg-[#FAF8F5] p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="h-10 w-8 flex items-center justify-center text-[#1F2022] hover:bg-white rounded-lg transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-numeral text-sm font-bold text-[#1F2022]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="h-10 w-8 flex items-center justify-center text-[#1F2022] hover:bg-white rounded-lg transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Add to Bag Button */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#1F2022] py-3.5 text-sm font-semibold text-white hover:bg-[#34373C] transition-all shadow-md active:scale-[0.98]"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>{added ? 'Added to Bag!' : `Add to Bag (${selectedSize})`}</span>
                  </button>

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id)}
                    className={`flex h-12 w-12 items-center justify-center rounded-xl border border-[#E8E1D7] transition-all hover:border-[#637666] ${
                      isFavorited ? 'text-[#A85A3C] bg-[#FAF8F5]' : 'text-[#1F2022]'
                    }`}
                    aria-label="Wishlist toggle"
                  >
                    <Heart className={`h-5 w-5 ${isFavorited ? 'fill-[#A85A3C]' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Features Checklist */}
              <div className="mt-8 border-t border-[#E8E1D7] pt-5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#637666] block mb-2">
                  Garment Construction
                </span>
                <ul className="space-y-2 text-xs text-[#1F2022]">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#637666] shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Assurance Badges */}
              <div className="mt-8 grid grid-cols-3 gap-3 border-t border-[#E8E1D7] pt-5 text-center text-[11px] text-[#5E6064]">
                <div>
                  <ShieldCheck className="mx-auto h-4 w-4 text-[#637666] mb-1" />
                  <span>30-Day Guarantee</span>
                </div>
                <div>
                  <Truck className="mx-auto h-4 w-4 text-[#637666] mb-1" />
                  <span>Express Dispatch</span>
                </div>
                <div>
                  <RotateCcw className="mx-auto h-4 w-4 text-[#637666] mb-1" />
                  <span>Discreet Box</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products from the Category */}
        {related.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="eyebrow text-[#637666]">Complete The Rotation</span>
                <h3 className="font-display text-3xl font-medium text-[#1F2022] mt-1">
                  More in {product.categoryLabel}
                </h3>
              </div>
              <Link
                to={`/category/${product.category}`}
                className="text-xs font-semibold text-[#637666] hover:text-[#1F2022] transition-colors"
              >
                View Category &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
