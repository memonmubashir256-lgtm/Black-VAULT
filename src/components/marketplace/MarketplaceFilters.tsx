import React from 'react';
import { Search, SlidersHorizontal, LayoutGrid, List, X, RotateCcw } from 'lucide-react';
import { ProductCategory } from '../../types';

interface MarketplaceFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  onSortChange: (sort: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest') => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  maxPrice: number;
  onMaxPriceChange: (val: number) => void;
  onResetFilters: () => void;
  categories: ProductCategory[];
  totalResults: number;
}

export const MarketplaceFilters: React.FC<MarketplaceFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  maxPrice,
  onMaxPriceChange,
  onResetFilters,
  categories,
  totalResults,
}) => {
  const isFiltered =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All' ||
    sortBy !== 'featured' ||
    maxPrice < 600;

  return (
    <div className="bg-[#0B1010] border border-[#00FF88]/20 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
      {/* Top Search & Controls Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#728078]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search digital assets, shaders, 3D models, or keywords..."
            className="w-full bg-[#050607] border border-[#00FF88]/30 rounded-xl pl-10 pr-9 py-2.5 font-mono text-xs text-[#E5F5EC] placeholder:text-[#728078] focus:outline-none focus:border-[#00FF88] focus:neon-glow-green transition-all"
            aria-label="Search marketplace assets"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#728078] hover:text-[#00FF88] cursor-pointer"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort & View Mode Switches */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#050607] border border-[#00FF88]/30 rounded-xl px-3 py-1.5 font-mono text-xs text-[#E5F5EC]">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#00FF88]" />
            <span className="text-[10px] text-[#728078] hidden sm:inline">SORT:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="bg-transparent text-[#00FF88] focus:outline-none cursor-pointer text-xs"
              aria-label="Sort products by"
            >
              <option value="featured" className="bg-[#0B1010] text-[#E5F5EC]">
                Featured First
              </option>
              <option value="price-asc" className="bg-[#0B1010] text-[#E5F5EC]">
                Price: Low to High
              </option>
              <option value="price-desc" className="bg-[#0B1010] text-[#E5F5EC]">
                Price: High to Low
              </option>
              <option value="rating" className="bg-[#0B1010] text-[#E5F5EC]">
                Highest Rating
              </option>
              <option value="newest" className="bg-[#0B1010] text-[#E5F5EC]">
                Newest Arrivals
              </option>
            </select>
          </div>

          {/* Max Price Slider */}
          <div className="flex items-center gap-2 bg-[#050607] border border-[#00FF88]/30 rounded-xl px-3 py-1.5 font-mono text-xs text-[#E5F5EC]">
            <span className="text-[10px] text-[#728078]">&lt;= {maxPrice} BVT</span>
            <input
              type="range"
              min="50"
              max="600"
              step="25"
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(Number(e.target.value))}
              className="w-16 sm:w-24 accent-[#00FF88] cursor-pointer"
              aria-label="Filter maximum price in BVT"
            />
          </div>

          {/* Grid / List Mode */}
          <div className="flex items-center bg-[#050607] border border-[#00FF88]/30 rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#003B27] text-[#00FF88]'
                  : 'text-[#728078] hover:text-[#E5F5EC]'
              }`}
              aria-label="Grid layout"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-[#003B27] text-[#00FF88]'
                  : 'text-[#728078] hover:text-[#E5F5EC]'
              }`}
              aria-label="List layout"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              type="button"
              onClick={onResetFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-[#FF304F]/40 bg-[#FF304F]/10 text-[#FF304F] hover:bg-[#FF304F]/20 font-mono text-xs cursor-pointer transition-colors"
              title="Reset all filters"
              aria-label="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs whitespace-nowrap uppercase tracking-wider transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#00FF88] text-black font-bold shadow-[0_0_12px_rgba(0,255,136,0.35)]'
                  : 'bg-[#050607] text-[#728078] hover:text-[#E5F5EC] hover:bg-[#003B27]/40 border border-[#00FF88]/20'
              }`}
              aria-label={`Filter by category ${cat}`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Results Count & Active Category Indicator */}
      <div className="flex items-center justify-between font-mono text-[11px] text-[#728078] pt-1">
        <span>
          SHOWING <strong className="text-[#00FF88]">{totalResults}</strong> SIMULATED LISTINGS
        </span>
        <span className="text-[10px]">
          ACTIVE CATEGORY: <strong className="text-[#E5F5EC]">{selectedCategory.toUpperCase()}</strong>
        </span>
      </div>
    </div>
  );
};
