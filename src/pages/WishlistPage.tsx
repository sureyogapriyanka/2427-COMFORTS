
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  ArrowLeft,
  Trash2,
  Check,
  X,
  ChevronRight,
  Plus,
  Minus,
} from 'lucide-react';

import { Container } from '../components/ui/Container';
import { useStore } from '../context/StoreContext';
import { formatINR, type Product } from '../data/catalog';
import { Button } from '../components/ui/Button';
import { ColorDots } from '../components/product/ColorDots';
import { useCatalog } from '../context/CatalogContext';

export function WishlistPage() {
  const { products } = useCatalog();
  const {
    wishlist,
    toggleWishlist,
    addToCart,
  } = useStore();

  const savedProducts = products.filter((product) =>
    wishlist.includes(product.id)
  );

  const [activeProduct, setActiveProduct] =
    useState<Product | null>(null);

  const [selectedSize, setSelectedSize] =
    useState('');

  const [selectedColor, setSelectedColor] =
    useState('');

  const [quantity, setQuantity] =
    useState(1);

  const [sizeError, setSizeError] =
    useState(false);

  const [addedProductId, setAddedProductId] =
    useState<string | null>(null);

  const openQuickAdd = (product: Product) => {
    setActiveProduct(product);
    setSelectedSize('');
    setSelectedColor(product.colors[0]?.name || '');
    setQuantity(1);
    setSizeError(false);
  };

  const closeQuickAdd = () => {
    setActiveProduct(null);
    setSizeError(false);
  };

  const handleAddToBag = () => {
    if (!activeProduct) return;

    if (
      activeProduct.sizes.length > 0 &&
      !selectedSize
    ) {
      setSizeError(true);
      return;
    }

    addToCart(
      activeProduct,
      selectedColor ||
      activeProduct.colors[0]?.name ||
      '',
      selectedSize,
      quantity
    );

    setAddedProductId(activeProduct.id);
    closeQuickAdd();
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 sm:py-14">
      <Container>
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-7 flex items-center gap-2 text-xs text-[#77736E]"
        >
          <Link
            to="/"
            className="hover:text-[#1F2022]"
          >
            Home
          </Link>

          <ChevronRight size={13} />

          <span className="font-semibold text-[#1F2022]">
            Wishlist
          </span>
        </nav>

        {/* Page Header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[#E8E1D7] pb-7">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#637666]">
              Your Saved Collection
            </p>

            <h1 className="mt-2 font-display text-3xl font-medium text-[#1F2022] sm:text-4xl">
              My Wishlist
            </h1>

            <p className="mt-3 text-sm text-[#77736E]">
              {savedProducts.length === 0
                ? 'Your favorite styles will appear here.'
                : `${savedProducts.length} ${savedProducts.length === 1
                  ? 'product'
                  : 'products'
                } saved for later`}
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#637666] transition-colors hover:text-[#1F2022] sm:text-sm"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
        </div>

        {/* Empty Wishlist */}
        {savedProducts.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-3xl border border-[#E8E1D7] bg-white px-6 py-14 text-center shadow-sm sm:px-12 sm:py-20">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#F1F3EF]">
              <Heart
                size={38}
                strokeWidth={1.5}
                className="text-[#637666]"
              />
            </div>

            <h2 className="font-display text-2xl font-medium text-[#1F2022] sm:text-3xl">
              Your Wishlist Is Empty
            </h2>

            <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-[#77736E]">
              Save the styles you love and keep your
              favorite comfort essentials in one place.
            </p>

            <Button
              href="/"
              variant="primary"
              className="mt-7"
            >
              Explore Collections
            </Button>
          </div>
        ) : (
          <>
            {/* Wishlist Count */}
            <div className="mb-5 flex items-center justify-between">
              <span className="text-xs font-medium text-[#77736E]">
                Showing {savedProducts.length} saved
                {savedProducts.length === 1
                  ? ' item'
                  : ' items'}
              </span>

              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#637666]">
                <Heart
                  size={14}
                  fill="currentColor"
                />
                Your Favorites
              </span>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {savedProducts.map((product) => {
                const hasDiscount =
                  product.compareAt != null &&
                  product.compareAt > product.price;

                return (
                  <article
                    key={product.id}
                    className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E8E1D7] bg-white transition-all hover:border-[#CFC8BD] hover:shadow-md"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#F8F6F2]">
                      <Link
                        to={`/product/${product.slug}`}
                        className="flex h-full w-full items-center justify-center p-3"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                      </Link>

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => {
                          toggleWishlist(product.id);

                          if (
                            addedProductId === product.id
                          ) {
                            setAddedProductId(null);
                          }
                        }}
                        aria-label={`Remove ${product.name} from wishlist`}
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#A85A3C] shadow-sm transition-transform hover:scale-110"
                      >
                        <Trash2 size={17} />
                      </button>

                      {product.badge && (
                        <span className="absolute left-3 top-3 rounded-full bg-[#1F2022] px-2.5 py-1 text-[10px] font-semibold text-white">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-1 flex-col p-3.5 sm:p-5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#637666]">
                        {product.fabricBadge ||
                          product.categoryLabel}
                      </p>

                      <Link
                        to={`/product/${product.slug}`}
                        className="mt-2 line-clamp-2 min-h-10 font-display text-sm font-medium leading-5 text-[#1F2022] hover:text-[#637666] sm:text-base"
                      >
                        {product.name}
                      </Link>

                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#77736E]">
                        {product.subtitle}
                      </p>

                      {/* Price */}
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span className="font-numeral text-base font-bold text-[#1F2022] sm:text-lg">
                          {formatINR(product.price)}
                        </span>

                        {hasDiscount && (
                          <span className="text-xs text-[#99938B] line-through">
                            {formatINR(product.compareAt!)}
                          </span>
                        )}
                      </div>

                      {/* Quick Add */}
                      <button
                        type="button"
                        onClick={() =>
                          openQuickAdd(product)
                        }
                        className={`mt-auto flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-2 py-3 text-xs font-semibold transition-colors sm:text-sm ${addedProductId === product.id
                          ? 'bg-[#637666] text-white'
                          : 'bg-[#1F2022] text-white hover:bg-[#34373C]'
                          }`}
                      >
                        {addedProductId === product.id ? (
                          <>
                            <Check size={16} />
                            Added to Bag
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={16} />
                            Add to Bag
                          </>
                        )}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </Container>

      {/* Quick Add Modal */}
      {activeProduct && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeQuickAdd();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-add-title"
            className="my-auto w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#EEE7DE] px-5 py-4">
              <h2
                id="quick-add-title"
                className="font-display text-xl font-medium text-[#1F2022]"
              >
                Quick Add to Bag
              </h2>

              <button
                type="button"
                onClick={closeQuickAdd}
                aria-label="Close quick add"
                className="rounded-full p-2 text-[#1F2022] hover:bg-[#F4F2EF]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[75vh] space-y-6 overflow-y-auto p-5 sm:p-6">
              {/* Selected Product */}
              <div className="flex items-center gap-4">
                <div className="flex h-28 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#FAF8F5] p-2">
                  <img
                    src={activeProduct.image}
                    alt={activeProduct.name}
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#637666]">
                    {activeProduct.categoryLabel}
                  </p>

                  <h3 className="mt-1 font-display text-base font-medium text-[#1F2022]">
                    {activeProduct.name}
                  </h3>

                  <p className="mt-2 font-numeral text-lg font-bold text-[#1F2022]">
                    {formatINR(activeProduct.price)}
                  </p>
                </div>
              </div>

              {/* Colors */}
              {activeProduct.colors.length > 0 && (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-[#1F2022]">
                      Select Color
                    </h3>

                    <span className="text-xs text-[#637666]">
                      {selectedColor}
                    </span>
                  </div>

                  <ColorDots
                    colors={activeProduct.colors}
                    selectedColor={selectedColor}
                    onSelect={setSelectedColor}
                    size="md"
                  />
                </div>
              )}

              {/* Sizes */}
              {activeProduct.sizes.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-[#1F2022]">
                    Select Size
                    <span className="ml-1 text-[#A85A3C]">
                      *
                    </span>
                  </h3>

                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                    {activeProduct.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          setSelectedSize(size);
                          setSizeError(false);
                        }}
                        aria-pressed={
                          selectedSize === size
                        }
                        className={`min-h-11 rounded-xl border px-2 text-xs font-bold ${selectedSize === size
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
                      className="mt-3 text-xs font-medium text-[#A85A3C]"
                    >
                      Please select a size to continue.
                    </p>
                  )}
                </div>
              )}

              {/* Quantity */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-[#1F2022]">
                  Quantity
                </h3>

                <div className="inline-flex items-center overflow-hidden rounded-xl border border-[#E8E1D7] bg-[#FAF8F5]">
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((value) =>
                        Math.max(1, value - 1)
                      )
                    }
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="flex h-11 w-11 items-center justify-center hover:bg-white disabled:opacity-40"
                  >
                    <Minus size={16} />
                  </button>

                  <span className="w-12 text-center text-sm font-bold">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((value) =>
                        Math.min(99, value + 1)
                      )
                    }
                    disabled={quantity >= 99}
                    aria-label="Increase quantity"
                    className="flex h-11 w-11 items-center justify-center hover:bg-white disabled:opacity-40"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Add Button */}
              <button
                type="button"
                onClick={handleAddToBag}
                className="flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#1F2022] px-5 py-3.5 text-sm font-semibold text-white hover:bg-[#34373C]"
              >
                <ShoppingBag size={18} />
                Add to Bag —{' '}
                {formatINR(
                  activeProduct.price * quantity
                )}
              </button>

              <Link
                to={`/product/${activeProduct.slug}`}
                onClick={closeQuickAdd}
                className="flex items-center justify-center gap-2 text-xs font-semibold text-[#637666] hover:text-[#1F2022]"
              >
                View Product Details
                <ChevronRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
