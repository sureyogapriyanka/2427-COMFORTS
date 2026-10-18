"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { PRODUCTS, type Product } from "@/data/catalog";

type Overlay = "search" | "cart" | "menu" | null;

type StoreContextValue = {
  overlay: Overlay;
  openOverlay: (overlay: Overlay) => void;
  closeOverlay: () => void;
  cart: Record<string, number>;
  wishlist: string[];
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  cartCount: number;
  wishlistCount: number;
  cartItems: { product: Product; quantity: number }[];
  cartTotal: number;
};

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [wishlist, setWishlist] = useState<string[]>([]);

  const openOverlay = useCallback((next: Overlay) => setOverlay(next), []);
  const closeOverlay = useCallback(() => setOverlay(null), []);

  const addToCart = useCallback((productId: string) => {
    setCart((prev) => ({ ...prev, [productId]: (prev[productId] ?? 0) + 1 }));
    setOverlay("cart");
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => {
      const next = { ...prev };
      if (!next[productId]) return prev;
      if (next[productId] <= 1) delete next[productId];
      else next[productId] -= 1;
      return next;
    });
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  }, []);

  const cartItems = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, quantity]) => {
          const product = PRODUCTS.find((p) => p.id === id);
          return product ? { product, quantity } : null;
        })
        .filter((item): item is { product: Product; quantity: number } => Boolean(item)),
    [cart],
  );

  const cartCount = useMemo(
    () => Object.values(cart).reduce((sum, n) => sum + n, 0),
    [cart],
  );

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cartItems],
  );

  const value = useMemo(
    () => ({
      overlay,
      openOverlay,
      closeOverlay,
      cart,
      wishlist,
      addToCart,
      removeFromCart,
      toggleWishlist,
      cartCount,
      wishlistCount: wishlist.length,
      cartItems,
      cartTotal,
    }),
    [
      overlay,
      openOverlay,
      closeOverlay,
      cart,
      wishlist,
      addToCart,
      removeFromCart,
      toggleWishlist,
      cartCount,
      cartItems,
      cartTotal,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
