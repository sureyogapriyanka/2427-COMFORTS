
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
  Search,
  Heart,
  ShoppingBag,
  UserRound,
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
    .filter(
      (category) =>
        String(category.slug) !== 'men-bestsellers'
    )
    .map((category) => ({
      slug: String(category.slug),
      title: category.title,
      tagline: category.tagline,
      image:
        menImages[String(category.slug)] ||
        category.image,
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
    .filter(
      (category) =>
        String(category.slug) !== 'women-bestsellers'
    )
    .map((category) => ({
      slug: String(category.slug),
      title: category.title,
      tagline: category.tagline,
      image:
        womenImages[String(category.slug)] ||
        category.image,
    })),
  {
    slug: 'women-bestsellers',
    title: 'Bestsellers',
    tagline: 'Popular Picks',
    image: womenImages['women-bestsellers'],
  },
];

export function Header() {
  const {
    openOverlay,
    cartCount,
    wishlistCount,
  } = useStore();

  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);

  const [activeDropdown, setActiveDropdown] =
    useState<Gender | null>(null);

  const [hoveredItem, setHoveredItem] =
    useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    onScroll();

    window.addEventListener('scroll', onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener(
        'scroll',
        onScroll
      );
    };
  }, []);

  useEffect(() => {
    setActiveDropdown(null);
    setHoveredItem(null);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === 'k'
      ) {
        event.preventDefault();
        openOverlay('search');
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
    };
  }, [openOverlay]);

  const openDropdown = (gender: Gender) => {
    setActiveDropdown(gender);
    setHoveredItem(null);
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
    setHoveredItem(null);
  };

  const renderDropdown = (gender: Gender) => {
    const items =
      gender === 'men' ? menItems : womenItems;

    const selected =
      items.find(
        (item) => item.slug === hoveredItem
      ) || items[0];

    if (!selected) return null;

    return (
      <div
        className={`absolute left-0 top-full z-50 w-[580px] pt-2 ${gender === 'men'
            ? '-translate-x-12'
            : '-translate-x-24'
          }`}
        onMouseEnter={() =>
          openDropdown(gender)
        }
        onMouseLeave={closeDropdown}
      >
        <div className="grid grid-cols-[1fr_220px] gap-4 rounded-2xl border border-[#E8E1D7] bg-white p-5 shadow-2xl">
          {/* Category Links */}
          <div>
            <div className="mb-3 flex items-center justify-between border-b border-[#EEE7DE] pb-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#637666]">
                {gender === 'men'
                  ? "Men's Collection"
                  : "Women's Collection"}
              </span>

              <Link
                to={`/category/${items[0].slug}`}
                onClick={closeDropdown}
                className="text-[11px] font-semibold text-[#637666] hover:text-[#1F2022]"
              >
                Explore
                <ArrowRight
                  size={13}
                  className="ml-1 inline"
                />
              </Link>
            </div>

            <ul className="space-y-1">
              {items.map((item) => (
                <li key={item.slug}>
                  <Link
                    to={`/category/${item.slug}`}
                    onClick={closeDropdown}
                    onMouseEnter={() =>
                      setHoveredItem(item.slug)
                    }
                    onFocus={() =>
                      setHoveredItem(item.slug)
                    }
                    className={`group flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors ${selected.slug === item.slug
                        ? 'bg-[#F2F4EF]'
                        : 'hover:bg-[#FAF8F5]'
                      }`}
                  >
                    <div className="min-w-0">
                      <span className="text-sm font-semibold text-[#1F2022] group-hover:text-[#637666]">
                        {item.title}
                      </span>

                      <p className="mt-1 line-clamp-1 text-[11px] text-[#77736E]">
                        {item.tagline}
                      </p>
                    </div>

                    {item.slug.endsWith(
                      'bestsellers'
                    ) ? (
                      <span className="rounded-full bg-[#F2F4EF] px-2 py-1 text-[10px] font-bold text-[#637666]">
                        Popular
                      </span>
                    ) : (
                      <ArrowRight
                        size={15}
                        className="text-[#637666] opacity-0 transition-opacity group-hover:opacity-100"
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Image Preview */}
          <div className="flex flex-col overflow-hidden rounded-xl border border-[#EEE7DE] bg-[#FAF8F5] p-3">
            <div className="relative h-[220px] overflow-hidden rounded-lg bg-white">
              {items.map((item) => (
                <img
                  key={item.slug}
                  src={item.image}
                  alt={`${item.title} preview`}
                  loading="lazy"
                  className={`pointer-events-none absolute inset-0 h-full w-full object-contain p-2 transition-opacity duration-300 ${selected.slug === item.slug
                      ? 'opacity-100'
                      : 'opacity-0'
                    }`}
                />
              ))}
            </div>

            <div className="mt-3 flex flex-1 flex-col justify-end">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#637666]">
                Featured Collection
              </span>

              <h4 className="mt-1 font-display text-lg font-medium text-[#1F2022]">
                {selected.title}
              </h4>

              <p className="mt-1 line-clamp-1 text-xs text-[#77736E]">
                {selected.tagline}
              </p>

              <Link
                to={`/category/${selected.slug}`}
                onClick={closeDropdown}
                className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[#637666] hover:text-[#1F2022]"
              >
                Shop Collection
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-white transition-shadow duration-200 ${scrolled
          ? 'border-b border-[#E8E5E0] shadow-sm'
          : 'border-b border-[#E8E5E0]'
        }`}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-3 px-3 sm:px-6 lg:h-20 lg:px-8">
        {/* Mobile Actions */}
        <div className="flex items-center gap-1 lg:hidden">
          <button
            type="button"
            onClick={() => openOverlay('menu')}
            aria-label="Open mobile menu"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#1F2022] hover:bg-[#F4EFEB]"
          >
            <Menu size={21} />
          </button>

          <button
            type="button"
            onClick={() => openOverlay('search')}
            aria-label="Search products"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#1F2022] hover:bg-[#F4EFEB]"
          >
            <Search size={20} />
          </button>
        </div>

        {/* Logo */}
        <div className="flex min-w-0 items-center">
          <Logo size="md" />
        </div>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-2 lg:flex xl:gap-4"
        >
          {/* Men */}
          <div
            className="relative"
            onMouseEnter={() =>
              openDropdown('men')
            }
            onMouseLeave={closeDropdown}
          >
            <Link
              to="/category/men-underwear"
              onFocus={() =>
                openDropdown('men')
              }
              aria-expanded={
                activeDropdown === 'men'
              }
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${location.pathname.startsWith(
                '/category/men'
              )
                  ? 'text-[#637666]'
                  : 'text-[#1F2022] hover:text-[#637666]'
                }`}
            >
              Men
              <ChevronDown
                size={15}
                className={`transition-transform ${activeDropdown === 'men'
                    ? 'rotate-180'
                    : ''
                  }`}
              />
            </Link>

            {activeDropdown === 'men' &&
              renderDropdown('men')}
          </div>

          {/* Women */}
          <div
            className="relative"
            onMouseEnter={() =>
              openDropdown('women')
            }
            onMouseLeave={closeDropdown}
          >
            <Link
              to="/category/women-bras"
              onFocus={() =>
                openDropdown('women')
              }
              aria-expanded={
                activeDropdown === 'women'
              }
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${location.pathname.startsWith(
                '/category/women'
              )
                  ? 'text-[#637666]'
                  : 'text-[#1F2022] hover:text-[#637666]'
                }`}
            >
              Women
              <ChevronDown
                size={15}
                className={`transition-transform ${activeDropdown === 'women'
                    ? 'rotate-180'
                    : ''
                  }`}
              />
            </Link>

            {activeDropdown === 'women' &&
              renderDropdown('women')}
          </div>

          {/* New Arrivals */}
          <Link
            to="/category/new-arrivals"
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${location.pathname ===
                '/category/new-arrivals'
                ? 'text-[#637666]'
                : 'text-[#1F2022] hover:text-[#637666]'
              }`}
          >
            New Arrivals
          </Link>

          {/* Bestsellers */}
          <Link
            to="/category/bestsellers"
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${location.pathname ===
                '/category/bestsellers'
                ? 'text-[#637666]'
                : 'text-[#1F2022] hover:text-[#637666]'
              }`}
          >
            Bestsellers
          </Link>

          {/* Sale */}
          <Link
            to="/category/sale"
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${location.pathname ===
                '/category/sale'
                ? 'text-[#637666]'
                : 'text-[#1F2022] hover:text-[#637666]'
              }`}
          >
            Sale
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Desktop Search */}
          <button
            type="button"
            onClick={() => openOverlay('search')}
            aria-label="Search products"
            className="hidden items-center gap-2 rounded-full border border-[#E8E5E0] bg-[#FAF8F5] px-4 py-2.5 text-xs font-medium text-[#77736E] hover:border-[#637666] lg:flex"
          >
            <Search size={16} />
            Search...
            <kbd className="ml-1 rounded border border-[#E8E1D7] bg-white px-1.5 py-0.5 font-mono text-[10px]">
              Ctrl K
            </kbd>
          </button>

          {/* Account */}
          <Link
            to="/account"
            aria-label="Account"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-[#1F2022] hover:bg-[#F4EFEB] sm:flex"
          >
            <UserRound size={20} />
          </Link>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            aria-label={`Wishlist with ${wishlistCount} items`}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#1F2022] hover:bg-[#F4EFEB]"
          >
            <Heart size={20} />

            {wishlistCount > 0 && (
              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#637666] px-1 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Shopping Bag */}
          <button
            type="button"
            onClick={() => openOverlay('cart')}
            aria-label={`Shopping bag with ${cartCount} items`}
            className="flex h-10 items-center gap-2 rounded-full bg-[#1F2022] px-3 text-white transition-colors hover:bg-[#34373C] sm:px-4"
          >
            <ShoppingBag size={18} />

            <span className="text-xs font-bold">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
