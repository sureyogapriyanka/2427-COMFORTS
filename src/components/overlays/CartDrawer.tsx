
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Heart,
} from 'lucide-react';

import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../data/catalog';
import { ProductImage } from '../product/ProductImage';

const CHECKOUT_SELECTION_KEY = '2427-checkout-selection';

const getItemKey = (
  productId: string,
  color: string,
  size: string
) => JSON.stringify([productId, color, size]);

export function CartDrawer() {
  const navigate = useNavigate();

  const {
    overlay,
    closeOverlay,
    cart,
    cartCount,
    updateQuantity,
    removeFromCart,
    moveToWishlist,
  } = useStore();

  const [excludedItems, setExcludedItems] =
    useState<string[]>([]);

  const isOpen = overlay === 'cart';

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeOverlay();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener(
        'keydown',
        handleEscape
      );
    };
  }, [isOpen, closeOverlay]);

  useEffect(() => {
    const validKeys = new Set(
      cart.map((item) =>
        getItemKey(
          item.product.id,
          item.selectedColor,
          item.selectedSize
        )
      )
    );

    setExcludedItems((previous) => {
      const next = previous.filter((key) =>
        validKeys.has(key)
      );

      return next.length === previous.length
        ? previous
        : next;
    });
  }, [cart]);

  if (!isOpen) return null;

  const selectedItems = cart.filter(
    (item) =>
      !excludedItems.includes(
        getItemKey(
          item.product.id,
          item.selectedColor,
          item.selectedSize
        )
      )
  );

  const selectedCount = selectedItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const selectedSubtotal = selectedItems.reduce(
    (sum, item) =>
      sum + item.product.price * item.quantity,
    0
  );

  const allSelected =
    cart.length > 0 &&
    cart.every(
      (item) =>
        !excludedItems.includes(
          getItemKey(
            item.product.id,
            item.selectedColor,
            item.selectedSize
          )
        )
    );

  const toggleSelection = (key: string) => {
    setExcludedItems((previous) =>
      previous.includes(key)
        ? previous.filter((value) => value !== key)
        : [...previous, key]
    );
  };

  const toggleSelectAll = () => {
    setExcludedItems(
      allSelected
        ? cart.map((item) =>
          getItemKey(
            item.product.id,
            item.selectedColor,
            item.selectedSize
          )
        )
        : []
    );
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) return;

    const keys = selectedItems.map((item) =>
      getItemKey(
        item.product.id,
        item.selectedColor,
        item.selectedSize
      )
    );

    try {
      sessionStorage.setItem(
        CHECKOUT_SELECTION_KEY,
        JSON.stringify(keys)
      );
    } catch {
      // Checkout page will use the cart if storage is unavailable.
    }

    closeOverlay();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px]">
      <button
        type="button"
        onClick={closeOverlay}
        aria-label="Close shopping bag"
        className="absolute inset-0 h-full w-full"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        className="absolute inset-y-0 right-0 flex h-full w-full max-w-[500px] flex-col overflow-hidden bg-elan-ivory shadow-2xl"
      >
        {/* Header */}
        <header className="shrink-0 border-b border-[#E8E1D7] bg-white px-5 py-5 sm:px-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-elan-sage">
                2427 ÉLAN
              </p>

              <h2 className="mt-1 font-display text-2xl text-elan-ink">
                Shopping Bag
              </h2>

              <p className="mt-1 text-xs text-elan-muted">
                {cartCount} items in your bag
              </p>
            </div>

            <button
              type="button"
              onClick={closeOverlay}
              aria-label="Close bag"
              className="rounded-full border border-[#E8E1D7] p-2.5 hover:bg-elan-ivory"
            >
              <X size={19} />
            </button>
          </div>
        </header>

        {/* Select All */}
        {cart.length > 0 && (
          <div className="flex items-center justify-between border-b border-[#E8E1D7] bg-white px-5 py-3 sm:px-7">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="accent-[#637666]"
              />
              Select All
            </label>

            <span className="text-xs text-elan-sage">
              {selectedCount} selected
            </span>
          </div>
        )}

        {/* Items */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag
                size={44}
                className="text-elan-sage"
              />

              <h3 className="mt-5 font-display text-2xl">
                Your bag is empty
              </h3>

              <p className="mt-3 text-sm text-elan-muted">
                Add your favorite everyday essentials.
              </p>

              <Link
                to="/"
                onClick={closeOverlay}
                className="mt-6 rounded-xl bg-elan-ink px-6 py-3 text-sm font-semibold text-elan-ivory"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            cart.map((item) => {
              const key = getItemKey(
                item.product.id,
                item.selectedColor,
                item.selectedSize
              );

              const isSelected =
                !excludedItems.includes(key);

              return (
                <article
                  key={key}
                  className={`rounded-2xl border bg-white p-4 ${isSelected
                      ? 'border-[#E8E1D7]'
                      : 'border-[#E8E1D7] opacity-60'
                    }`}
                >
                  <div className="flex gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() =>
                        toggleSelection(key)
                      }
                      aria-label={`Select ${item.product.name}`}
                      className="mt-2 accent-[#637666]"
                    />

                    <Link
                      to={`/product/${item.product.slug}`}
                      onClick={closeOverlay}
                      className="h-28 w-20 shrink-0 rounded-xl bg-elan-ivory p-1 sm:w-24"
                    >
                      <ProductImage
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-contain"
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/product/${item.product.slug}`}
                          onClick={closeOverlay}
                          className="font-display text-sm font-semibold text-elan-ink"
                        >
                          {item.product.name}
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(
                              item.product.id,
                              item.selectedColor,
                              item.selectedSize
                            )
                          }
                          aria-label="Remove item"
                          className="text-elan-danger"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <p className="mt-2 text-sm font-bold">
                        {formatINR(item.product.price)}
                      </p>

                      <p className="mt-2 text-xs text-elan-muted">
                        Size: {item.selectedSize}
                      </p>

                      <p className="mt-1 text-xs text-elan-muted">
                        Color: {item.selectedColor}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          moveToWishlist(
                            item.product.id,
                            item.selectedColor,
                            item.selectedSize
                          )
                        }
                        className="mt-3 flex items-center gap-1.5 text-xs text-elan-sage"
                      >
                        <Heart size={14} />
                        Move to Wishlist
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[#EEE7DE] pt-3">
                    <div className="flex items-center overflow-hidden rounded-xl border border-[#E8E1D7]">
                      <button
                        type="button"
                        disabled={item.quantity <= 1}
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.selectedColor,
                            item.selectedSize,
                            -1
                          )
                        }
                        aria-label="Decrease quantity"
                        className="p-2 disabled:opacity-40"
                      >
                        <Minus size={15} />
                      </button>

                      <span className="w-8 text-center text-sm font-bold">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        disabled={item.quantity >= 99}
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.selectedColor,
                            item.selectedSize,
                            1
                          )
                        }
                        aria-label="Increase quantity"
                        className="p-2 disabled:opacity-40"
                      >
                        <Plus size={15} />
                      </button>
                    </div>

                    <p className="text-sm font-bold">
                      {formatINR(
                        item.product.price *
                        item.quantity
                      )}
                    </p>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Summary */}
        {cart.length > 0 && (
          <footer className="shrink-0 border-t border-[#E8E1D7] bg-white px-5 py-5 sm:px-7">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-elan-muted">
                  Selected Subtotal
                </span>

                <strong>
                  {formatINR(selectedSubtotal)}
                </strong>
              </div>

              <p className="border-t border-[#EEE7DE] pt-3 text-xs leading-5 text-elan-muted">
                {selectedItems.some((item) => item.product.isDemoPrice)
                  ? 'Displayed prices and subtotal are sample values. '
                  : ''}
                Shipping, taxes and the final order total are unavailable until
                business rules are confirmed.
              </p>
            </div>

            <button
              type="button"
              disabled={selectedCount === 0}
              onClick={handleCheckout}
              className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-elan-ink px-5 text-sm font-semibold text-elan-ivory hover:bg-elan-ink-hover disabled:opacity-40"
            >
              Checkout Selected ({selectedCount})
              <ArrowRight size={17} />
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-elan-muted">
              <ShieldCheck
                size={15}
                className="text-elan-sage"
              />
              Demo checkout — no payment collected
            </div>
          </footer>
        )}
      </aside>
    </div>
  );
}
