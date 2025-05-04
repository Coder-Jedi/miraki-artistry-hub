import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Artwork, ArtworkCategory, FilterOptions } from '@/types';
import { artworkService, ArtworkFilterParams } from '@/services/artworkService';
import { artworksData, getFeaturedArtworks } from '@/data/artworks'; // Keep for fallback

// Number of items to display per page
const ITEMS_PER_PAGE = 8;

const useArtworks = (limit?: number) => {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>([]);
  const [paginatedArtworks, setPaginatedArtworks] = useState<Artwork[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'All',
    searchQuery: '',
    location: 'All Areas'
  });
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [dateRange, setDateRange] = useState<[number, number]>([0, 12]);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [featuredArtworksData, setFeaturedArtworksData] = useState<Artwork[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await artworkService.getCategories();
        if (response.success && response.data?.categories) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch areas
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await artworkService.getAreas();
        if (response.success && response.data?.areas) {
          setAreas(response.data.areas);
        }
      } catch (error) {
        console.error('Error fetching areas:', error);
      }
    };

    fetchAreas();
  }, []);

  // Fetch featured artworks
  useEffect(() => {
    const fetchFeaturedArtworks = async () => {
      try {
        const response = await artworkService.getFeaturedArtworks(limit || 6);
        if (response.success && response.data?.artworks) {
          const mappedArtworks = response.data.artworks.map(artworkService.mapApiArtworkToModel);
          setFeaturedArtworksData(mappedArtworks);
        }
      } catch (error) {
        console.error('Error fetching featured artworks:', error);
        // Use fallback data
        // const fallbackFeatured = getFeaturedArtworks();
        // setFeaturedArtworksData(limit ? fallbackFeatured.slice(0, limit) : fallbackFeatured);
      }
    };

    fetchFeaturedArtworks();
  }, [limit]);

  // Convert UI filters to API parameters
  const getApiParams = (): ArtworkFilterParams => {
    const params: ArtworkFilterParams = {
      page: currentPage,
      limit: limit || ITEMS_PER_PAGE
    };

    // Category filter
    if (filters.category !== 'All') {
      params.category = filters.category;
    }

    // Search query
    if (filters.searchQuery) {
      params.search = filters.searchQuery;
    }

    // Location filter
    if (filters.location !== 'All Areas') {
      params.location = filters.location;
    }

    // Price range
    if (priceRange[0] > 0) {
      params.minPrice = priceRange[0];
    }
    params.maxPrice = priceRange[1];

    // Sort parameters
    switch (sortBy) {
      case 'newest':
        params.sortBy = 'createdAt';
        params.sortOrder = 'desc';
        break;
      case 'price_low':
        params.sortBy = 'price';
        params.sortOrder = 'asc';
        break;
      case 'price_high':
        params.sortBy = 'price';
        params.sortOrder = 'desc';
        break;
      case 'popular':
        params.sortBy = 'likes';
        params.sortOrder = 'desc';
        break;
      default:
        params.sortBy = 'createdAt';
        params.sortOrder = 'desc';
    }

    return params;
  };

  // Fetch artworks with filters applied
  const fetchArtworks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = getApiParams();
      const response = await artworkService.getArtworks(params);
      
      if (response.success && response.data?.items) {
        const mappedArtworks = response.data.items.map(artworkService.mapApiArtworkToModel);
        setFilteredArtworks(mappedArtworks);
        setPaginatedArtworks(mappedArtworks);
        
        // Update total count from API pagination info
        if (response.data.pagination) {
          setTotalCount(response.data.pagination.total);
        }
        
        // Also cache all artworks for local filtering when needed
        if (currentPage === 1 && !filters.category && !filters.searchQuery && !filters.location) {
          setArtworks(mappedArtworks);
        }
      } else {
        // Use fallback data if API doesn't return expected format
        console.warn('API returned unexpected format, using fallback data');
        // setFilteredArtworks(artworksData);
        // setPaginatedArtworks(artworksData.slice(0, limit || ITEMS_PER_PAGE));
      }
    } catch (error) {
      console.error('Error fetching artworks:', error);
      setError('Failed to load artworks. Using sample data instead.');
      // Use fallback data
      // setFilteredArtworks(artworksData);
      // setPaginatedArtworks(artworksData.slice(0, limit || ITEMS_PER_PAGE));
    } finally {
      setLoading(false);
    }
  };

  // Refetch when filters or pagination changes
  useEffect(() => {
    fetchArtworks();
  }, [currentPage, filters, priceRange, sortBy]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(totalCount / (limit || ITEMS_PER_PAGE));
  }, [totalCount, limit]);

  // Page change handler
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of explore section
    const exploreSection = document.getElementById('explore');
    if (exploreSection) {
      exploreSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Navigate to artwork details page
  const viewArtworkDetails = (artwork: Artwork) => {
    navigate(`/artwork/${artwork._id}`);
  };

  // Open modal with selected artwork
  const openArtworkModal = (artwork: Artwork) => {
    // For home page, use modal
    setSelectedArtwork(artwork);
    setModalOpen(true);
  };

  // Close modal
  const closeArtworkModal = () => {
    setModalOpen(false);
    // Small delay before clearing the selected artwork for smooth animations
    setTimeout(() => setSelectedArtwork(null), 300);
  };

  // Navigate to next/prev artwork in modal
  const navigateArtwork = (direction: 'next' | 'prev') => {
    if (!selectedArtwork) return;
    
    const currentIndex = filteredArtworks.findIndex(art => art._id === selectedArtwork._id);
    if (currentIndex === -1) return;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % filteredArtworks.length;
    } else {
      newIndex = (currentIndex - 1 + filteredArtworks.length) % filteredArtworks.length;
    }
    
    setSelectedArtwork(filteredArtworks[newIndex]);
  };

  // Update filters
  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Set price range
  const setActivePriceRange = (range: [number, number]) => {
    setPriceRange(range);
    setCurrentPage(1);
  };

  // Set date range
  const setActiveDateRange = (range: [number, number]) => {
    setDateRange(range);
    setCurrentPage(1);
  };

  // Get a single artwork by ID
  const getArtworkById = async (_id: string): Promise<Artwork | null> => {
    try {
      const response = await artworkService.getArtworkById(_id);
      if (response.success && response.data) {
        return artworkService.mapApiArtworkToModel(response.data);
      }
      return null;
    } catch (error) {
      console.error(`Error fetching artwork with ID ${_id}:`, error);
      // Try to find it in local data as fallback
      return artworksData.find(art => art._id === _id) || null;
    }
  };

  return {
    artworks,
    filteredArtworks,
    paginatedArtworks,
    featuredArtworks: featuredArtworksData,
    loading,
    error,
    filters,
    updateFilters,
    sortBy,
    setSortBy,
    priceRange,
    setActivePriceRange,
    dateRange,
    setActiveDateRange,
    selectedArtwork,
    modalOpen,
    currentPage,
    totalPages,
    totalCount,
    handlePageChange,
    openArtworkModal,
    viewArtworkDetails,
    closeArtworkModal,
    navigateArtwork,
    getArtworkById,
    getCategories: () => categories,
    getAreas: () => areas
  };
};

export default useArtworks;
