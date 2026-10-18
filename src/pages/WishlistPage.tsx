import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { useStore } from '../context/StoreContext';
import { PRODUCTS, formatINR } from '../data/catalog';
import { Button } from '../components/ui/Button';

export function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useStore();

  const savedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="py-12 sm:py-20 bg-[#FAF8F5] min-h-screen">
      <Container>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <span className="eyebrow text-[#637666]">Saved Curation</span>
            <h1 className="font-display text-4xl sm:text-5xl font-medium text-[#1F2022] mt-1">
              Your Wishlist ({wishlist.length})
            </h1>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#637666] hover:text-[#1F2022]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Continue Browsing</span>
          </Link>
        </div>

        {savedProducts.length === 0 ? (
          <div className="rounded-3xl border border-[#E8E1D7] bg-white p-12 text-center max-w-lg mx-auto shadow-xs">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F4EFEB] text-[#637666] mx-auto mb-4">
              <Heart className="h-8 w-8" />
            </div>
            <h2 className="font-display text-2xl font-medium text-[#1F2022]">
              Your wishlist is currently empty
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#5E6064] leading-relaxed">
              Save pieces you love while exploring our Men's and Women's collections to revisit or add directly to your bag later.
            </p>
            <Button href="/" variant="primary" className="mt-6">
              Explore 2427 Collections
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {savedProducts.map((product) => (
              <div
                key={product.id}
                className="group relative flex flex-col rounded-2xl bg-white p-3 border border-[#E8E1D7] shadow-xs"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#F4EFEB]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#A85A3C] shadow-xs hover:scale-110 transition-transform"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 flex flex-1 flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[#637666]">
                      {product.fabricBadge}
                    </span>
                    <h3 className="font-display text-base font-medium text-[#1F2022]">
                      {product.name}
                    </h3>
                    <div className="mt-1 font-numeral font-bold text-sm text-[#1F2022]">
                      {formatINR(product.price)}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => addToCart(product)}
                    className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-lg bg-[#1F2022] py-2 text-xs font-semibold text-white hover:bg-[#34373C] transition-colors"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>Move to Bag</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
