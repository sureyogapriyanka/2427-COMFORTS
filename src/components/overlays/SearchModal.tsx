import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS, Product, formatINR } from '../../data/catalog';

const SUGGESTIONS = [
  'MicroModal Trunk',
  'CloudTouch Bralette',
  '3-Pack Rotation',
  'Pure Supima Boxer',
  'Bonded Vest',
  'SilkTouch Camisole',
];

export function SearchModal() {
  const { overlay, closeOverlay, searchQuery, setSearchQuery } = useStore();
  const [query, setQuery] = useState(searchQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (overlay === 'search') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [overlay]);

  if (overlay !== 'search') return null;

  const results: Product[] = query.trim()
    ? PRODUCTS.filter((p) =>
        [p.name, p.subtitle, p.fabric, p.categoryLabel, p.description]
          .join(' ')
          .toLowerCase()
          .includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={closeOverlay} />

      <div className="relative w-full max-w-2xl rounded-2xl bg-[#FAF8F5] shadow-2xl border border-[#E8E1D7] overflow-hidden animate-in zoom-in-95 duration-200 mt-12">
        {/* Search Bar Input */}
        <div className="flex items-center gap-3 border-b border-[#E8E1D7] bg-white px-5 py-4">
          <Search className="h-5 w-5 text-[#637666] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchQuery(e.target.value);
            }}
            placeholder="Search by fabric, garment, category (e.g. MicroModal, Bralette, Trunk)..."
            className="flex-1 bg-transparent text-sm sm:text-base text-[#1F2022] placeholder:text-[#6B6F76] outline-hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSearchQuery('');
              }}
              className="text-[#6B6F76] hover:text-[#1F2022] p-1"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={closeOverlay}
            className="rounded-lg bg-[#F4EFEB] px-2.5 py-1 text-xs font-medium text-[#1F2022] hover:bg-[#E8E1D7] transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Suggestion Chips */}
        <div className="border-b border-[#E8E1D7] bg-[#FAF8F5] px-5 py-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
            <span className="text-[#6B6F76] shrink-0 font-medium">Popular:</span>
            {SUGGESTIONS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setQuery(tag);
                  setSearchQuery(tag);
                }}
                className="shrink-0 rounded-full border border-[#E8E1D7] bg-white px-3 py-1 text-[#1F2022] hover:border-[#637666] hover:text-[#637666] transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-5">
          {query.trim() === '' ? (
            <div className="py-8 text-center">
              <Sparkles className="mx-auto h-8 w-8 text-[#637666]/60 mb-2" />
              <p className="font-display text-xl font-medium text-[#1F2022]">
                Explore Architectural Comfort
              </p>
              <p className="mt-1 text-xs text-[#5E6064] max-w-sm mx-auto">
                Type keywords like "Trunk", "Camisole", "Supima", or browse our curated collections.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-display text-xl text-[#1F2022]">No matches found for "{query}"</p>
              <p className="mt-1 text-xs text-[#5E6064]">
                Try checking for typos or searching for general categories like "Briefs", "Bras", or "Vests".
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#637666] mb-2">
                Found {results.length} result{results.length > 1 ? 's' : ''}
              </p>
              {results.map((product) => (
                <Link
                  key={product.id}
                  to={`/category/${product.category}`}
                  onClick={closeOverlay}
                  className="flex items-center gap-4 rounded-xl border border-[#E8E1D7] bg-white p-3 transition-colors hover:border-[#637666] hover:bg-[#FDFCFB]"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-16 w-14 rounded-lg object-cover bg-[#F4EFEB] shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-semibold text-[#637666]">
                        {product.categoryLabel}
                      </span>
                      {product.badge && (
                        <span className="rounded bg-[#F4EFEB] px-1.5 py-0.2 text-[9px] font-semibold text-[#1F2022]">
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <h4 className="font-display text-base font-medium text-[#1F2022]">
                      {product.name}
                    </h4>
                    <p className="text-xs text-[#5E6064] line-clamp-1">
                      {product.subtitle} &bull; {product.fabricBadge}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-numeral text-sm font-bold text-[#1F2022]">
                      {formatINR(product.price)}
                    </span>
                    <ArrowRight className="h-4 w-4 text-[#637666] ml-auto mt-1" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
