
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

import { Product, PRODUCTS } from '../data/catalog';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

export type OverlayType =
  | 'cart'
  | 'search'
  | 'menu'
  | 'quickview'
  | 'auth'
  | null;

interface StoreContextType {
  cart: CartItem[];
  wishlist: string[];
  overlay: OverlayType;
  quickViewProduct: Product | null;
  searchQuery: string;
  notification: {
    message: string;
    type: 'success' | 'info';
  } | null;

  openOverlay: (
    type: OverlayType,
    product?: Product
  ) => void;

  closeOverlay: () => void;

  addToCart: (
    product: Product,
    selectedColor?: string,
    selectedSize?: string,
    quantity?: number
  ) => void;

  removeFromCart: (
    productId: string,
    selectedColor: string,
    selectedSize: string
  ) => void;

  moveToWishlist: (
    productId: string,
    selectedColor: string,
    selectedSize: string
  ) => void;

  updateQuantity: (
    productId: string,
    selectedColor: string,
    selectedSize: string,
    delta: number
  ) => void;

  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  setSearchQuery: (query: string) => void;
  clearNotification: () => void;

  cartCount: number;
  cartSubtotal: number;
  wishlistCount: number;
}

const StoreContext = createContext<
  StoreContextType | undefined
>(undefined);

const CART_STORAGE_KEY = '2427-cart';
const WISHLIST_STORAGE_KEY = '2427-wishlist';

function loadSavedCart(): CartItem[] {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);

    if (!saved) {
      return [];
    }

    const parsed: unknown = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return [];
    }

    const restored: CartItem[] = [];

    for (const entry of parsed) {
      if (!entry || typeof entry !== 'object') {
        continue;
      }

      const item = entry as Record<string, unknown>;

      if (typeof item.productId !== 'string') {
        continue;
      }

      const product = PRODUCTS.find(
        (p) => p.id === item.productId
      );

      if (!product) {
        continue;
      }

      if (
        typeof item.quantity !== 'number' ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0
      ) {
        continue;
      }

      if (
        typeof item.selectedColor !== 'string' ||
        typeof item.selectedSize !== 'string'
      ) {
        continue;
      }

      const selectedColor = item.selectedColor;
      const selectedSize = item.selectedSize;

      if (
        !product.colors.some(
          (color) => color.name === selectedColor
        ) ||
        !product.sizes.includes(selectedSize)
      ) {
        continue;
      }

      const existing = restored.find(
        (cartItem) =>
          cartItem.product.id === product.id &&
          cartItem.selectedColor === selectedColor &&
          cartItem.selectedSize === selectedSize
      );

      if (existing) {
        existing.quantity += item.quantity;
      } else {
        restored.push({
          product,
          quantity: item.quantity,
          selectedColor,
          selectedSize,
        });
      }
    }

    return restored;
  } catch {
    return [];
  }
}

function loadSavedWishlist(): string[] {
  try {
    const saved = localStorage.getItem(
      WISHLIST_STORAGE_KEY
    );

    if (!saved) {
      return [];
    }

    const parsed: unknown = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return [];
    }

    const validIds = new Set(
      PRODUCTS.map((product) => product.id)
    );

    return [
      ...new Set(
        parsed.filter(
          (id): id is string =>
            typeof id === 'string' &&
            validIds.has(id)
        )
      ),
    ];
  } catch {
    return [];
  }
}

export function StoreProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Empty for new customers; restore only genuine saved items.
  const [cart, setCart] = useState<CartItem[]>(
    loadSavedCart
  );

  const [wishlist, setWishlist] = useState<string[]>(
    loadSavedWishlist
  );

  const [overlay, setOverlay] =
    useState<OverlayType>(null);

  const [quickViewProduct, setQuickViewProduct] =
    useState<Product | null>(null);

  const [searchQuery, setSearchQuery] = useState('');

  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'info';
  } | null>(null);

  // Save cart whenever it changes.
  useEffect(() => {
    try {
      const savedCart = cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
      }));

      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(savedCart)
      );
    } catch {
      // Keep the cart usable if storage is unavailable.
    }
  }, [cart]);

  // Save wishlist whenever it changes.
  useEffect(() => {
    try {
      localStorage.setItem(
        WISHLIST_STORAGE_KEY,
        JSON.stringify(wishlist)
      );
    } catch {
      // Keep wishlist usable if storage is unavailable.
    }
  }, [wishlist]);

  // Close overlays using Escape.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOverlay(null);
        document.body.style.overflow = 'unset';
      }
    };

    window.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown
      );
      document.body.style.overflow = 'unset';
    };
  }, []);

  const openOverlay = (
    type: OverlayType,
    product?: Product
  ) => {
    if (product) {
      setQuickViewProduct(product);
    }

    setOverlay(type);

    document.body.style.overflow = type
      ? 'hidden'
      : 'unset';
  };

  const closeOverlay = () => {
    setOverlay(null);
    document.body.style.overflow = 'unset';
  };

  const addToCart = (
    product: Product,
    selectedColor =
      product.colors[0]?.name || 'Standard',
    selectedSize =
      product.sizes[1] ||
      product.sizes[0] ||
      'M',
    quantity = 1
  ) => {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return;
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
      );

      if (existingIndex !== -1) {
        return prev.map((item, index) =>
          index === existingIndex
            ? {
              ...item,
              quantity: item.quantity + quantity,
            }
            : item
        );
      }

      return [
        ...prev,
        {
          product,
          quantity,
          selectedColor,
          selectedSize,
        },
      ];
    });

    setNotification({
      message: `Added ${product.name} (${selectedSize} / ${selectedColor}) to your bag`,
      type: 'success',
    });
  };

  const removeFromCart = (
    productId: string,
    selectedColor: string,
    selectedSize: string
  ) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
          )
      )
    );
  };

  const moveToWishlist = (
    productId: string,
    selectedColor: string,
    selectedSize: string
  ) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev
        : [...prev, productId]
    );

    removeFromCart(
      productId,
      selectedColor,
      selectedSize
    );

    setNotification({
      message: 'Product moved to your wishlist',
      type: 'success',
    });
  };

  const updateQuantity = (
    productId: string,
    selectedColor: string,
    selectedSize: string,
    delta: number
  ) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (
            item.product.id === productId &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
          ) {
            return {
              ...item,
              quantity: item.quantity + delta,
            };
          }

          return item;
        })
        .filter(
          (item) => item.quantity > 0
        )
    );
  };

  const toggleWishlist = (productId: string) => {
    const product = PRODUCTS.find(
      (p) => p.id === productId
    );

    const exists = wishlist.includes(productId);

    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );

    setNotification({
      message: exists
        ? `Removed ${product?.name || 'Item'} from your wishlist`
        : `Saved ${product?.name || 'Item'} to your wishlist`,
      type: 'info',
    });
  };

  const isInWishlist = (productId: string) =>
    wishlist.includes(productId);

  const clearNotification = () => {
    setNotification(null);
  };

  // Automatically dismiss notifications.
  useEffect(() => {
    if (!notification) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setNotification(null);
    }, 3500);

    return () => window.clearTimeout(timeout);
  }, [notification]);

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const cartSubtotal = cart.reduce(
    (sum, item) =>
      sum + item.product.price * item.quantity,
    0
  );

  const wishlistCount = wishlist.filter((id) =>
    PRODUCTS.some(
      (product) => product.id === id
    )
  ).length;

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        overlay,
        quickViewProduct,
        searchQuery,
        notification,
        openOverlay,
        closeOverlay,
        addToCart,
        removeFromCart,
        moveToWishlist,
        updateQuantity,
        toggleWishlist,
        isInWishlist,
        setSearchQuery,
        clearNotification,
        cartCount,
        cartSubtotal,
        wishlistCount,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error(
      'useStore must be used within a StoreProvider'
    );
  }

  return context;
}
