
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  X,
  ChevronRight,
  Heart,
  UserRound,
  ShoppingBag,
  Search,
  ArrowRight,
} from 'lucide-react';

import { useStore } from '../../context/StoreContext';
import { Logo } from '../brand/Logo';
import { useCatalog } from '../../context/CatalogContext';

const collectionLinks = [
  { slug: 'new-arrivals', title: 'New Arrivals' },
  { slug: 'bestsellers', title: 'Bestsellers' },
  { slug: 'bundles', title: 'Value Bundles' },
  { slug: 'offers', title: 'Offers' },
  { slug: 'sale', title: 'Sale' },
] as const;

export function MobileNav() {
  const { categories: catalogCategories } = useCatalog();
  const {
    overlay,
    closeOverlay,
    openOverlay,
    wishlistCount,
    cartCount,
  } = useStore();

  const [activeGender, setActiveGender] =
    useState<'men' | 'women' | null>(null);

  const isOpen = overlay === 'menu';

  useEffect(() => {
    if (!isOpen) setActiveGender(null);
  }, [isOpen]);

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

  if (!isOpen) return null;

  const categories = activeGender
    ? catalogCategories.filter((category) => category.gender === activeGender)
    : [];

  const switchOverlay = (
    target: 'search' | 'cart'
  ) => {
    openOverlay(target);
  };

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      {/* Backdrop */}
      <button
        type="button"
        onClick={closeOverlay}
        aria-label="Close navigation"
        className="absolute inset-0 h-full w-full bg-black/65 backdrop-blur-sm"
      />

      {/* Mobile Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className="absolute inset-y-0 left-0 flex w-[min(90vw,400px)] flex-col overflow-hidden bg-elan-ivory shadow-2xl"
      >
        {/* Header */}
        <div className="shrink-0 border-b border-[#E8E1D7] bg-white px-5 py-5">
          <div className="flex items-center justify-between gap-3">
            <Logo
              size="sm"
              onClick={closeOverlay}
            />

            <button
              type="button"
              onClick={closeOverlay}
              aria-label="Close menu"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4EFEB] text-elan-ink transition-colors hover:bg-[#E8E1D7]"
            >
              <X size={19} />
            </button>
          </div>

          <p className="mt-3 text-[11px] font-medium tracking-wide text-elan-muted">
            Everyday essentials. Elevated comfort.
          </p>
        </div>

        {/* Search */}
        <div className="shrink-0 bg-white px-5 pb-4 pt-4">
          <button
            type="button"
            onClick={() => switchOverlay('search')}
            className="flex min-h-12 w-full items-center gap-3 rounded-xl border border-[#E8E1D7] bg-elan-ivory px-4 text-left text-sm text-elan-muted transition-colors hover:border-[#637666]"
          >
            <Search
              size={18}
              className="text-elan-sage"
            />
            Search products...
            <ArrowRight
              size={16}
              className="ml-auto text-elan-sage"
            />
          </button>
        </div>

        {/* Gender Tabs */}
        <div className="shrink-0 border-b border-[#E8E1D7] bg-white px-5 pb-4">
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#F2F0EC] p-1">
            <button
              type="button"
              onClick={() => setActiveGender('men')}
              aria-pressed={activeGender === 'men'}
              className={`min-h-11 rounded-lg px-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeGender === 'men'
                  ? 'bg-elan-ink text-elan-ivory shadow-sm'
                  : 'text-elan-muted hover:text-elan-ink'
                }`}
            >
              Shop Men
            </button>

            <button
              type="button"
              onClick={() => setActiveGender('women')}
              aria-pressed={activeGender === 'women'}
              className={`min-h-11 rounded-lg px-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeGender === 'women'
                  ? 'bg-elan-ink text-elan-ivory shadow-sm'
                  : 'text-elan-muted hover:text-elan-ink'
                }`}
            >
              Shop Women
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <nav className="min-h-0 flex-1 overflow-y-auto px-5 pb-8 pt-5">
          {activeGender && (
            <>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-elan-sage">
                  {activeGender === 'men'
                    ? "Men's Collections"
                    : "Women's Collections"}
                </h2>

                <span className="text-[10px] text-elan-muted">
                  {categories.length} Categories
                </span>
              </div>

              <div className="space-y-2">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    to={`/category/${category.slug}`}
                    onClick={closeOverlay}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-[#E8E1D7] bg-white px-4 py-3.5 transition-colors hover:border-[#637666] hover:bg-[#F2F4EF]"
                  >
                    <div className="min-w-0">
                      <h3 className="font-display text-sm font-semibold text-elan-ink">
                        {category.title}
                      </h3>

                      {category.tagline && (
                        <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-elan-muted">
                          {category.tagline}
                        </p>
                      )}
                    </div>

                    <ChevronRight
                      size={17}
                      className="shrink-0 text-elan-sage transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                ))}
              </div>

              <div className="mt-4 space-y-2 border-t border-[#E8E1D7] pt-4">
                {collectionLinks.map((collection) => (
                  <Link
                    key={collection.slug}
                    to={`/category/${collection.slug}?gender=${activeGender}`}
                    onClick={closeOverlay}
                    aria-label={`${collection.title} for ${activeGender}`}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-[#E8E1D7] bg-white px-4 py-3.5 transition-colors hover:border-[#637666] hover:bg-[#F2F4EF]"
                  >
                    <h3 className="font-display text-sm font-semibold text-elan-ink">
                      {collection.title}
                    </h3>
                    <ChevronRight
                      size={17}
                      className="shrink-0 text-elan-sage transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* Information */}
          <div className="mt-7 border-t border-[#E8E1D7] pt-5">
            <Link
              to="/about"
              onClick={closeOverlay}
              className="block rounded-lg px-3 py-3 text-xs font-medium text-elan-muted hover:bg-white hover:text-elan-ink"
            >
              About 2427 ÉLAN
            </Link>

            <Link
              to="/contact"
              onClick={closeOverlay}
              className="block rounded-lg px-3 py-3 text-xs font-medium text-elan-muted hover:bg-white hover:text-elan-ink"
            >
              Help & Customer Care
            </Link>
          </div>
        </nav>

        {/* Bottom Utility Bar */}
        <div className="shrink-0 border-t border-[#E8E1D7] bg-white px-4 py-4">
          <div className="grid grid-cols-3 gap-2">
            <Link
              to="/account"
              onClick={closeOverlay}
              className="flex min-h-14 flex-col items-center justify-center gap-1.5 rounded-xl bg-elan-ivory px-2 text-elan-ink hover:bg-[#F2F4EF]"
            >
              <UserRound size={19} />
              <span className="text-[11px] font-semibold">
                Account
              </span>
            </Link>

            <Link
              to="/wishlist"
              onClick={closeOverlay}
              className="flex min-h-14 flex-col items-center justify-center gap-1.5 rounded-xl bg-elan-ivory px-2 text-elan-ink hover:bg-[#F2F4EF]"
            >
              <Heart size={19} />
              <span className="text-[11px] font-semibold">
                Saved ({wishlistCount})
              </span>
            </Link>

            <button
              type="button"
              onClick={() => switchOverlay('cart')}
              className="flex min-h-14 flex-col items-center justify-center gap-1.5 rounded-xl bg-elan-ivory px-2 text-elan-ink hover:bg-[#F2F4EF]"
            >
              <ShoppingBag size={19} />
              <span className="text-[11px] font-semibold">
                Bag ({cartCount})
              </span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
