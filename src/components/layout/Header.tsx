
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
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Logo } from '../brand/Logo';
import {
  MEN_CATEGORIES,
  WOMEN_CATEGORIES,
} from '../../data/catalog';

type Gender = 'men' | 'women';

type DropdownItem = {
  slug: string;
  title: string;
  tagline: string;
  image: string;
};

const productImage = (path: string): string =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;

const menImages: Record<string, string> = {
  'men-underwear': productImage(
    'images/products/underwear/m-ub01-front.jpg'
  ),
  'men-boxers': productImage(
    'images/products/boxers/m-bx01-airbox-front.jpg'
  ),
  'men-vests': productImage(
    'images/products/vests/m-v01-front.jpg'
  ),
  'men-sleeveless': productImage(
    'images/products/sleeveless/m-s01-front.jpg'
  ),
  'men-bestsellers': productImage(
    'images/products/underwear/m-ub02-front.jpg'
  ),
};

const womenImages: Record<string, string> = {
  'women-bras': productImage(
    'images/products/bras/w-b01-front.jpg'
  ),
  'women-underwear': productImage(
    'images/products/women-underwear/w-u01-front.jpg'
  ),
  'women-camisoles': productImage(
    'images/products/women-camisoles/w-c01-front.jpg'
  ),
  'women-crop-tops': productImage(
    'images/products/women-crop-tops/w-ct01-front.jpg'
  ),
  'women-bestsellers': productImage(
    'images/products/bras/w-b02-front.jpg'
  ),
};

const menItems: DropdownItem[] = [
  ...MEN_CATEGORIES
    .filter((cat) => String(cat.slug) !== 'men-bestsellers')
    .map((cat) => ({
      slug: String(cat.slug),
      title: cat.title,
      tagline: cat.tagline,
      image: menImages[String(cat.slug)] || cat.image,
    })),
  {
    slug: 'men-bestsellers',
    title: 'Bestsellers',
    tagline: 'Popular Picks',
    image: menImages['men-bestsellers'],
  },
];

const womenItems: DropdownItem[] = [
  ...WOMEN_CATEGORIES
    .filter((cat) => String(cat.slug) !== 'women-bestsellers')
    .map((cat) => ({
      slug: String(cat.slug),
      title: cat.title,
      tagline: cat.tagline,
      image: womenImages[String(cat.slug)] || cat.image,
    })),
  {
    slug: 'women-bestsellers',
    title: 'Bestsellers',
    tagline: 'Popular Picks',
    image: womenImages['women-bestsellers'],
  },
];

export function Header() {
  const { openOverlay, cartCount, wishlistCount } = useStore();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] =
    useState<Gender | null>(null);
  const [hoveredItem, setHoveredItem] =
    useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', onScroll, {
      passive: true,
    });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setActiveDropdown(null);
    setHoveredItem(null);
  }, [location.pathname]);

  const openDropdown = (gender: Gender) => {
    setActiveDropdown(gender);
    setHoveredItem(null);
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
    setHoveredItem(null);
  };

  const renderDropdown = (gender: Gender) => {
    const items = gender === 'men' ? menItems : womenItems;

    const selected =
      items.find((item) => item.slug === hoveredItem) ||
      items[0];

    return (
      <div
        className={`absolute left-0 top-full z-50 w-[600px] pt-3 ${gender === 'men'
            ? '-translate-x-12'
            : '-translate-x-24'
          }`}
      >
        <div className="grid grid-cols-[1fr_230px] gap-5 rounded-2xl border border-[#E8E1D7] bg-[#FAF8F5] p-5 shadow-xl">
          <div>
            <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#637666]">
              {gender === 'men'
                ? "Men's Essentials"
                : "Women's Intimates"}
            </span>

            <ul className="space-y-1">
              {items.map((item) => (
                <li key={item.slug}>
                  <Link
                    to={`/category/${item.slug}`}
                    onMouseEnter={() =>
                      setHoveredItem(item.slug)
                    }
                    onFocus={() =>
                      setHoveredItem(item.slug)
                    }
                    className={`group block rounded-xl px-3 py-3 transition-colors ${selected.slug === item.slug
                        ? 'bg-white'
                        : 'hover:bg-white'
                      }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-[#1F2022] group-hover:text-[#637666]">
                        {item.title}
                      </span>

                      {item.slug.endsWith('bestsellers') ? (
                        <span className="text-[10px] font-semibold text-[#637666]">
                          ★ Popular
                        </span>
                      ) : (
                        <ArrowRight className="h-3.5 w-3.5 text-[#637666] opacity-0 group-hover:opacity-100" />
                      )}
                    </div>

                    <p className="mt-1 text-[11px] text-[#6B6F76]">
                      {item.tagline}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col overflow-hidden rounded-xl bg-[#F4EFEB]">
            <div className="relative h-[260px] overflow-hidden">
              {items.map((item) => (
                <img
                  key={item.slug}
                  src={item.image}
                  alt={`${item.title} preview`}
                  className={`pointer-events-none absolute inset-0 h-full w-full object-contain p-3 transition-opacity duration-300 ${selected.slug === item.slug
                      ? 'opacity-100'
                      : 'opacity-0'
                    }`}
                  loading="lazy"
                />
              ))}
            </div>

            <div className="flex flex-1 flex-col justify-end p-4">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#637666]">
                Product Preview
              </span>

              <h4 className="mt-1 font-display text-xl font-medium text-[#1F2022]">
                {selected.title}
              </h4>

              <p className="mt-1 text-xs text-[#5E6064]">
                {selected.tagline}
              </p>

              <Link
                to={`/category/${selected.slug}`}
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#47584A]"
              >
                Explore Collection
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${scrolled
          ? 'border-b border-[#E8E1D7] bg-[#FAF8F5]/95 shadow-xs backdrop-blur-md'
          : 'border-b border-[#E8E1D7]/60 bg-[#FAF8F5]'
        }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => openOverlay('menu')}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#1F2022] hover:bg-[#F3EFEA]"
            aria-label="Open mobile navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => openOverlay('search')}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#1F2022] hover:bg-[#F3EFEA]"
            aria-label="Search collection"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center">
          <Logo size="md" />
        </div>

        <nav className="hidden items-center gap-1 lg:flex xl:gap-2">
          <Link
            to="/"
            className={`px-3 py-2 text-sm font-medium hover:text-[#637666] ${location.pathname === '/'
                ? 'font-semibold text-[#637666]'
                : 'text-[#1F2022]'
              }`}
          >
            Home
          </Link>

          <div
            className="relative"
            onMouseEnter={() => openDropdown('men')}
            onMouseLeave={closeDropdown}
          >
            <button
              type="button"
              onClick={() =>
                activeDropdown === 'men'
                  ? closeDropdown()
                  : openDropdown('men')
              }
              className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-[#1F2022] hover:text-[#637666]"
            >
              Men
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${activeDropdown === 'men'
                    ? 'rotate-180'
                    : ''
                  }`}
              />
            </button>

            {activeDropdown === 'men' &&
              renderDropdown('men')}
          </div>

          <div
            className="relative"
            onMouseEnter={() => openDropdown('women')}
            onMouseLeave={closeDropdown}
          >
            <button
              type="button"
              onClick={() =>
                activeDropdown === 'women'
                  ? closeDropdown()
                  : openDropdown('women')
              }
              className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-[#1F2022] hover:text-[#637666]"
            >
              Women
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${activeDropdown === 'women'
                    ? 'rotate-180'
                    : ''
                  }`}
              />
            </button>

            {activeDropdown === 'women' &&
              renderDropdown('women')}
          </div>

          <Link
            to="/category/new-arrivals"
            className="px-3 py-2 text-sm font-medium text-[#1F2022] hover:text-[#637666]"
          >
            New Arrivals
          </Link>

          <Link
            to="/category/bundles"
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-[#1F2022] hover:text-[#637666]"
          >
            Bundles
            <span className="rounded-full bg-[#637666]/15 px-1.5 py-0.5 text-[10px] font-semibold text-[#47584A]">
              Save
            </span>
          </Link>

          <Link
            to="/category/offers"
            className="px-3 py-2 text-sm font-medium text-[#A85A3C]"
          >
            Offers
          </Link>

          <Link
            to="/about"
            className="px-3 py-2 text-sm font-medium text-[#1F2022] hover:text-[#637666]"
          >
            About Us
          </Link>

          <Link
            to="/contact"
            className="px-3 py-2 text-sm font-medium text-[#1F2022] hover:text-[#637666]"
          >
            Help
          </Link>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => openOverlay('search')}
            className="hidden items-center gap-2 rounded-full border border-[#E8E1D7] bg-white px-3.5 py-1.5 text-xs text-[#6B6F76] hover:border-[#637666] lg:flex"
          >
            <Search className="h-3.5 w-3.5 text-[#637666]" />
            <span>Search 2427...</span>
            <kbd className="rounded bg-[#F4EFEB] px-1.5 py-0.5 font-mono text-[10px]">
              ⌘K
            </kbd>
          </button>

          <button
            type="button"
            onClick={() => openOverlay('auth')}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#1F2022] hover:bg-[#F3EFEA]"
            aria-label="User Account"
          >
            <User className="h-5 w-5" />
          </button>

          <Link
            to="/wishlist"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#1F2022] hover:bg-[#F3EFEA]"
            aria-label={`Wishlist with ${wishlistCount} saved items`}
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#637666] px-1 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => openOverlay('cart')}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#1F2022] text-[#FAF8F5] hover:scale-105"
            aria-label={`Shopping bag with ${cartCount} items`}
          >
            <ShoppingBag className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#637666] px-1 text-[10px] font-bold text-white ring-2 ring-[#FAF8F5]">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
