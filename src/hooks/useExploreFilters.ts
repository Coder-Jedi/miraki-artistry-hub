import { useState, useEffect } from 'react';
import { FilterOptions } from '@/types';
import { artworkService } from '@/services/artworkService';

const sortOptionsList = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
];

// Fallback areas if API fails
const defaultMumbaiAreas = [
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
  'Navi Mumbai'
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

  // Dynamic data from API
  const [categories, setCategories] = useState<string[]>([]);
  const [mumbaiAreas, setMumbaiAreas] = useState<string[]>(['All Areas']);

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await artworkService.getCategories();
        if (response.success && response.data?.categories) {
          // 'All' will come directly from the API
          setCategories([...response.data.categories]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Set default categories if API fails
        setCategories(['All', 'Painting', 'Sculpture', 'Photography', 'Digital', 'Mixed Media', 'Ceramics', 'Illustration', 'Other']);
      }
    };

    fetchCategories();
  }, []);

  // Fetch areas from the API
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await artworkService.getAreas();
        if (response.success && response.data?.areas) {
          // Add 'All Areas' as the first option
          setMumbaiAreas(['All Areas', ...response.data.areas]);
        } else {
          setMumbaiAreas(defaultMumbaiAreas);
        }
      } catch (error) {
        console.error('Error fetching areas:', error);
        setMumbaiAreas(defaultMumbaiAreas);
      }
    };

    fetchAreas();
  }, []);

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
    mumbaiAreas,
    categories
  };
};

export default useExploreFilters;
