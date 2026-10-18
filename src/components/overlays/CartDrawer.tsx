import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../data/catalog';
import { Button } from '../ui/Button';

export function CartDrawer() {

  const {
    overlay,
    closeOverlay,
    cart,
    cartCount,
    cartSubtotal,
    updateQuantity,
    removeFromCart,
    moveToWishlist,
  } = useStore();

  const [excludedItems, setExcludedItems] = useState<string[]>([]);

  const getItemKey = (
    productId: string,
    color: string,
    size: string
  ) => JSON.stringify([productId, color, size]);

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
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const shippingCost =
    selectedSubtotal === 0 || selectedSubtotal >= 999 ? 0 : 99;

  const selectedTotal = selectedSubtotal + shippingCost;

  const toggleSelection = (key: string) => {
    setExcludedItems((prev) =>
      prev.includes(key)
        ? prev.filter((id) => id !== key)
        : [...prev, key]
    );
  };

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



  if (overlay !== 'cart') return null;

  const freeShippingThreshold = 999;
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const diff = freeShippingThreshold - cartSubtotal;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={closeOverlay} />

      <aside className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="flex w-screen max-w-md flex-col bg-[#FAF8F5] shadow-2xl border-l border-[#E8E1D7] animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E8E1D7] px-6 py-5 bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-[#637666]" />
              <h2 className="font-display text-2xl font-medium text-[#1F2022]">
                Your Shopping Bag ({cartCount})
              </h2>
            </div>
            <button
              type="button"
              onClick={closeOverlay}
              className="rounded-full p-1.5 text-[#1F2022]/60 hover:bg-[#FAF8F5] hover:text-[#1F2022] transition-colors"
              aria-label="Close bag"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="border-b border-[#E8E1D7] bg-[#F4EFEB] px-6 py-3">
            <div className="flex justify-between text-xs font-medium text-[#1F2022] mb-1.5">
              <span>
                {diff > 0 ? (
                  <>Add <strong className="text-[#637666]">{formatINR(diff)}</strong> more for Free Shipping</>
                ) : (
                  <span className="text-[#637666] font-semibold">🎉 You unlocked Complimentary Express Delivery!</span>
                )}
              </span>
              <span className="font-numeral text-[#6B6F76]">{Math.round(progressPercent)}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E8E1D7]">
              <div
                className="h-full bg-[#637666] transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {cart.length > 0 && (
            <div className="flex items-center justify-between border-b border-[#E8E1D7] bg-white px-6 py-3">
              <label className="flex items-center gap-2 text-sm font-medium text-[#1F2022] cursor-pointer">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 accent-[#637666]"
                />
                Select All
              </label>
              <span className="text-xs text-[#637666]">
                {selectedCount} selected
              </span>
            </div>
          )}


          {/* Items List */}

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F4EFEB] text-[#6B6F76] mb-4">
                  <ShoppingBag className="h-8 w-8 text-[#637666]" />
                </div>
                <h3 className="font-display text-2xl font-medium text-[#1F2022]">
                  Your bag is empty
                </h3>
                <p className="mt-2 text-sm text-[#5E6064] max-w-xs">
                  Upgrade your daily comfort with our architectural MicroModal and Supima essentials.
                </p>
                <Button
                  variant="primary"
                  className="mt-6"
                  onClick={() => {
                    closeOverlay();
                  }}
                  href="/category/bundles"
                >
                  Explore Multipack Bundles
                </Button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                  className="flex gap-4 rounded-xl border border-[#E8E1D7] bg-white p-3 shadow-2xs"
                >
                  <input
                    type="checkbox"
                    checked={
                      !excludedItems.includes(
                        getItemKey(
                          item.product.id,
                          item.selectedColor,
                          item.selectedSize
                        )
                      )
                    }
                    onChange={() =>
                      toggleSelection(
                        getItemKey(
                          item.product.id,
                          item.selectedColor,
                          item.selectedSize
                        )
                      )
                    }
                    aria-label={`Select ${item.product.name} for checkout`}
                    className="h-4 w-4 shrink-0 self-center accent-[#637666] cursor-pointer"
                  />

                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-24 w-20 rounded-lg object-cover bg-[#F4EFEB] shrink-0"
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-display text-base font-medium text-[#1F2022] line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(item.product.id, item.selectedColor, item.selectedSize)
                          }
                          className="text-[#6B6F76] hover:text-[#A85A3C] transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
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
                        className="mt-1 text-xs font-medium text-[#637666] hover:underline"
                      >
                        ♡ Move to Wishlist
                      </button>

                      <div className="mt-1 flex items-center gap-2 text-xs text-[#5E6064]">
                        <span className="rounded bg-[#F4EFEB] px-1.5 py-0.5 font-numeral">
                          {item.selectedSize}
                        </span>
                        <span>•</span>
                        <span>{item.selectedColor}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center rounded-lg border border-[#E8E1D7] bg-[#FAF8F5]">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.product.id, item.selectedColor, item.selectedSize, -1)
                          }
                          className="px-2 py-1 text-[#1F2022] hover:bg-white rounded-l-lg transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2.5 font-numeral text-xs font-semibold text-[#1F2022]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.product.id, item.selectedColor, item.selectedSize, 1)
                          }
                          className="px-2 py-1 text-[#1F2022] hover:bg-white rounded-r-lg transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <span className="font-numeral text-sm font-bold text-[#1F2022]">
                        {formatINR(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout Footer */}
          {cart.length > 0 && (
            <div className="border-t border-[#E8E1D7] bg-white p-6 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-[#5E6064]">
                  <span>Subtotal</span>
                  <span className="font-numeral font-semibold text-[#1F2022]">
                    {formatINR(cartSubtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-[#5E6064]">
                  <span>Shipping</span>
                  <span className="font-numeral text-[#637666] font-medium">
                    {cartSubtotal >= freeShippingThreshold ? 'FREE' : formatINR(99)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#1F2022] pt-2 border-t border-[#E8E1D7]">
                  <span>Total Due</span>
                  <span className="font-numeral text-lg">
                    {formatINR(cartSubtotal >= freeShippingThreshold ? cartSubtotal : cartSubtotal + 99)}
                  </span>
                </div>
              </div>


              {/* Checkout CTA */}
              <button
                type="button"
                disabled={selectedCount === 0}
                onClick={() => {
                  if (selectedItems.length === 0) return;

                  alert(
                    `${selectedCount} item(s) selected.\n` +
                    `Total: ${formatINR(selectedTotal)}\n\n` +
                    `Payment integration is not yet connected.`
                  );
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1F2022] py-3.5 text-sm font-semibold text-[#FAF8F5] transition-all hover:bg-[#34373C] active:scale-[0.98] shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Checkout Selected ({selectedCount})</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#6B6F76]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#637666]" />
                <span>30-Day First Pair Comfort Guarantee &bull; SSL Secured</span>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
