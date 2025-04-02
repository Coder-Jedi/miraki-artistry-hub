
import { useState, useEffect } from 'react';
import { FilterOptions } from '@/types';

const sortOptionsList = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'priceAsc', label: 'Price: Low to High' },
  { value: 'priceDesc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
];

export const mumbaiAreas = [
  'All Areas',
  'Bandra',
  'Colaba',
  'Dadar',
  'Fort',
  'Juhu',
  'Kala Ghoda',
  'Lower Parel',
  'Malabar Hill',
  'Marine Drive',
  'Powai',
  'Worli',
  'Andheri',
  'Navi Mumbai - Vashi',
  'Navi Mumbai - Belapur',
  'Navi Mumbai - Nerul',
  'Navi Mumbai - Kharghar'
];

const useExploreFilters = () => {
  // Basic filters
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'All',
    searchQuery: '',
    location: 'All Areas'
  });

  // Advanced filters
  const [priceRange, setPriceRangeState] = useState<[number, number]>([0, 5000]);
  const [dateRange, setDateRangeState] = useState<[number, number]>([0, 12]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Sorting
  const [activeSortOption, setActiveSortOption] = useState<string>('newest');

  // Create wrapper functions to handle type conversion
  const setPriceRange = (value: number[]) => {
    setPriceRangeState(value as [number, number]);
  };

  const setDateRange = (value: number[]) => {
    setDateRangeState(value as [number, number]);
  };

  // Toggle advanced filters panel
  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(prev => !prev);
  };

  // Update basic filters
  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Set sort option
  const setSortOption = (option: string) => {
    setActiveSortOption(option);
  };

  // Reset all filters to default values
  const resetAllFilters = () => {
    setFilters({
      category: 'All',
      searchQuery: '',
      location: 'All Areas'
    });
    setPriceRangeState([0, 5000]);
    setDateRangeState([0, 12]);
    setActiveSortOption('newest');
  };

  // Expose the sort options array for UI rendering
  const sortOptions = sortOptionsList;

  return {
    filters,
    updateFilters,
    sortOptions,
    activeSortOption,
    setSortOption,
    priceRange,
    setPriceRange,
    dateRange,
    setDateRange,
    toggleAdvancedFilters,
    showAdvancedFilters,
    resetAllFilters,
    mumbaiAreas
  };
};

export default useExploreFilters;
