
import React, { useEffect, useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Heart,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../data/catalog';
import { Button } from '../ui/Button';

const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_FEE = 99;

const getItemKey = (
  productId: string,
  color: string,
  size: string
) => JSON.stringify([productId, color, size]);

export function CartDrawer() {
  const {
    overlay,
    closeOverlay,
    cart,
    cartCount,
    updateQuantity,
    removeFromCart,
    moveToWishlist,
  } = useStore();

  const [excludedItems, setExcludedItems] = useState<string[]>([]);
  const [checkoutMessage, setCheckoutMessage] = useState(false);

  const isOpen = overlay === 'cart';

  useEffect(() => {
    if (!isOpen) {
      setCheckoutMessage(false);
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeOverlay();
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeOverlay]);

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

  const shippingCost =
    selectedSubtotal === 0 ||
      selectedSubtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : SHIPPING_FEE;

  const selectedTotal = selectedSubtotal + shippingCost;

  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - selectedSubtotal
  );

  const shippingProgress = Math.min(
    100,
    (selectedSubtotal / FREE_SHIPPING_THRESHOLD) * 100
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
        ? previous.filter((itemKey) => itemKey !== key)
        : [...previous, key]
    );
    setCheckoutMessage(false);
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
    setCheckoutMessage(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-[2px]"
      role="presentation"
    >
      {/* Backdrop */}
      <button
        type="button"
        onClick={closeOverlay}
        className="absolute inset-0 h-full w-full cursor-default"
        aria-label="Close shopping bag"
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        className="absolute inset-y-0 right-0 flex h-full w-full max-w-[480px] flex-col overflow-hidden border-l border-[#E8E1D7] bg-[#FAF8F5] shadow-2xl"
      >
        {/* Header */}
        <div className="shrink-0 border-b border-[#E8E1D7] bg-white px-5 py-5 sm:px-7">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F1F3EF] text-[#637666]">
                <ShoppingBag size={21} />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#637666]">
                  2427-COMFORTS
                </p>
                <h2 className="font-display text-2xl font-medium text-[#1F2022]">
                  Shopping Bag
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={closeOverlay}
              aria-label="Close bag"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8E1D7] text-[#1F2022] transition-colors hover:bg-[#FAF8F5]"
            >
              <X size={19} />
            </button>
          </div>

          <p className="mt-3 text-xs text-[#77736E]">
            {cartCount === 0
              ? 'Your bag is waiting for something comfortable.'
              : `${cartCount} item${cartCount === 1 ? '' : 's'} in your bag`}
          </p>
        </div>

        {/* Shipping Progress */}
        {cart.length > 0 && (
          <div className="shrink-0 border-b border-[#E8E1D7] bg-[#F2F4EF] px-5 py-4 sm:px-7">
            <div className="mb-2 flex items-start gap-2">
              {remainingForFreeShipping === 0 &&
                selectedCount > 0 ? (
                <CheckCircle2
                  size={17}
                  className="shrink-0 text-[#637666]"
                />
              ) : (
                <Truck
                  size={17}
                  className="shrink-0 text-[#637666]"
                />
              )}

              <p className="text-xs font-medium leading-5 text-[#343A34]">
                {selectedCount === 0
                  ? 'Select items to calculate shipping.'
                  : remainingForFreeShipping > 0
                    ? `Add ${formatINR(remainingForFreeShipping)} more for free shipping`
                    : 'Free shipping unlocked for selected items!'}
              </p>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-[#DDE3DA]">
              <div
                className="h-full rounded-full bg-[#637666] transition-all duration-300"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>

            <div className="mt-1.5 flex justify-between text-[10px] text-[#77736E]">
              <span>Selected order</span>
              <span>{formatINR(FREE_SHIPPING_THRESHOLD)} goal</span>
            </div>
          </div>
        )}

        {/* Select All */}
        {cart.length > 0 && (
          <div className="flex shrink-0 items-center justify-between border-b border-[#E8E1D7] bg-white px-5 py-3 sm:px-7">
            <label className="flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-[#1F2022]">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="h-4 w-4 cursor-pointer accent-[#637666]"
              />
              Select All
            </label>

            <span className="rounded-full bg-[#F1F3EF] px-3 py-1 text-[11px] font-semibold text-[#637666]">
              {selectedCount} selected
            </span>
          </div>
        )}

        {/* Cart Items */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
          {cart.length === 0 ? (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center">
              <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-[#F1F3EF]">
                <ShoppingBag
                  size={38}
                  strokeWidth={1.5}
                  className="text-[#637666]"
                />
              </div>

              <h3 className="font-display text-3xl font-medium text-[#1F2022]">
                Your bag is empty
              </h3>

              <p className="mt-3 max-w-[270px] text-sm leading-6 text-[#77736E]">
                Find your everyday comfort essentials and add your favorites.
              </p>

              <Button
                href="/category/bundles"
                variant="primary"
                className="mt-7"
                onClick={closeOverlay}
              >
                Explore Collection
              </Button>
            </div>
          ) : (
            cart.map((item) => {
              const key = getItemKey(
                item.product.id,
                item.selectedColor,
                item.selectedSize
              );

              const isSelected = !excludedItems.includes(key);

              return (
                <div
                  key={key}
                  className={`rounded-2xl border bg-white p-3.5 transition-all sm:p-4 ${isSelected
                      ? 'border-[#E8E1D7] shadow-sm'
                      : 'border-[#E8E1D7] opacity-65'
                    }`}
                >
                  <div className="flex gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelection(key)}
                      aria-label={`Select ${item.product.name}`}
                      className="mt-2 h-4 w-4 shrink-0 cursor-pointer accent-[#637666]"
                    />

                    {/* Product Image */}
                    <div className="flex h-28 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F8F6F2] p-1">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display text-sm font-medium leading-5 text-[#1F2022] sm:text-base">
                          {item.product.name}
                        </h3>

                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(
                              item.product.id,
                              item.selectedColor,
                              item.selectedSize
                            )
                          }
                          aria-label={`Remove ${item.product.name}`}
                          className="shrink-0 rounded-lg p-1.5 text-[#8B8B8B] transition-colors hover:bg-[#FFF1ED] hover:text-[#A85A3C]"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <p className="mt-1.5 font-numeral text-sm font-bold text-[#1F2022]">
                        {formatINR(item.product.price)}
                        <span className="ml-1 text-[11px] font-normal text-[#77736E]">
                          each
                        </span>
                      </p>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <span className="rounded-md bg-[#F4EFEB] px-2 py-1 text-[10px] font-semibold text-[#555A54]">
                          Size: {item.selectedSize}
                        </span>

                        <span className="rounded-md bg-[#F4EFEB] px-2 py-1 text-[10px] font-semibold text-[#555A54]">
                          {item.selectedColor}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          moveToWishlist(
                            item.product.id,
                            item.selectedColor,
                            item.selectedSize
                          )
                        }
                        className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-[#637666] hover:underline"
                      >
                        <Heart size={13} />
                        Move to Wishlist
                      </button>
                    </div>
                  </div>

                  {/* Quantity & Line Total */}
                  <div className="mt-4 flex items-center justify-between border-t border-[#F0ECE6] pt-3">
                    <div className="inline-flex items-center overflow-hidden rounded-xl border border-[#E8E1D7] bg-[#FAF8F5]">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.selectedColor,
                            item.selectedSize,
                            -1
                          )
                        }
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                        className="flex h-9 w-9 items-center justify-center hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Minus size={14} />
                      </button>

                      <span className="w-9 text-center font-numeral text-xs font-bold text-[#1F2022]">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.selectedColor,
                            item.selectedSize,
                            1
                          )
                        }
                        aria-label="Increase quantity"
                        className="flex h-9 w-9 items-center justify-center hover:bg-white"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] text-[#77736E]">
                        Item total
                      </p>
                      <p className="font-numeral text-base font-bold text-[#1F2022]">
                        {formatINR(
                          item.product.price * item.quantity
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Checkout Summary */}
        {cart.length > 0 && (
          <div className="shrink-0 border-t border-[#E8E1D7] bg-white px-5 py-5 shadow-[0_-8px_25px_rgba(0,0,0,0.03)] sm:px-7">
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-[#77736E]">
                <span>Selected Subtotal</span>
                <span className="font-numeral font-semibold text-[#1F2022]">
                  {formatINR(selectedSubtotal)}
                </span>
              </div>

              <div className="flex justify-between text-[#77736E]">
                <span>Shipping</span>
                <span className="font-numeral font-semibold text-[#637666]">
                  {selectedCount === 0
                    ? '—'
                    : shippingCost === 0
                      ? 'FREE'
                      : formatINR(shippingCost)}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-[#EEE7DE] pt-3">
                <span className="font-semibold text-[#1F2022]">
                  Estimated Total
                </span>

                <span className="font-numeral text-xl font-bold text-[#1F2022]">
                  {formatINR(selectedTotal)}
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={selectedCount === 0}
              onClick={() => setCheckoutMessage(true)}
              className="mt-5 flex h-13 min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#1F2022] px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#34373C] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Checkout Selected ({selectedCount})
              <ArrowRight size={17} />
            </button>

            {checkoutMessage && (
              <div
                role="status"
                className="mt-3 rounded-xl border border-[#E8E1D7] bg-[#FAF8F5] p-3 text-xs leading-5 text-[#5E6064]"
              >
                <strong className="text-[#1F2022]">
                  Demo Checkout
                </strong>
                <p className="mt-1">
                  {selectedCount} selected item(s) —{' '}
                  {formatINR(selectedTotal)}.
                  Payment integration is not connected yet.
                  No order has been placed.
                </p>
              </div>
            )}

            <div className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-[#77736E]">
              <ShieldCheck
                size={14}
                className="shrink-0 text-[#637666]"
              />
              <span>Review your items before checkout</span>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
