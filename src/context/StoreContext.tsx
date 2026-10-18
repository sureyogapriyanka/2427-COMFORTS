import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, PRODUCTS } from '../data/catalog';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

export type OverlayType = 'cart' | 'search' | 'menu' | 'quickview' | 'auth' | null;

interface StoreContextType {
  cart: CartItem[];
  wishlist: string[];
  overlay: OverlayType;
  quickViewProduct: Product | null;
  searchQuery: string;
  notification: { message: string; type: 'success' | 'info' } | null;

  // Actions
  openOverlay: (type: OverlayType, product?: Product) => void;
  closeOverlay: () => void;
  addToCart: (product: Product, selectedColor?: string, selectedSize?: string, quantity?: number) => void;
  removeFromCart: (productId: string, selectedColor: string, selectedSize: string) => void;
  moveToWishlist: (
    productId: string,
    selectedColor: string,
    selectedSize: string
  ) => void;
  updateQuantity: (productId: string, selectedColor: string, selectedSize: string, delta: number) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  setSearchQuery: (query: string) => void;
  clearNotification: () => void;

  // Computed
  cartCount: number;
  cartSubtotal: number;
  wishlistCount: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Default sample item in bag for realistic first impression
    const firstProduct = PRODUCTS[0];
    return [
      {
        product: firstProduct,
        quantity: 1,
        selectedColor: firstProduct.colors[0].name,
        selectedSize: 'M',
      },
    ];
  });


  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('2427-wishlist');
      if (!saved) return [];

      const parsed: unknown = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];

      const validIds = new Set(PRODUCTS.map((product) => product.id));

      return [...new Set(
        parsed.filter(
          (id): id is string =>
            typeof id === 'string' && validIds.has(id)
        )
      )];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    localStorage.setItem('2427-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);
  const [overlay, setOverlay] = useState<OverlayType>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Close overlays on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeOverlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openOverlay = (type: OverlayType, product?: Product) => {
    if (product) setQuickViewProduct(product);
    setOverlay(type);
    document.body.style.overflow = type ? 'hidden' : 'unset';
  };

  const closeOverlay = () => {
    setOverlay(null);
    document.body.style.overflow = 'unset';
  };

  const addToCart = (
    product: Product,
    selectedColor = product.colors[0]?.name || 'Standard',
    selectedSize = product.sizes[1] || product.sizes[0] || 'M',
    quantity = 1
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [...prev, { product, quantity, selectedColor, selectedSize }];
    });

    setNotification({
      message: `Added ${product.name} (${selectedSize} / ${selectedColor}) to your bag`,
      type: 'success',
    });

    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const removeFromCart = (productId: string, selectedColor: string, selectedSize: string) => {
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
      prev.includes(productId) ? prev : [...prev, productId]
    );

    removeFromCart(productId, selectedColor, selectedSize);

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
    setCart((prev) => {
      return prev
        .map((item) => {
          if (
            item.product.id === productId &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
          ) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const updated = exists ? prev.filter((id) => id !== productId) : [...prev, productId];

      const product = PRODUCTS.find((p) => p.id === productId);
      const name = product ? product.name : 'Item';

      setNotification({
        message: exists ? `Removed ${name} from your wishlist` : `Saved ${name} to your wishlist`,
        type: 'info',
      });

      setTimeout(() => setNotification(null), 3000);
      return updated;
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const clearNotification = () => setNotification(null);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const wishlistCount = wishlist.filter((id) =>
    PRODUCTS.some((product) => product.id === id)
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
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
