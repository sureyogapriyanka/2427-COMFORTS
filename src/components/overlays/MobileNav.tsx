
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
    useState<'men' | 'women'>('men');

  const isOpen = overlay === 'menu';

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

  const categories = catalogCategories.filter((category) =>
    category.gender === activeGender
  );

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
        className="absolute inset-y-0 left-0 flex w-[min(90vw,400px)] flex-col overflow-hidden bg-[#FAF8F5] shadow-2xl"
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
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4EFEB] text-[#1F2022] transition-colors hover:bg-[#E8E1D7]"
            >
              <X size={19} />
            </button>
          </div>

          <p className="mt-3 text-[11px] font-medium tracking-wide text-[#77736E]">
            Everyday essentials. Elevated comfort.
          </p>
        </div>

        {/* Search */}
        <div className="shrink-0 bg-white px-5 pb-4 pt-4">
          <button
            type="button"
            onClick={() => switchOverlay('search')}
            className="flex min-h-12 w-full items-center gap-3 rounded-xl border border-[#E8E1D7] bg-[#FAF8F5] px-4 text-left text-sm text-[#77736E] transition-colors hover:border-[#637666]"
          >
            <Search
              size={18}
              className="text-[#637666]"
            />
            Search products...
            <ArrowRight
              size={16}
              className="ml-auto text-[#637666]"
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
                  ? 'bg-[#1F2022] text-white shadow-sm'
                  : 'text-[#77736E] hover:text-[#1F2022]'
                }`}
            >
              Shop Men
            </button>

            <button
              type="button"
              onClick={() => setActiveGender('women')}
              aria-pressed={activeGender === 'women'}
              className={`min-h-11 rounded-lg px-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeGender === 'women'
                  ? 'bg-[#1F2022] text-white shadow-sm'
                  : 'text-[#77736E] hover:text-[#1F2022]'
                }`}
            >
              Shop Women
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <nav className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          {/* Categories */}
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#637666]">
              {activeGender === 'men'
                ? "Men's Collections"
                : "Women's Collections"}
            </h2>

            <span className="text-[10px] text-[#99938B]">
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
                  <h3 className="font-display text-sm font-semibold text-[#1F2022]">
                    {category.title}
                  </h3>

                  {category.tagline && (
                    <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-[#77736E]">
                      {category.tagline}
                    </p>
                  )}
                </div>

                <ChevronRight
                  size={17}
                  className="shrink-0 text-[#637666] transition-transform group-hover:translate-x-1"
                />
              </Link>
            ))}

            {collectionLinks.map((collection) => (
              <Link
                key={collection.slug}
                to={`/category/${collection.slug}?gender=${activeGender}`}
                onClick={closeOverlay}
                className="group flex items-center justify-between gap-3 rounded-xl border border-[#E8E1D7] bg-white px-4 py-3.5 transition-colors hover:border-[#637666] hover:bg-[#F2F4EF]"
              >
                <h3 className="font-display text-sm font-semibold text-[#1F2022]">
                  {collection.title}
                </h3>
                <ChevronRight
                  size={17}
                  className="shrink-0 text-[#637666] transition-transform group-hover:translate-x-1"
                />
              </Link>
            ))}
          </div>

          {/* Information */}
          <div className="mt-7 border-t border-[#E8E1D7] pt-5">
            <Link
              to="/about"
              onClick={closeOverlay}
              className="block rounded-lg px-3 py-3 text-xs font-medium text-[#77736E] hover:bg-white hover:text-[#1F2022]"
            >
              About 2427 ÉLAN
            </Link>

            <Link
              to="/contact"
              onClick={closeOverlay}
              className="block rounded-lg px-3 py-3 text-xs font-medium text-[#77736E] hover:bg-white hover:text-[#1F2022]"
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
              className="flex min-h-14 flex-col items-center justify-center gap-1.5 rounded-xl bg-[#FAF8F5] px-2 text-[#1F2022] hover:bg-[#F2F4EF]"
            >
              <UserRound size={19} />
              <span className="text-[11px] font-semibold">
                Account
              </span>
            </Link>

            <Link
              to="/wishlist"
              onClick={closeOverlay}
              className="flex min-h-14 flex-col items-center justify-center gap-1.5 rounded-xl bg-[#FAF8F5] px-2 text-[#1F2022] hover:bg-[#F2F4EF]"
            >
              <Heart size={19} />
              <span className="text-[11px] font-semibold">
                Saved ({wishlistCount})
              </span>
            </Link>

            <button
              type="button"
              onClick={() => switchOverlay('cart')}
              className="flex min-h-14 flex-col items-center justify-center gap-1.5 rounded-xl bg-[#FAF8F5] px-2 text-[#1F2022] hover:bg-[#F2F4EF]"
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
