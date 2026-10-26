
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Link } from 'react-router-dom';

import {
  Search,
  X,
  ArrowRight,
  Sparkles,
  PackageSearch,
  TrendingUp,
  Clock3,
} from 'lucide-react';

import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../data/catalog';
import { useCatalog } from '../../context/CatalogContext';

const SUGGESTIONS = [
  'Trunk',
  'Bralette',
  'Boxer',
  'Vest',
  'Camisole',
  'Supima',
];

const MAX_VISIBLE_RESULTS = 12;

export function SearchModal() {
  const { products } = useCatalog();
  const {
    overlay,
    closeOverlay,
    searchQuery,
    setSearchQuery,
  } = useStore();

  const [query, setQuery] = useState(searchQuery);
  const [showAllResults, setShowAllResults] =
    useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const isOpen = overlay === 'search';

  useEffect(() => {
    if (!isOpen) return;

    setQuery(searchQuery);
    setShowAllResults(false);

    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeOverlay();
      }
    };

    document.addEventListener(
      'keydown',
      handleEscape
    );

    return () => {
      window.clearTimeout(focusTimer);

      document.removeEventListener(
        'keydown',
        handleEscape
      );
    };
  }, [isOpen, closeOverlay]);

  const results = useMemo(() => {
    const searchText = query.trim().toLowerCase();

    if (!searchText) return [];

    const keywords = searchText.split(/\s+/);

    return products.filter((product) => {
      const searchableText = [
        product.name,
        product.subtitle,
        product.fabric,
        product.fabricBadge,
        product.category,
        product.categoryLabel,
        product.description,
        product.code,
        product.badge,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return keywords.every((word) =>
        searchableText.includes(word)
      );
    });
  }, [query, products]);

  const visibleResults = showAllResults
    ? results
    : results.slice(0, MAX_VISIBLE_RESULTS);

  const updateQuery = (value: string) => {
    setQuery(value);
    setSearchQuery(value);
    setShowAllResults(false);
  };

  const handleProductClick = () => {
    closeOverlay();
    updateQuery('');
  };

  const clearSearch = () => {
    updateQuery('');
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/65 px-3 py-5 backdrop-blur-sm sm:px-6 sm:py-12">
      {/* Backdrop */}
      <button
        type="button"
        onClick={closeOverlay}
        aria-label="Close search"
        className="fixed inset-0 h-full w-full cursor-default"
      />

      {/* Search Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search products"
        className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl border border-[#E8E1D7] bg-[#FAF8F5] shadow-2xl sm:rounded-3xl"
      >
        {/* Header */}
        <div className="border-b border-[#E8E1D7] bg-white px-4 pb-4 pt-5 sm:px-7 sm:pt-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#637666]">
                2427 ÉLAN
              </p>

              <h2 className="mt-1 font-display text-xl font-medium text-[#1F2022] sm:text-2xl">
                What are you looking for?
              </h2>
            </div>

            <button
              type="button"
              onClick={closeOverlay}
              aria-label="Close search"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F4EFEB] text-[#1F2022] transition-colors hover:bg-[#E8E1D7]"
            >
              <X size={19} />
            </button>
          </div>

          {/* Search Input */}
          <div className="flex min-h-14 items-center gap-3 rounded-xl border border-[#DAD8D1] bg-[#FAF8F5] px-4 transition-colors focus-within:border-[#637666]">
            <Search
              size={20}
              className="shrink-0 text-[#637666]"
            />

            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) =>
                updateQuery(event.target.value)
              }
              placeholder="Search products, fabrics, categories..."
              aria-label="Search products"
              className="min-w-0 flex-1 bg-transparent py-3 text-sm text-[#1F2022] outline-none placeholder:text-[#99938B] sm:text-base"
            />

            {query && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="rounded-full p-1.5 text-[#77736E] hover:bg-[#EEE7DE]"
              >
                <X size={17} />
              </button>
            )}
          </div>
        </div>

        {/* Popular Searches */}
        <div className="border-b border-[#E8E1D7] px-4 py-4 sm:px-7">
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp
              size={15}
              className="text-[#637666]"
            />

            <span className="text-xs font-semibold text-[#1F2022]">
              Popular Searches
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((suggestion) => {
              const isActive =
                query.trim().toLowerCase() ===
                suggestion.toLowerCase();

              return (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    updateQuery(suggestion);
                    inputRef.current?.focus();
                  }}
                  aria-pressed={isActive}
                  className={`rounded-full border px-3 py-2 text-xs font-medium transition-colors ${isActive
                      ? 'border-[#637666] bg-[#637666] text-white'
                      : 'border-[#E8E1D7] bg-white text-[#5E6064] hover:border-[#637666] hover:text-[#637666]'
                    }`}
                >
                  {suggestion}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Results */}
        <div className="max-h-[55vh] min-h-[220px] overflow-y-auto p-4 sm:p-6">
          {!query.trim() ? (
            <div className="py-10 text-center">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#F2F4EF]">
                <Sparkles
                  size={31}
                  className="text-[#637666]"
                />
              </div>

              <h3 className="font-display text-xl font-medium text-[#1F2022] sm:text-2xl">
                Discover Everyday Comfort
              </h3>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#77736E]">
                Explore comfortable essentials for
                every day. Start typing or choose a
                popular search above.
              </p>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#99938B]">
                <Clock3 size={14} />
                Results appear as you type
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#F2F4EF]">
                <PackageSearch
                  size={30}
                  className="text-[#637666]"
                />
              </div>

              <h3 className="font-display text-xl font-medium text-[#1F2022]">
                No Products Found
              </h3>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#77736E]">
                No products match "{query}". Try
                another name, fabric or category.
              </p>

              <button
                type="button"
                onClick={clearSearch}
                className="mt-6 rounded-xl bg-[#1F2022] px-6 py-3 text-xs font-semibold text-white hover:bg-[#34373C]"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <>
              {/* Results Header */}
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#637666]">
                    Search Results
                  </p>

                  <p className="mt-1 text-xs text-[#77736E]">
                    {results.length}{' '}
                    {results.length === 1
                      ? 'product found'
                      : 'products found'}
                  </p>
                </div>

                <span className="rounded-full bg-[#EDF3ED] px-3 py-1.5 text-[11px] font-semibold text-[#637666]">
                  Live Results
                </span>
              </div>

              {/* Products */}
              <div className="space-y-3">
                {visibleResults.map((product) => {
                  const hasDiscount =
                    product.compareAt != null &&
                    product.compareAt >
                    product.price;

                  return (
                    <Link
                      key={product.id}
                      to={`/product/${product.slug}`}
                      onClick={handleProductClick}
                      className="group flex items-center gap-3 rounded-xl border border-[#E8E1D7] bg-white p-3 transition-all hover:border-[#637666] hover:shadow-sm sm:gap-4"
                    >
                      {/* Product Image */}
                      <div className="flex h-20 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F4EFEB] sm:h-24 sm:w-20">
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          className="h-full w-full object-contain p-1"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#637666]">
                            {product.categoryLabel}
                          </span>

                          {product.badge && (
                            <span className="rounded-md bg-[#F2F4EF] px-2 py-0.5 text-[9px] font-semibold text-[#637666]">
                              {product.badge}
                            </span>
                          )}
                        </div>

                        <h3 className="line-clamp-2 font-display text-sm font-semibold text-[#1F2022] transition-colors group-hover:text-[#637666] sm:text-base">
                          {product.name}
                        </h3>

                        <p className="mt-1 line-clamp-1 text-xs text-[#77736E]">
                          {product.subtitle}
                        </p>

                        {product.fabricBadge && (
                          <p className="mt-1 text-[11px] text-[#637666]">
                            {product.fabricBadge}
                          </p>
                        )}
                      </div>

                      {/* Price */}
                      <div className="shrink-0 text-right">
                        <p className="font-numeral text-sm font-bold text-[#1F2022]">
                          {formatINR(product.price)}
                        </p>

                        {hasDiscount && (
                          <p className="mt-1 text-xs text-[#99938B] line-through">
                            {formatINR(
                              product.compareAt!
                            )}
                          </p>
                        )}

                        <ArrowRight
                          size={17}
                          className="ml-auto mt-3 text-[#637666] transition-transform group-hover:translate-x-1"
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Show More */}
              {!showAllResults &&
                results.length >
                MAX_VISIBLE_RESULTS && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowAllResults(true)
                    }
                    className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#DAD8D1] bg-white px-4 text-sm font-semibold text-[#1F2022] hover:border-[#637666]"
                  >
                    Show All {results.length} Results
                    <ArrowRight size={16} />
                  </button>
                )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-[#E8E1D7] bg-white px-4 py-4 sm:px-7">
          <span className="text-[11px] text-[#77736E]">
            2427 ÉLAN Collection
          </span>

          <button
            type="button"
            onClick={closeOverlay}
            className="text-xs font-semibold text-[#637666] hover:text-[#1F2022]"
          >
            Close Search
          </button>
        </div>
      </div>
    </div>
  );
}
