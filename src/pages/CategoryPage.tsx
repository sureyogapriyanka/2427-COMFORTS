
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronRight,
  SlidersHorizontal,
  Info,
  Search,
  X,
  RotateCcw,
  ChevronDown,
  PackageSearch,
} from 'lucide-react';

import { Container } from '../components/ui/Container';
import { ProductGrid } from '../components/product/ProductGrid';
import {
  PRODUCTS,
  MEN_CATEGORIES,
  WOMEN_CATEGORIES,
} from '../data/catalog';
import { DemoBadge } from '../components/brand/DemoBadge';

type SortOption =
  | 'featured'
  | 'price-low'
  | 'price-high'
  | 'rating';

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();

  const [search, setSearch] = useState('');
  const [selectedSort, setSelectedSort] =
    useState<SortOption>('featured');

  const [filterFabric, setFilterFabric] =
    useState('all');

  const [filterSize, setFilterSize] =
    useState('all');

  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const [showFilters, setShowFilters] =
    useState(false);

  const allCategories = [
    ...MEN_CATEGORIES,
    ...WOMEN_CATEGORIES,
  ];

  const matchedCategory = allCategories.find(
    (category) => category.slug === slug
  );

  // Products belonging to the current collection
  const categoryProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      if (slug === 'new-arrivals') {
        return (
          product.badge === 'New' ||
          product.category === 'new-arrivals'
        );
      }

      if (slug === 'bestsellers') {
        return product.badge === 'Bestseller';
      }

      if (slug === 'bundles') {
        return product.category === 'bundles';
      }

      if (slug === 'offers') {
        return (
          product.compareAt != null &&
          product.compareAt > product.price
        );
      }

      return product.category === slug;
    });
  }, [slug]);

  // Reset filters when changing collections
  useEffect(() => {
    setSearch('');
    setSelectedSort('featured');
    setFilterFabric('all');
    setFilterSize('all');
    setMinPrice('');
    setMaxPrice('');
    setShowFilters(false);
  }, [slug]);

  const availableFabrics = useMemo(() => {
    return Array.from(
      new Set(
        categoryProducts
          .map((product) => product.fabricBadge)
          .filter(Boolean)
      )
    );
  }, [categoryProducts]);

  const availableSizes = useMemo(() => {
    return Array.from(
      new Set(
        categoryProducts.flatMap(
          (product) => product.sizes
        )
      )
    );
  }, [categoryProducts]);

  const filteredProducts = useMemo(() => {
    let results = [...categoryProducts];

    const query = search.trim().toLowerCase();

    // Live search
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

    // Fabric
    if (filterFabric !== 'all') {
      results = results.filter(
        (product) =>
          product.fabricBadge.toLowerCase() ===
          filterFabric.toLowerCase()
      );
    }

    // Size
    if (filterSize !== 'all') {
      results = results.filter((product) =>
        product.sizes.includes(filterSize)
      );
    }

    // Minimum price
    if (minPrice.trim() !== '') {
      const minimum = Number(minPrice);

      if (Number.isFinite(minimum) && minimum >= 0) {
        results = results.filter(
          (product) => product.price >= minimum
        );
      }
    }

    // Maximum price
    if (maxPrice.trim() !== '') {
      const maximum = Number(maxPrice);

      if (Number.isFinite(maximum) && maximum >= 0) {
        results = results.filter(
          (product) => product.price <= maximum
        );
      }
    }

    // Sorting
    if (selectedSort === 'price-low') {
      results.sort((a, b) => a.price - b.price);
    }

    if (selectedSort === 'price-high') {
      results.sort((a, b) => b.price - a.price);
    }

    if (selectedSort === 'rating') {
      results.sort(
        (a, b) =>
          (b.rating || 0) - (a.rating || 0)
      );
    }

    return results;
  }, [
    categoryProducts,
    search,
    filterFabric,
    filterSize,
    minPrice,
    maxPrice,
    selectedSort,
  ]);

  const clearFilters = () => {
    setSearch('');
    setSelectedSort('featured');
    setFilterFabric('all');
    setFilterSize('all');
    setMinPrice('');
    setMaxPrice('');
  };

  const hasActiveFilters =
    search.trim() !== '' ||
    filterFabric !== 'all' ||
    filterSize !== 'all' ||
    minPrice !== '' ||
    maxPrice !== '' ||
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
            : 'Collection';

  const description = matchedCategory
    ? matchedCategory.description
    : 'Discover everyday essentials designed for comfort and confidence.';

  const isBoxers = slug === 'men-boxers';

  const collectionLabel =
    matchedCategory?.gender === 'men'
      ? "Men's Collection"
      : matchedCategory?.gender === 'women'
        ? "Women's Collection"
        : '2427 Collection';

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 sm:py-14">
      <Container>

        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-7 flex flex-wrap items-center gap-2 text-xs text-[#77736E]"
        >
          <Link
            to="/"
            className="transition-colors hover:text-[#1F2022]"
          >
            Home
          </Link>

          <ChevronRight size={13} />

          <span className="font-medium text-[#1F2022]">
            {title}
          </span>
        </nav>

        {/* Collection Header */}
        <section className="mb-8 overflow-hidden rounded-3xl border border-[#E8E1D7] bg-white">
          <div className="relative px-6 py-9 sm:px-10 sm:py-12">
            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#F2F4EF]" />

            <div className="relative">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#637666]">
                  {collectionLabel}
                </span>

                <DemoBadge variant="pill" />
              </div>

              <h1 className="font-display text-4xl font-medium leading-tight text-[#1F2022] sm:text-5xl">
                {title}
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#77736E] sm:text-base">
                {description}
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#F2F4EF] px-4 py-2 text-xs font-semibold text-[#637666]">
                <PackageSearch size={15} />
                {filteredProducts.length}{' '}
                {filteredProducts.length === 1
                  ? 'product'
                  : 'products'}{' '}
                found
              </div>
            </div>
          </div>

          {isBoxers && (
            <div className="flex items-start gap-3 border-t border-[#E8E1D7] bg-[#F8F6F2] px-6 py-4 text-xs leading-5 text-[#77736E] sm:px-10">
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

        {/* Search and Sort */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={19}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#77736E]"
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search products in this collection..."
              aria-label="Search products"
              className="h-12 w-full rounded-xl border border-[#E8E1D7] bg-white pl-12 pr-4 text-sm text-[#1F2022] outline-none transition-colors placeholder:text-[#99938B] focus:border-[#637666]"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() =>
                setShowFilters((previous) => !previous)
              }
              aria-expanded={showFilters}
              aria-controls="collection-filters"
              className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border px-5 text-sm font-semibold transition-colors sm:flex-none ${showFilters
                  ? 'border-[#1F2022] bg-[#1F2022] text-white'
                  : 'border-[#E8E1D7] bg-white text-[#1F2022] hover:border-[#637666]'
                }`}
            >
              <SlidersHorizontal size={17} />
              Filters
              <ChevronDown
                size={15}
                className={`transition-transform ${showFilters ? 'rotate-180' : ''
                  }`}
              />
            </button>

            <select
              value={selectedSort}
              onChange={(event) =>
                setSelectedSort(
                  event.target.value as SortOption
                )
              }
              aria-label="Sort products"
              className="h-12 min-w-0 flex-1 rounded-xl border border-[#E8E1D7] bg-white px-3 text-xs font-medium text-[#1F2022] outline-none focus:border-[#637666] sm:flex-none sm:text-sm"
            >
              <option value="featured">Featured</option>
              <option value="price-low">
                Price: Low to High
              </option>
              <option value="price-high">
                Price: High to Low
              </option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div
            id="collection-filters"
            className="mb-7 rounded-2xl border border-[#E8E1D7] bg-white p-5 sm:p-7"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl font-medium text-[#1F2022]">
                Refine Your Selection
              </h2>

              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#637666] hover:text-[#1F2022]"
              >
                <RotateCcw size={14} />
                Clear All
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">

              {/* Fabric */}
              <div>
                <label
                  htmlFor="fabric-filter"
                  className="mb-2 block text-xs font-semibold text-[#1F2022]"
                >
                  Fabric / Style
                </label>

                <select
                  id="fabric-filter"
                  value={filterFabric}
                  onChange={(event) =>
                    setFilterFabric(event.target.value)
                  }
                  className="h-11 w-full rounded-xl border border-[#E8E1D7] bg-[#FAF8F5] px-3 text-sm text-[#1F2022] outline-none focus:border-[#637666]"
                >
                  <option value="all">All Styles</option>

                  {availableFabrics.map((fabric) => (
                    <option key={fabric} value={fabric}>
                      {fabric}
                    </option>
                  ))}
                </select>
              </div>

              {/* Size */}
              <div>
                <label
                  htmlFor="size-filter"
                  className="mb-2 block text-xs font-semibold text-[#1F2022]"
                >
                  Available Size
                </label>

                <select
                  id="size-filter"
                  value={filterSize}
                  onChange={(event) =>
                    setFilterSize(event.target.value)
                  }
                  className="h-11 w-full rounded-xl border border-[#E8E1D7] bg-[#FAF8F5] px-3 text-sm text-[#1F2022] outline-none focus:border-[#637666]"
                >
                  <option value="all">All Sizes</option>

                  {availableSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-[#1F2022]">
                  Price Range (₹)
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={(event) =>
                      setMinPrice(event.target.value)
                    }
                    placeholder="Min"
                    aria-label="Minimum price"
                    className="h-11 min-w-0 w-full rounded-xl border border-[#E8E1D7] bg-[#FAF8F5] px-3 text-sm text-[#1F2022] outline-none focus:border-[#637666]"
                  />

                  <input
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={(event) =>
                      setMaxPrice(event.target.value)
                    }
                    placeholder="Max"
                    aria-label="Maximum price"
                    className="h-11 min-w-0 w-full rounded-xl border border-[#E8E1D7] bg-[#FAF8F5] px-3 text-sm text-[#1F2022] outline-none focus:border-[#637666]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Filter Bar */}
        {hasActiveFilters && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E8E1D7] bg-white px-4 py-3">
            <span className="text-xs font-medium text-[#77736E]">
              Showing {filteredProducts.length} matching{' '}
              {filteredProducts.length === 1
                ? 'product'
                : 'products'}
            </span>

            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#637666] hover:text-[#1F2022]"
            >
              <X size={14} />
              Reset Filters
            </button>
          </div>
        )}

        {/* Products */}
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
          <div className="rounded-3xl border border-[#E8E1D7] bg-white px-6 py-16 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#F2F4EF]">
              <PackageSearch
                size={32}
                className="text-[#637666]"
              />
            </div>

            <h2 className="font-display text-2xl font-medium text-[#1F2022]">
              No Products Found
            </h2>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#77736E]">
              {categoryProducts.length === 0
                ? 'There are no products available in this collection yet.'
                : 'Try another search, size, fabric, or price range.'}
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-[#1F2022] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#34373C]"
              >
                Clear All Filters
              </button>
            )}

            <Link
              to="/"
              className="mt-5 block text-xs font-semibold text-[#637666] underline underline-offset-4"
            >
              Back to Home
            </Link>
          </div>
        )}
      </Container>
    </div>
  );
}
