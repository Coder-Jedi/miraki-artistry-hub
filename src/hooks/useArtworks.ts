
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Artwork, ArtworkCategory, FilterOptions } from '@/types';
import { artworksData, getFeaturedArtworks } from '@/data/artworks';

// Number of items to display per page
const ITEMS_PER_PAGE = 8;

const useArtworks = () => {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState<Artwork[]>(artworksData);
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>(artworksData);
  const [paginatedArtworks, setPaginatedArtworks] = useState<Artwork[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'All',
    searchQuery: '',
  });
  const [loading, setLoading] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const featuredArtworks = useMemo(() => getFeaturedArtworks(), []);

  // Apply filters when they change
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
      
      setFilteredArtworks(results);
      setLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [filters, artworks]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredArtworks.length / ITEMS_PER_PAGE);
  }, [filteredArtworks]);

  // Update paginated results when filtered artworks or page changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setPaginatedArtworks(filteredArtworks.slice(startIndex, endIndex));
  }, [filteredArtworks, currentPage]);

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
