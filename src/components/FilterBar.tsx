
import React from 'react';
import { Search } from 'lucide-react';
import { ArtworkCategory, FilterOptions } from '@/types';
import { artworkCategories } from '@/data/artworks';

interface FilterBarProps {
  filters: FilterOptions;
  updateFilters: (filters: Partial<FilterOptions>) => void;
  totalArtworks: number;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  filters, 
  updateFilters,
  totalArtworks
}) => {
  const handleCategoryChange = (category: ArtworkCategory) => {
    updateFilters({ category });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ searchQuery: e.target.value });
  };

  return (
    <div className="sticky top-20 z-30 bg-white/80 dark:bg-mirakiBlue-900/80 backdrop-blur-md py-4 border-b border-mirakiGray-200 dark:border-mirakiBlue-700">
      <div className="container-fluid">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-mirakiBlue-800 dark:text-mirakiGray-200">
            <h3 className="font-medium">Browse</h3>
            <span className="text-sm text-mirakiBlue-600 dark:text-mirakiGray-400">
              {totalArtworks} {totalArtworks === 1 ? 'artwork' : 'artworks'} found
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Categories Filter */}
            <div className="flex flex-wrap gap-2">
              {artworkCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 text-sm rounded-full transition-colors duration-300 ${
                    filters.category === category
                      ? 'bg-mirakiBlue-900 text-white dark:bg-mirakiGold dark:text-mirakiBlue-900'
                      : 'bg-mirakiGray-200 text-mirakiBlue-700 hover:bg-mirakiGray-300 dark:bg-mirakiBlue-800 dark:text-mirakiGray-200 dark:hover:bg-mirakiBlue-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="relative min-w-[200px]">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-mirakiBlue-400 dark:text-mirakiGray-500" />
              </div>
              <input
                type="text"
                value={filters.searchQuery}
                onChange={handleSearchChange}
                placeholder="Search artworks..."
                className="w-full pl-10 pr-4 py-2 bg-mirakiGray-100 dark:bg-mirakiBlue-800 border border-mirakiGray-200 dark:border-mirakiBlue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-mirakiBlue-500 dark:focus:ring-mirakiGold text-mirakiBlue-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
