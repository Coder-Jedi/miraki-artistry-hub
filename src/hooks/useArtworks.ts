
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Artwork, ArtworkCategory, FilterOptions } from '@/types';
import { artworksData, getFeaturedArtworks } from '@/data/artworks';

// Number of items to display per page
const ITEMS_PER_PAGE = 8;

const useArtworks = (limit?: number) => {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState<Artwork[]>(artworksData);
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>(artworksData);
  const [paginatedArtworks, setPaginatedArtworks] = useState<Artwork[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'All',
    searchQuery: '',
  });
  const [sortBy, setSortBy] = useState<string>('newest');
  const [loading, setLoading] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const featuredArtworks = useMemo(() => getFeaturedArtworks(), []);

  // Apply filters and sorting when they change
  useEffect(() => {
    setLoading(true);
    setCurrentPage(1); // Reset to first page when filters change
    
    // Simulate loading delay
    const timer = setTimeout(() => {
      let results = [...artworks];
      
      // Apply category filter
      if (filters.category !== 'All') {
        results = results.filter(artwork => artwork.category === filters.category);
      }
      
      // Apply search filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        results = results.filter(
          artwork =>
            artwork.title.toLowerCase().includes(query) ||
            artwork.artist.toLowerCase().includes(query) ||
            artwork.description.toLowerCase().includes(query)
        );
      }
      
      // Apply sorting
      switch (sortBy) {
        case 'newest':
          results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'oldest':
          results.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          break;
        case 'priceAsc':
          results.sort((a, b) => (a.price || 0) - (b.price || 0));
          break;
        case 'priceDesc':
          results.sort((a, b) => (b.price || 0) - (a.price || 0));
          break;
        case 'popular':
          // For demo purposes, let's assume featured artworks are more popular
          results.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
          break;
        default:
          break;
      }
      
      setFilteredArtworks(results);
      setLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [filters, artworks, sortBy]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredArtworks.length / (limit || ITEMS_PER_PAGE));
  }, [filteredArtworks, limit]);

  // Update paginated results when filtered artworks or page changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * (limit || ITEMS_PER_PAGE);
    const endIndex = startIndex + (limit || ITEMS_PER_PAGE);
    setPaginatedArtworks(filteredArtworks.slice(startIndex, endIndex));
  }, [filteredArtworks, currentPage, limit]);

  // Page change handler
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of explore section
    const exploreSection = document.getElementById('explore');
    if (exploreSection) {
      exploreSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Open modal with selected artwork
  const openArtworkModal = (artwork: Artwork) => {
    // For home page, use modal
    setSelectedArtwork(artwork);
    setModalOpen(true);
  };

  // Navigate to artwork details page
  const viewArtworkDetails = (artwork: Artwork) => {
    navigate(`/artwork/${artwork.id}`);
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
    
    const currentIndex = filteredArtworks.findIndex(art => art.id === selectedArtwork.id);
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
  };

  return {
    artworks,
    filteredArtworks,
    paginatedArtworks,
    featuredArtworks,
    loading,
    filters,
    updateFilters,
    sortBy,
    setSortBy,
    selectedArtwork,
    modalOpen,
    currentPage,
    totalPages,
    handlePageChange,
    openArtworkModal,
    viewArtworkDetails,
    closeArtworkModal,
    navigateArtwork,
  };
};

export default useArtworks;
