import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Logo } from '../brand/Logo';
import { MEN_CATEGORIES, WOMEN_CATEGORIES } from '../../data/catalog';

export function Header() {
  const { openOverlay, cartCount, wishlistCount } = useStore();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'men' | 'women' | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setActiveDropdown(null);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-[#FAF8F5]/95 backdrop-blur-md shadow-xs border-b border-[#E8E1D7]'
          : 'bg-[#FAF8F5] border-b border-[#E8E1D7]/60'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Mobile Menu Button & Search */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => openOverlay('menu')}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#1F2022] hover:bg-[#F3EFEA] transition-colors"
            aria-label="Open mobile navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => openOverlay('search')}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#1F2022] hover:bg-[#F3EFEA] transition-colors"
            aria-label="Search collection"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>

        {/* Center-Left: Prominent Brand Logo */}
        <div className="flex items-center">
          <Logo size="md" />
        </div>

        {/* Center: Desktop Navigation Bar with Rich Dropdown Menus */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <Link
            to="/"
            className={`px-3 py-2 text-sm font-medium transition-colors hover:text-[#637666] ${
              location.pathname === '/' ? 'text-[#637666] font-semibold' : 'text-[#1F2022]'
            }`}
          >
            Home
          </Link>

          {/* Men Mega Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('men')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              type="button"
              className={`inline-flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors hover:text-[#637666] ${
                activeDropdown === 'men' ? 'text-[#637666]' : 'text-[#1F2022]'
              }`}
            >
              <span>Men</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:rotate-180" />
            </button>

            {/* Men Dropdown Content */}
            {activeDropdown === 'men' && (
              <div className="absolute top-full left-0 w-[580px] -translate-x-12 pt-3 z-50">
                <div className="rounded-2xl border border-[#E8E1D7] bg-[#FAF8F5] p-6 shadow-xl grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div>
                    <span className="eyebrow block mb-3 text-[#637666]">
                      Men's Essentials
                    </span>
                    <ul className="space-y-3">
                      {MEN_CATEGORIES.map((cat) => (
                        <li key={cat.slug}>
                          <Link
                            to={`/category/${cat.slug}`}
                            className="group block p-2 rounded-xl transition-colors hover:bg-white"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm text-[#1F2022] group-hover:text-[#637666]">
                                {cat.title}
                              </span>
                              <span className="text-[10px] text-[#6B6F76]">
                                {cat.tagline}
                              </span>
                            </div>
                            <p className="text-xs text-[#5E6064] line-clamp-1 mt-0.5">
                              {cat.description}
                            </p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Dropdown Feature Banner */}
                  <div className="flex flex-col justify-between rounded-xl bg-[#1F2022] p-5 text-[#FAF8F5] relative overflow-hidden">
                    <div className="relative z-10">
                      <span className="text-[10px] uppercase font-semibold tracking-widest text-[#D9CBB7]">
                        Featured Innovation
                      </span>
                      <h4 className="font-display text-2xl font-medium mt-1">
                        AeroModal™ Trunks
                      </h4>
                      <p className="text-xs text-[#FAF8F5]/75 mt-2 leading-relaxed">
                        3X softer than combed cotton with anti-roll micro waistband.
                      </p>
                    </div>
                    <Link
                      to="/category/men-underwear"
                      className="relative z-10 inline-flex items-center gap-1.5 text-xs font-semibold text-[#D9CBB7] hover:text-white mt-4"
                    >
                      <span>Explore Collection</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <div className="absolute -bottom-6 -right-6 h-28 w-28 rounded-full bg-[#637666]/30 blur-xl pointer-events-none" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Women Mega Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('women')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              type="button"
              className={`inline-flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors hover:text-[#637666] ${
                activeDropdown === 'women' ? 'text-[#637666]' : 'text-[#1F2022]'
              }`}
            >
              <span>Women</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:rotate-180" />
            </button>

            {/* Women Dropdown Content */}
            {activeDropdown === 'women' && (
              <div className="absolute top-full left-0 w-[580px] -translate-x-24 pt-3 z-50">
                <div className="rounded-2xl border border-[#E8E1D7] bg-[#FAF8F5] p-6 shadow-xl grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div>
                    <span className="eyebrow block mb-3 text-[#637666]">
                      Women's Intimates
                    </span>
                    <ul className="space-y-3">
                      {WOMEN_CATEGORIES.map((cat) => (
                        <li key={cat.slug}>
                          <Link
                            to={`/category/${cat.slug}`}
                            className="group block p-2 rounded-xl transition-colors hover:bg-white"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm text-[#1F2022] group-hover:text-[#637666]">
                                {cat.title}
                              </span>
                              <span className="text-[10px] text-[#6B6F76]">
                                {cat.tagline}
                              </span>
                            </div>
                            <p className="text-xs text-[#5E6064] line-clamp-1 mt-0.5">
                              {cat.description}
                            </p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Dropdown Feature Banner */}
                  <div className="flex flex-col justify-between rounded-xl bg-[#586A59] p-5 text-[#FAF8F5] relative overflow-hidden">
                    <div className="relative z-10">
                      <span className="text-[10px] uppercase font-semibold tracking-widest text-[#E8E1D7]">
                        Signature Drop
                      </span>
                      <h4 className="font-display text-2xl font-medium mt-1">
                        CloudTouch™ Wire-Free
                      </h4>
                      <p className="text-xs text-[#FAF8F5]/85 mt-2 leading-relaxed">
                        Featherweight contour support engineered for 24-hour ease.
                      </p>
                    </div>
                    <Link
                      to="/category/women-bras"
                      className="relative z-10 inline-flex items-center gap-1.5 text-xs font-semibold text-[#FAF8F5] underline underline-offset-4 hover:text-white mt-4"
                    >
                      <span>Shop Bralettes</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <div className="absolute -bottom-6 -right-6 h-28 w-28 rounded-full bg-white/20 blur-xl pointer-events-none" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link
            to="/category/new-arrivals"
            className="px-3 py-2 text-sm font-medium transition-colors hover:text-[#637666] text-[#1F2022]"
          >
            New Arrivals
          </Link>
          <Link
            to="/category/bestsellers"
            className="px-3 py-2 text-sm font-medium transition-colors hover:text-[#637666] text-[#1F2022]"
          >
            Bestsellers
          </Link>
          <Link
            to="/category/bundles"
            className="px-3 py-2 text-sm font-medium transition-colors hover:text-[#637666] text-[#1F2022] flex items-center gap-1"
          >
            <span>Bundles</span>
            <span className="rounded-full bg-[#637666]/15 text-[#47584A] px-1.5 py-0.2 text-[10px] font-semibold">
              Save
            </span>
          </Link>
          <Link
            to="/category/offers"
            className="px-3 py-2 text-sm font-medium transition-colors hover:text-[#A85A3C] text-[#A85A3C]"
          >
            Offers
          </Link>
          <Link
            to="/about"
            className="px-3 py-2 text-sm font-medium transition-colors hover:text-[#637666] text-[#1F2022]"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="px-3 py-2 text-sm font-medium transition-colors hover:text-[#637666] text-[#1F2022]"
          >
            Help
          </Link>
        </nav>

        {/* Right: Action Utilities (Search, Account, Wishlist, Cart) */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Desktop Search Button */}
          <button
            type="button"
            onClick={() => openOverlay('search')}
            className="hidden lg:flex items-center gap-2 rounded-full border border-[#E8E1D7] bg-white px-3.5 py-1.5 text-xs text-[#6B6F76] transition-all hover:border-[#637666] hover:text-[#1F2022]"
          >
            <Search className="h-3.5 w-3.5 text-[#637666]" />
            <span>Search 2427...</span>
            <kbd className="rounded bg-[#F4EFEB] px-1.5 py-0.5 text-[10px] font-mono text-[#6B6F76]">
              ⌘K
            </kbd>
          </button>

          {/* Account Icon */}
          <button
            type="button"
            onClick={() => openOverlay('auth')}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#1F2022] hover:bg-[#F3EFEA] transition-colors"
            aria-label="User Account"
          >
            <User className="h-5 w-5" />
          </button>

          {/* Wishlist Icon */}
          <Link
            to="/wishlist"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#1F2022] hover:bg-[#F3EFEA] transition-colors"
            aria-label={`Wishlist with ${wishlistCount} saved items`}
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#637666] px-1 text-[10px] font-bold text-white shadow-xs">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Shopping Cart Drawer Trigger */}
          <button
            type="button"
            onClick={() => openOverlay('cart')}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#1F2022] text-[#FAF8F5] transition-transform hover:scale-105 active:scale-95 shadow-sm"
            aria-label={`Shopping bag with ${cartCount} items`}
          >
            <ShoppingBag className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#637666] px-1 text-[10px] font-bold text-white ring-2 ring-[#FAF8F5]">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
