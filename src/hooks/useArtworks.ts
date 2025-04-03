
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Artwork, ArtworkCategory, FilterOptions } from '@/types';
import { artwork as artworkData } from '@/data/artworks';

const useArtworks = (limit?: number) => {
  const [artworks, setArtworks] = useState<Artwork[]>(artworkData);
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>(artworkData);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterOptions>({
    category: undefined,
    priceRange: [0, 10000],
    searchTerm: '',
    sortBy: 'default'
  });
  
  const navigate = useNavigate();

  // Apply filters when filters state changes
  useEffect(() => {
    setLoading(true);
    
    const newFilteredArtworks = artworks.filter(artwork => {
      // Filter by category if any
      if (filters.category && artwork.category !== filters.category) {
        return false;
      }
      
      // Filter by price range
      if (
        filters.priceRange && 
        (artwork.price < filters.priceRange[0] || 
         artwork.price > filters.priceRange[1])
      ) {
        return false;
      }
      
      // Filter by search term
      if (filters.searchTerm) {
        const searchTermLower = filters.searchTerm.toLowerCase();
        return (
          artwork.title.toLowerCase().includes(searchTermLower) ||
          artwork.artist.toLowerCase().includes(searchTermLower) ||
          artwork.description.toLowerCase().includes(searchTermLower)
        );
      }
      
      return true;
    });
    
    // Sort the results
    const sortedResults = [...newFilteredArtworks].sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
        case 'oldest':
          return new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime();
        default:
          return 0; // Default sort - keep original order
      }
    });
    
    setFilteredArtworks(sortedResults);
    setLoading(false);
  }, [filters, artworks]);
  
  // Featured artworks - top 4 most recent
  const featuredArtworks = useMemo(() => {
    return [...artworks]
      .sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime())
      .slice(0, 4);
  }, [artworks]);
  
  // Paginated artworks - limit if specified
  const paginatedArtworks = useMemo(() => {
    return limit ? filteredArtworks.slice(0, limit) : filteredArtworks;
  }, [filteredArtworks, limit]);
  
  // Open artwork detail modal
  const viewArtworkDetails = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setModalOpen(true);
  };
  
  // Close artwork detail modal
  const closeArtworkModal = () => {
    setModalOpen(false);
  };
  
  // Navigate to full detail page
  const viewFullDetails = (id: string) => {
    navigate(`/artwork/${id}`);
  };
  
  // Navigate between artworks in modal
  const navigateArtwork = (direction: 'next' | 'prev') => {
    if (!selectedArtwork) return;
    
    const currentIndex = filteredArtworks.findIndex(a => a.id === selectedArtwork.id);
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
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      category: undefined,
      priceRange: [0, 10000],
      searchTerm: '',
      sortBy: 'default'
    });
  };

  return {
    artworks,
    filteredArtworks,
    paginatedArtworks,
    featuredArtworks,
    selectedArtwork,
    modalOpen,
    loading,
    filters,
    viewArtworkDetails,
    closeArtworkModal,
    viewFullDetails,
    navigateArtwork,
    updateFilters,
    resetFilters
  };
};

export default useArtworks;
