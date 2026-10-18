import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronRight, Heart, User, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Logo } from '../brand/Logo';
import { MEN_CATEGORIES, WOMEN_CATEGORIES } from '../../data/catalog';

export function MobileNav() {
  const { overlay, closeOverlay, openOverlay, wishlistCount, cartCount } = useStore();
  const [activeGender, setActiveGender] = useState<'men' | 'women'>('men');

  if (overlay !== 'menu') return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 lg:hidden">
      <div className="absolute inset-0" onClick={closeOverlay} />

      <aside className="absolute inset-y-0 left-0 flex max-w-full pr-10">
        <div className="flex w-screen max-w-sm flex-col bg-[#FAF8F5] shadow-2xl animate-in slide-in-from-left duration-300">
          {/* Top Bar with Brand Logo and Close Button */}
          <div className="flex items-center justify-between border-b border-[#E8E1D7] px-6 py-4 bg-white">
            <Logo size="sm" onClick={closeOverlay} />
            <button
              type="button"
              onClick={closeOverlay}
              className="rounded-full p-2 text-[#1F2022] hover:bg-[#FAF8F5] transition-colors"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Gender Switcher Tabs */}
          <div className="grid grid-cols-2 border-b border-[#E8E1D7] bg-[#F4EFEB] p-1.5 m-4 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveGender('men')}
              className={`rounded-lg py-2 text-sm font-semibold transition-all ${
                activeGender === 'men'
                  ? 'bg-white text-[#1F2022] shadow-xs'
                  : 'text-[#6B6F76] hover:text-[#1F2022]'
              }`}
            >
              Shop Men
            </button>
            <button
              type="button"
              onClick={() => setActiveGender('women')}
              className={`rounded-lg py-2 text-sm font-semibold transition-all ${
                activeGender === 'women'
                  ? 'bg-white text-[#1F2022] shadow-xs'
                  : 'text-[#6B6F76] hover:text-[#1F2022]'
              }`}
            >
              Shop Women
            </button>
          </div>

          {/* Category List */}
          <div className="flex-1 overflow-y-auto px-6 py-2 space-y-1">
            <span className="eyebrow block mb-3 text-[#637666]">
              {activeGender === 'men' ? "Men's Collections" : "Women's Collections"}
            </span>

            {(activeGender === 'men' ? MEN_CATEGORIES : WOMEN_CATEGORIES).map((cat) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                onClick={closeOverlay}
                className="flex items-center justify-between rounded-xl p-3 hover:bg-white transition-colors"
              >
                <div>
                  <h4 className="font-display text-lg font-medium text-[#1F2022]">
                    {cat.title}
                  </h4>
                  <p className="text-xs text-[#5E6064]">{cat.tagline}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-[#637666]" />
              </Link>
            ))}

            <div className="my-4 border-t border-[#E8E1D7] pt-4 space-y-1">
              <span className="eyebrow block mb-3 text-[#637666]">Featured Curation</span>
              <Link
                to="/category/new-arrivals"
                onClick={closeOverlay}
                className="flex items-center justify-between p-3 font-medium text-sm text-[#1F2022] rounded-xl hover:bg-white"
              >
                <span>New Arrivals</span>
                <span className="rounded-full bg-[#637666] text-white px-2 py-0.5 text-[10px]">New</span>
              </Link>
              <Link
                to="/category/bestsellers"
                onClick={closeOverlay}
                className="flex items-center justify-between p-3 font-medium text-sm text-[#1F2022] rounded-xl hover:bg-white"
              >
                <span>Bestsellers</span>
                <ChevronRight className="h-4 w-4 text-[#637666]" />
              </Link>
              <Link
                to="/category/bundles"
                onClick={closeOverlay}
                className="flex items-center justify-between p-3 font-medium text-sm text-[#1F2022] rounded-xl hover:bg-white"
              >
                <span>Multipacks &amp; Bundles</span>
                <span className="text-xs font-semibold text-[#A85A3C]">Save 20%</span>
              </Link>
              <Link
                to="/category/offers"
                onClick={closeOverlay}
                className="flex items-center justify-between p-3 font-medium text-sm text-[#A85A3C] rounded-xl hover:bg-white"
              >
                <span>Special Offers</span>
                <ChevronRight className="h-4 w-4 text-[#A85A3C]" />
              </Link>
            </div>

            <div className="border-t border-[#E8E1D7] pt-4 space-y-1">
              <Link
                to="/about"
                onClick={closeOverlay}
                className="block p-3 text-sm text-[#5E6064] hover:text-[#1F2022]"
              >
                About 2427 Atelier
              </Link>
              <Link
                to="/contact"
                onClick={closeOverlay}
                className="block p-3 text-sm text-[#5E6064] hover:text-[#1F2022]"
              >
                Customer Support &amp; Size Guide
              </Link>
            </div>
          </div>

          {/* Bottom Utility Bar */}
          <div className="border-t border-[#E8E1D7] bg-white p-4">
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <button
                type="button"
                onClick={() => {
                  closeOverlay();
                  openOverlay('auth');
                }}
                className="flex flex-col items-center gap-1 rounded-lg p-2 text-[#1F2022] hover:bg-[#FAF8F5]"
              >
                <User className="h-4 w-4" />
                <span>Account</span>
              </button>

              <Link
                to="/wishlist"
                onClick={closeOverlay}
                className="flex flex-col items-center gap-1 rounded-lg p-2 text-[#1F2022] hover:bg-[#FAF8F5]"
              >
                <Heart className="h-4 w-4" />
                <span>Saved ({wishlistCount})</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  closeOverlay();
                  openOverlay('cart');
                }}
                className="flex flex-col items-center gap-1 rounded-lg p-2 text-[#1F2022] hover:bg-[#FAF8F5]"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Bag ({cartCount})</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
