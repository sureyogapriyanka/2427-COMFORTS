
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  ChevronRight,
  SlidersHorizontal,
  Search,
  X,
  RotateCcw,
  PackageSearch,
  ArrowDownUp,
  Check,
  Info,
} from 'lucide-react';

import { Container } from '../components/ui/Container';
import { ProductGrid } from '../components/product/ProductGrid';
import { DemoBadge } from '../components/brand/DemoBadge';
import { useCatalog } from '../context/CatalogContext';

type SortOption =
  | 'featured'
  | 'price-low'
  | 'price-high'
  | 'rating';

const pricePresets = [
  { label: 'Under ₹500', min: '', max: '500' },
  { label: '₹500–₹1,000', min: '500', max: '1000' },
  { label: '₹1,000–₹2,000', min: '1000', max: '2000' },
  { label: 'Above ₹2,000', min: '2000', max: '' },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const requestedGender = searchParams.get('gender');
  const genderFilter = requestedGender === 'men' || requestedGender === 'women'
    ? requestedGender
    : null;
  const { products, categories, isLoading: catalogLoading, error: catalogError } = useCatalog();

  const [search, setSearch] = useState('');
  const [selectedSort, setSelectedSort] =
    useState<SortOption>('featured');
  const [filterFabric, setFilterFabric] = useState('all');
  const [filterColor, setFilterColor] = useState('all');
  const [filterSize, setFilterSize] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const matchedCategory = categories.find(
    (category) => category.slug === slug
  );

  const categoryProducts = useMemo(() => {
    return products.filter((product) => {
      let matchesCollection = false;
      if (slug === 'new-arrivals') {
        matchesCollection = (
          product.badge === 'New' ||
          product.category === 'new-arrivals'
        );
      } else if (slug === 'bestsellers') {
        matchesCollection = product.badge === 'Bestseller';
      } else if (slug === 'bundles') {
        matchesCollection = product.category === 'bundles';
      } else if (slug === 'offers') {
        matchesCollection = (
          product.compareAt != null &&
          product.compareAt > product.price
        );
      } else if (slug === 'sale') {
        matchesCollection = false;
      } else {
        matchesCollection = product.category === slug;
      }

      return matchesCollection && (!genderFilter || product.gender === genderFilter);
    });
  }, [slug, products, genderFilter]);

  useEffect(() => {
    setSearch('');
    setSelectedSort('featured');
    setFilterFabric('all');
    setFilterColor('all');
    setFilterSize('all');
    setMinPrice('');
    setMaxPrice('');
    setShowFilters(false);
  }, [slug, genderFilter]);

  const availableFabrics = useMemo(
    () =>
      Array.from(
        new Set(
          categoryProducts
            .map((product) => product.fabricBadge)
            .filter((fabric): fabric is string => Boolean(fabric))
        )
      ).sort(),
    [categoryProducts]
  );

  const availableSizes = useMemo(() => {
    const sizes = Array.from(
      new Set(
        categoryProducts.flatMap((product) => product.sizes)
      )
    );

    const sizeOrder = [
      'XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL',
    ];

    return sizes.sort((a, b) => {
      const aIndex = sizeOrder.indexOf(a.toUpperCase());
      const bIndex = sizeOrder.indexOf(b.toUpperCase());

      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }

      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;

      return a.localeCompare(b, undefined, {
        numeric: true,
      });
    });
  }, [categoryProducts]);

  const availableColors = useMemo(
    () =>
      Array.from(
        new Set(
          categoryProducts.flatMap((product) =>
            product.colors.map((color) => color.name)
          )
        )
      ).sort((a, b) => a.localeCompare(b)),
    [categoryProducts]
  );

  const filteredProducts = useMemo(() => {
    let results = [...categoryProducts];
    const query = search.trim().toLowerCase();

    if (query) {
      results = results.filter((product) =>
        [
          product.name,
          product.subtitle,
          product.categoryLabel,
          product.fabricBadge,
          product.code || '',
        ]
          .join(' ')
          .toLowerCase()
          .includes(query)
      );
    }

    if (filterFabric !== 'all') {
      results = results.filter(
        (product) =>
          (product.fabricBadge || '').toLowerCase() ===
          filterFabric.toLowerCase()
      );
    }

    if (filterColor !== 'all') {
      results = results.filter((product) =>
        product.colors.some(
          (color) => color.name === filterColor
        )
      );
    }

    if (filterSize !== 'all') {
      results = results.filter((product) =>
        product.sizes.includes(filterSize)
      );
    }

    if (minPrice !== '') {
      const min = Number(minPrice);

      if (Number.isFinite(min) && min >= 0) {
        results = results.filter(
          (product) => product.price >= min
        );
      }
    }

    if (maxPrice !== '') {
      const max = Number(maxPrice);

      if (Number.isFinite(max) && max >= 0) {
        results = results.filter(
          (product) => product.price <= max
        );
      }
    }

    if (selectedSort === 'price-low') {
      results.sort((a, b) => a.price - b.price);
    } else if (selectedSort === 'price-high') {
      results.sort((a, b) => b.price - a.price);
    } else if (selectedSort === 'rating') {
      results.sort(
        (a, b) => (b.rating || 0) - (a.rating || 0)
      );
    }

    return results;
  }, [
    categoryProducts,
    search,
    selectedSort,
    filterFabric,
    filterColor,
    filterSize,
    minPrice,
    maxPrice,
  ]);

  const clearFilters = () => {
    setSearch('');
    setSelectedSort('featured');
    setFilterFabric('all');
    setFilterColor('all');
    setFilterSize('all');
    setMinPrice('');
    setMaxPrice('');
  };

  const activeFilterCount = [
    filterFabric !== 'all',
    filterColor !== 'all',
    filterSize !== 'all',
    minPrice !== '' || maxPrice !== '',
  ].filter(Boolean).length;

  const hasActiveFilters =
    search.trim() !== '' ||
    activeFilterCount > 0 ||
    selectedSort !== 'featured';

  const title = matchedCategory
    ? matchedCategory.title
    : slug === 'new-arrivals'
      ? 'New Arrivals'
      : slug === 'bestsellers'
        ? 'Bestsellers'
        : slug === 'bundles'
          ? 'Multipacks & Bundles'
          : slug === 'offers'
            ? 'Curated Offers'
            : slug === 'sale'
              ? 'Sale'
              : 'Collection';

  const description = slug === 'sale'
    ? 'No sale pricing or approved discounts are currently available.'
    : matchedCategory
    ? matchedCategory.description
    : 'Discover everyday essentials designed for comfort and confidence.';

  const collectionLabel =
    genderFilter === 'men' || matchedCategory?.gender === 'men'
          ? "Men's Collection"
          : genderFilter === 'women' || matchedCategory?.gender === 'women'
            ? "Women's Collection"
            : '2427 Collection';

  const isBoxers = slug === 'men-boxers';

  const priceRangeLabel =
    minPrice && maxPrice
      ? `${formatPrice(Number(minPrice))} – ${formatPrice(Number(maxPrice))}`
      : minPrice
        ? `From ${formatPrice(Number(minPrice))}`
        : maxPrice
          ? `Up to ${formatPrice(Number(maxPrice))}`
          : '';

  const applyPricePreset = (
    min: string,
    max: string
  ) => {
    if (minPrice === min && maxPrice === max) {
      setMinPrice('');
      setMaxPrice('');
    } else {
      setMinPrice(min);
      setMaxPrice(max);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F5] py-5 sm:py-9">
      <Container>
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-5 flex flex-wrap items-center gap-2 text-xs text-neutral-500"
        >
          <Link
            to="/"
            className="hover:text-[#202020]"
          >
            Home
          </Link>

          <ChevronRight size={13} />

          <span className="font-medium text-[#202020]">
            {title}
          </span>
        </nav>

        {/* Collection Header */}
        <section className="mb-6 overflow-hidden rounded-2xl border border-[#E8E5E0] bg-white sm:rounded-3xl">
          <div className="px-5 py-7 sm:px-10 sm:py-10">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#637666]">
                {collectionLabel}
              </span>

              <DemoBadge variant="pill" />
            </div>

            <h1 className="font-display text-3xl font-medium tracking-tight text-[#202020] sm:text-4xl">
              {title}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">
              {description}
            </p>

            {catalogError && (
              <p role="status" className="mt-3 text-xs text-amber-800">
                Catalog service is unavailable; showing the saved local catalog. {catalogError}
              </p>
            )}
            {catalogLoading && !catalogError && (
              <p role="status" className="mt-3 text-xs text-[#77736E]">
                Syncing catalog data; cached product details remain visible.
              </p>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#E8E5E0] bg-[#F8F7F5] px-3.5 py-2 text-xs font-semibold text-[#637666]">
                <PackageSearch size={15} />
                {filteredProducts.length}{' '}
                {filteredProducts.length === 1
                  ? 'Product'
                  : 'Products'}
              </span>

              <span className="text-xs text-neutral-500">
                Everyday comfort by 2427 ÉLAN
              </span>
            </div>
          </div>

          {isBoxers && (
            <div className="flex items-start gap-3 border-t border-[#E8E5E0] bg-[#F8F7F5] px-5 py-3 text-xs leading-5 text-neutral-600 sm:px-10">
              <Info
                size={16}
                className="mt-0.5 shrink-0 text-[#637666]"
              />

              <span>
                <strong>Client Catalogue Reference:</strong>{' '}
                Sample product pricing and imagery are shown
                for demonstration.
              </span>
            </div>
          )}
        </section>

        {/* Search, Filters, Sort */}
        <div className="mb-4 flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search within this collection..."
              aria-label="Search collection products"
              className="h-12 w-full rounded-xl border border-[#E8E5E0] bg-white pl-11 pr-10 text-sm text-[#202020] outline-none placeholder:text-neutral-400 focus:border-[#637666]"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-black"
              >
                <X size={17} />
              </button>
            )}
          </div>

          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() =>
                setShowFilters((previous) => !previous)
              }
              aria-expanded={showFilters}
              aria-controls="collection-filters"
              className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border px-5 text-sm font-semibold transition-colors lg:flex-none ${showFilters
                  ? 'border-[#202020] bg-[#202020] text-white'
                  : 'border-[#E8E5E0] bg-white text-[#202020] hover:border-[#637666]'
                }`}
            >
              <SlidersHorizontal size={17} />
              Filters

              {activeFilterCount > 0 && (
                <span
                  className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] ${showFilters
                      ? 'bg-white text-[#202020]'
                      : 'bg-[#637666] text-white'
                    }`}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="relative flex flex-1 items-center lg:flex-none">
              <ArrowDownUp
                size={15}
                className="pointer-events-none absolute left-3 text-neutral-500"
              />

              <select
                value={selectedSort}
                onChange={(event) =>
                  setSelectedSort(
                    event.target.value as SortOption
                  )
                }
                aria-label="Sort products"
                className="h-12 w-full min-w-0 appearance-none rounded-xl border border-[#E8E5E0] bg-white py-2 pl-9 pr-6 text-xs font-medium text-[#202020] outline-none focus:border-[#637666] sm:text-sm lg:w-[205px]"
              >
                <option value="featured">Featured</option>
                <option value="price-low">
                  Price: Low to High
                </option>
                <option value="price-high">
                  Price: High to Low
                </option>
                <option value="rating">Rating (demo data)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <section
            id="collection-filters"
            aria-label="Product filters"
            className="mb-5 rounded-2xl border border-[#E8E5E0] bg-white p-4 sm:p-6"
          >
            <div className="mb-5 flex items-center justify-between gap-3 border-b border-[#E8E5E0] pb-4">
              <h2 className="font-display text-lg font-medium text-[#202020]">
                Refine Your Selection
              </h2>

              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#637666] hover:text-[#202020]"
              >
                <RotateCcw size={14} />
                Clear All
              </button>
            </div>

            <div className="grid gap-7 lg:grid-cols-4">
              {/* Fabric */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-[#202020]">
                  Fabric / Style
                </h3>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setFilterFabric('all')}
                    className={`rounded-full border px-3 py-2 text-xs font-medium transition-colors ${filterFabric === 'all'
                        ? 'border-[#202020] bg-[#202020] text-white'
                        : 'border-[#E8E5E0] bg-white text-[#202020] hover:border-[#637666]'
                      }`}
                  >
                    All Styles
                  </button>

                  {availableFabrics.map((fabric) => (
                    <button
                      key={fabric}
                      type="button"
                      onClick={() =>
                        setFilterFabric(
                          filterFabric === fabric
                            ? 'all'
                            : fabric
                        )
                      }
                      aria-pressed={filterFabric === fabric}
                      className={`rounded-full border px-3 py-2 text-xs font-medium transition-colors ${filterFabric === fabric
                          ? 'border-[#202020] bg-[#202020] text-white'
                          : 'border-[#E8E5E0] bg-white text-[#202020] hover:border-[#637666]'
                        }`}
                    >
                      {fabric}
                    </button>
                  ))}
                </div>

                {availableFabrics.length === 0 && (
                  <p className="mt-3 text-xs text-neutral-500">
                    No fabric options listed.
                  </p>
                )}
              </div>

              {/* Color */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-[#202020]">
                  Color
                </h3>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setFilterColor('all')}
                    aria-pressed={filterColor === 'all'}
                    className={`rounded-full border px-3 py-2 text-xs font-medium transition-colors ${filterColor === 'all'
                        ? 'border-[#202020] bg-[#202020] text-white'
                        : 'border-[#E8E5E0] bg-white text-[#202020] hover:border-[#637666]'
                      }`}
                  >
                    All Colors
                  </button>

                  {availableColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() =>
                        setFilterColor(
                          filterColor === color ? 'all' : color
                        )
                      }
                      aria-pressed={filterColor === color}
                      className={`rounded-full border px-3 py-2 text-xs font-medium transition-colors ${filterColor === color
                          ? 'border-[#202020] bg-[#202020] text-white'
                          : 'border-[#E8E5E0] bg-white text-[#202020] hover:border-[#637666]'
                        }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>

                {availableColors.length === 0 && (
                  <p className="mt-3 text-xs text-neutral-500">
                    No color options listed.
                  </p>
                )}
              </div>

              {/* Size */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-[#202020]">
                  Select Size
                </h3>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setFilterSize('all')}
                    className={`min-w-12 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${filterSize === 'all'
                        ? 'border-[#202020] bg-[#202020] text-white'
                        : 'border-[#E8E5E0] bg-white text-[#202020] hover:border-[#637666]'
                      }`}
                  >
                    All
                  </button>

                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() =>
                        setFilterSize(
                          filterSize === size ? 'all' : size
                        )
                      }
                      aria-pressed={filterSize === size}
                      className={`min-w-12 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${filterSize === size
                          ? 'border-[#202020] bg-[#202020] text-white'
                          : 'border-[#E8E5E0] bg-white text-[#202020] hover:border-[#637666]'
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-[#202020]">
                  Price Range (₹)
                </h3>

                <div className="mb-3 grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={(event) =>
                      setMinPrice(event.target.value)
                    }
                    placeholder="Min ₹"
                    aria-label="Minimum price"
                    className="h-10 w-full min-w-0 rounded-lg border border-[#E8E5E0] bg-[#F8F7F5] px-3 text-sm outline-none focus:border-[#637666]"
                  />

                  <input
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={(event) =>
                      setMaxPrice(event.target.value)
                    }
                    placeholder="Max ₹"
                    aria-label="Maximum price"
                    className="h-10 w-full min-w-0 rounded-lg border border-[#E8E5E0] bg-[#F8F7F5] px-3 text-sm outline-none focus:border-[#637666]"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {pricePresets.map((preset) => {
                    const selected =
                      minPrice === preset.min &&
                      maxPrice === preset.max;

                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() =>
                          applyPricePreset(
                            preset.min,
                            preset.max
                          )
                        }
                        aria-pressed={selected}
                        className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors ${selected
                            ? 'border-[#637666] bg-[#637666] text-white'
                            : 'border-[#E8E5E0] bg-white text-[#202020] hover:border-[#637666]'
                          }`}
                      >
                        {selected && <Check size={12} />}
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#E8E5E0] pt-4">
              <p className="text-xs text-neutral-500">
                {filteredProducts.length} matching products
              </p>

              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="rounded-full bg-[#202020] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#637666]"
              >
                Show Products
              </button>
            </div>
          </section>
        )}

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="mb-5 flex flex-wrap items-center gap-2 rounded-xl border border-[#E8E5E0] bg-white p-3">
            <span className="mr-1 text-xs font-semibold text-[#202020]">
              Active:
            </span>

            {search.trim() && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="inline-flex items-center gap-1 rounded-full bg-[#F0F0ED] px-3 py-1.5 text-xs text-[#202020]"
              >
                Search: {search}
                <X size={13} />
              </button>
            )}

            {filterFabric !== 'all' && (
              <button
                type="button"
                onClick={() => setFilterFabric('all')}
                className="inline-flex items-center gap-1 rounded-full bg-[#F0F0ED] px-3 py-1.5 text-xs text-[#202020]"
              >
                {filterFabric}
                <X size={13} />
              </button>
            )}

            {filterColor !== 'all' && (
              <button
                type="button"
                onClick={() => setFilterColor('all')}
                className="inline-flex items-center gap-1 rounded-full bg-[#F0F0ED] px-3 py-1.5 text-xs text-[#202020]"
              >
                Color: {filterColor}
                <X size={13} />
              </button>
            )}

            {filterSize !== 'all' && (
              <button
                type="button"
                onClick={() => setFilterSize('all')}
                className="inline-flex items-center gap-1 rounded-full bg-[#F0F0ED] px-3 py-1.5 text-xs text-[#202020]"
              >
                Size: {filterSize}
                <X size={13} />
              </button>
            )}

            {(minPrice !== '' || maxPrice !== '') && (
              <button
                type="button"
                onClick={() => {
                  setMinPrice('');
                  setMaxPrice('');
                }}
                className="inline-flex items-center gap-1 rounded-full bg-[#F0F0ED] px-3 py-1.5 text-xs text-[#202020]"
              >
                {priceRangeLabel}
                <X size={13} />
              </button>
            )}

            {selectedSort !== 'featured' && (
              <button
                type="button"
                onClick={() => setSelectedSort('featured')}
                className="inline-flex items-center gap-1 rounded-full bg-[#F0F0ED] px-3 py-1.5 text-xs text-[#202020]"
              >
                Sort: {selectedSort.replace('-', ' ')}
                <X size={13} />
              </button>
            )}

            <button
              type="button"
              onClick={clearFilters}
              className="ml-auto text-xs font-semibold text-[#637666] underline underline-offset-4 hover:text-[#202020]"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Product Count */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-neutral-600 sm:text-sm">
            Showing{' '}
            <strong className="text-[#202020]">
              {filteredProducts.length}
            </strong>{' '}
            of {categoryProducts.length} products
          </p>

          <span className="text-xs text-neutral-500">
            Prices in INR (₹)
          </span>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <ProductGrid
            products={filteredProducts}
            columns={
              isBoxers || filteredProducts.length === 3
                ? 3
                : 4
            }
          />
        ) : (
          <div className="rounded-2xl border border-[#E8E5E0] bg-white px-6 py-14 text-center sm:rounded-3xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F8F7F5]">
              <PackageSearch
                size={28}
                className="text-[#637666]"
              />
            </div>

            <h2 className="font-display text-2xl font-medium text-[#202020]">
              No Products Found
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-neutral-600">
              {categoryProducts.length === 0
                ? 'There are no products available in this collection yet.'
                : 'Try adjusting your search, size, fabric, or price filters.'}
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-lg bg-[#202020] px-5 py-2.5 text-xs font-semibold text-white hover:bg-black"
              >
                Clear All Filters
              </button>
            )}

            <Link
              to="/"
              className="mt-4 block text-xs font-semibold text-[#637666] underline underline-offset-4"
            >
              Back to Home
            </Link>
          </div>
        )}
      </Container>
    </div>
  );
}
