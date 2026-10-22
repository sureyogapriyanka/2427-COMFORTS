
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  X,
  ArrowRight,
  Sparkles,
  PackageSearch,
  TrendingUp,
} from 'lucide-react';

import { useStore } from '../../context/StoreContext';
import { PRODUCTS, formatINR } from '../../data/catalog';

const SUGGESTIONS = [
  'Trunk',
  'Bralette',
  'Boxer',
  'Vest',
  'Camisole',
  'Supima',
];

export function SearchModal() {
  const {
    overlay,
    closeOverlay,
    searchQuery,
    setSearchQuery,
  } = useStore();

  const [query, setQuery] = useState(searchQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  const isOpen = overlay === 'search';

  useEffect(() => {
    if (!isOpen) return;

    setQuery(searchQuery);

    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeOverlay();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeOverlay]);

  const results = useMemo(() => {
    const searchText = query.trim().toLowerCase();

    if (!searchText) return [];

    const keywords = searchText.split(/\s+/);

    return PRODUCTS.filter((product) => {
      const searchableText = [
        product.name,
        product.subtitle,
        product.fabric,
        product.fabricBadge,
        product.category,
        product.categoryLabel,
        product.description,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return keywords.every((word) =>
        searchableText.includes(word)
      );
    });
  }, [query]);

  const updateQuery = (value: string) => {
    setQuery(value);
    setSearchQuery(value);
  };

  const handleProductClick = () => {
    closeOverlay();
    updateQuery('');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/60 px-3 py-6 backdrop-blur-sm sm:px-6 sm:py-12"
      role="presentation"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        onClick={closeOverlay}
        aria-hidden="true"
      />

      {/* Search Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search all products"
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-[#E8E1D7] bg-[#FAF8F5] shadow-2xl"
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-[#E8E1D7] bg-white px-4 py-4 sm:px-6">
          <Search
            size={21}
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
            className="min-w-0 flex-1 bg-transparent text-sm text-[#1F2022] outline-none placeholder:text-[#99938B] sm:text-base"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                updateQuery('');
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="rounded-full p-1.5 text-[#77736E] hover:bg-[#F4EFEB] hover:text-[#1F2022]"
            >
              <X size={17} />
            </button>
          )}

          <button
            type="button"
            onClick={closeOverlay}
            aria-label="Close search"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F4EFEB] text-[#1F2022] transition-colors hover:bg-[#E8E1D7]"
          >
            <X size={17} />
          </button>
        </div>

        {/* Suggestions */}
        <div className="border-b border-[#E8E1D7] px-4 py-4 sm:px-6">
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
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  updateQuery(suggestion);
                  inputRef.current?.focus();
                }}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${query.toLowerCase() ===
                    suggestion.toLowerCase()
                    ? 'border-[#637666] bg-[#637666] text-white'
                    : 'border-[#E8E1D7] bg-white text-[#5E6064] hover:border-[#637666] hover:text-[#637666]'
                  }`}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6">
          {!query.trim() ? (
            <div className="py-10 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F2F4EF]">
                <Sparkles
                  size={28}
                  className="text-[#637666]"
                />
              </div>

              <h2 className="font-display text-xl font-medium text-[#1F2022] sm:text-2xl">
                Discover Your Everyday Comfort
              </h2>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#77736E]">
                Search our entire collection of essentials
                or choose a popular search above.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F2F4EF]">
                <PackageSearch
                  size={28}
                  className="text-[#637666]"
                />
              </div>

              <h2 className="font-display text-xl font-medium text-[#1F2022]">
                No Products Found
              </h2>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#77736E]">
                No matching products for "{query}".
                Try a different product name, fabric,
                or category.
              </p>

              <button
                type="button"
                onClick={() => {
                  updateQuery('');
                  inputRef.current?.focus();
                }}
                className="mt-5 rounded-xl bg-[#1F2022] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#34373C]"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#637666]">
                    Search Results
                  </p>

                  <p className="mt-1 text-xs text-[#77736E]">
                    {results.length}{' '}
                    {results.length === 1
                      ? 'product'
                      : 'products'}{' '}
                    found
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {results.map((product) => {
                  const hasDiscount =
                    product.compareAt != null &&
                    product.compareAt > product.price;

                  return (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
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

                      {/* Product Information */}
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

                        <p className="mt-1 text-[11px] text-[#637666]">
                          {product.fabricBadge}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="shrink-0 text-right">
                        <p className="font-numeral text-sm font-bold text-[#1F2022]">
                          {formatINR(product.price)}
                        </p>

                        {hasDiscount && (
                          <p className="mt-1 text-xs text-[#99938B] line-through">
                            {formatINR(product.compareAt!)}
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
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-[#E8E1D7] bg-white px-4 py-3 sm:px-6">
          <span className="text-[11px] text-[#77736E]">
            Explore the 2427-COMFORTS collection
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
