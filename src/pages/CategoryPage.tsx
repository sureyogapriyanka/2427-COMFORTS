import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, SlidersHorizontal, ChevronRight, Info } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { ProductGrid } from '../components/product/ProductGrid';
import { PRODUCTS, MEN_CATEGORIES, WOMEN_CATEGORIES } from '../data/catalog';
import { DemoBadge } from '../components/brand/DemoBadge';

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [selectedSort, setSelectedSort] = useState<'featured' | 'price-low' | 'price-high'>('featured');
  const [filterFabric, setFilterFabric] = useState<string>('all');

  // Find category metadata
  const allCategories = [...MEN_CATEGORIES, ...WOMEN_CATEGORIES];
  const matchedCategory = allCategories.find((c) => c.slug === slug);

  // Derive products for this view
  const categoryProducts = PRODUCTS.filter((p) => {
    if (slug === 'new-arrivals') return p.badge === 'New' || p.category === 'new-arrivals';
    if (slug === 'bestsellers') return p.badge === 'Bestseller';
    if (slug === 'bundles') return p.category === 'bundles';
    if (slug === 'offers') return p.compareAt && p.compareAt > p.price;
    return p.category === slug;
  });

  const baseList = categoryProducts.length > 0 ? categoryProducts : PRODUCTS;

  // Extract available fabric badges dynamically
  const availableFabrics = Array.from(new Set(baseList.map((p) => p.fabricBadge)));

  // Fabric filter
  let filtered = baseList;
  if (filterFabric !== 'all') {
    filtered = filtered.filter((p) => p.fabricBadge.toLowerCase() === filterFabric.toLowerCase());
  }

  // Sort
  if (selectedSort === 'price-low') {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (selectedSort === 'price-high') {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  }

  // Title and description
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
    : 'Discover second-skin comfort, wire-free contours, and botanical breathability.';

  const isBoxers = slug === 'men-boxers';

  return (
    <div className="py-10 sm:py-16 bg-[#FAF8F5] min-h-screen">
      <Container>
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-[#6B6F76] mb-6">
          <Link to="/" className="hover:text-[#1F2022] transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link
            to={matchedCategory?.gender === 'women' ? '/category/women-bras' : '/category/men-underwear'}
            className="hover:text-[#1F2022] transition-colors"
          >
            {matchedCategory?.gender === 'women' ? 'Women' : 'Men'}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[#1F2022] font-semibold capitalize">
            {title}
          </span>
        </div>

        {/* Header Banner */}
        <div className="rounded-3xl bg-white border border-[#E8E1D7] p-8 sm:p-12 mb-10 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="eyebrow text-[#637666]">
                  {matchedCategory?.gender === 'men'
                    ? "Men's Collection"
                    : matchedCategory?.gender === 'women'
                    ? "Women's Collection"
                    : '2427 Collection'}
                </span>
                <DemoBadge variant="pill" />
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-medium text-[#1F2022]">
                {title}
              </h1>
              <p className="mt-3 text-sm sm:text-base text-[#5E6064] leading-relaxed">
                {description}
              </p>
            </div>

            <div className="text-xs text-[#6B6F76] shrink-0 font-numeral">
              Showing <strong>{filtered.length}</strong> {filtered.length === 1 ? 'style' : 'styles'}
            </div>
          </div>

          {/* Client Catalogue Reference Notice for Boxers */}
          {isBoxers && (
            <div className="mt-6 flex items-center gap-2 rounded-xl bg-[#F4EFEB] p-3 text-xs text-[#5E6064] border border-[#E8E1D7]">
              <Info className="h-4 w-4 text-[#637666] shrink-0" />
              <span>
                <strong>Client Catalogue Reference:</strong> Displaying all 3 proposed boxer models (Airbox M-BX01, PrintPlay M-BX02, Lounge Flex M-BX03). Sample pricing and imagery for demonstration.
              </span>
            </div>
          )}

          {/* Filter and Sort Toolbar */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#E8E1D7] pt-6">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
              <span className="font-semibold text-[#1F2022] flex items-center gap-1">
                <SlidersHorizontal className="h-3.5 w-3.5 text-[#637666]" />
                <span>Style / Knit:</span>
              </span>
              <button
                type="button"
                onClick={() => setFilterFabric('all')}
                className={`rounded-full px-3.5 py-1.5 font-medium transition-all ${
                  filterFabric === 'all'
                    ? 'bg-[#1F2022] text-white shadow-xs'
                    : 'bg-[#F4EFEB] text-[#6B6F76] hover:bg-[#E8E1D7]'
                }`}
              >
                All Styles
              </button>
              {availableFabrics.map((badge) => (
                <button
                  key={badge}
                  type="button"
                  onClick={() => setFilterFabric(badge)}
                  className={`rounded-full px-3.5 py-1.5 font-medium transition-all ${
                    filterFabric.toLowerCase() === badge.toLowerCase()
                      ? 'bg-[#1F2022] text-white shadow-xs'
                      : 'bg-[#F4EFEB] text-[#6B6F76] hover:bg-[#E8E1D7]'
                  }`}
                >
                  {badge}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#6B6F76]">Sort By:</span>
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value as any)}
                className="rounded-lg border border-[#E8E1D7] bg-white px-3 py-1.5 text-xs text-[#1F2022] outline-hidden focus:border-[#637666]"
              >
                <option value="featured">Featured Order</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid: 3 columns on desktop for boxers, responsive on mobile */}
        <ProductGrid
          products={filtered}
          columns={isBoxers || filtered.length === 3 ? 3 : 4}
        />
      </Container>
    </div>
  );
}
