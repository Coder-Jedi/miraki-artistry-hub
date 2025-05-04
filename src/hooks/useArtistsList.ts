// filepath: /Users/hritik.madankar/Projects/miraki-artistry-hub/src/hooks/useArtistsList.ts
import { useState, useEffect, useMemo } from 'react';
import { Artist } from '@/types';
import { artistService, ArtistFilterParams } from '@/services/artistService';
import { artistsData } from '@/data/artists'; // Keep for fallback

// Define interface for artist filters
export interface ArtistsFilter {
  searchQuery: string;
  location: string;
  popularityRange: [number, number];
  sortBy: string;
  page: number;
  limit: number;
}

// Default filters
const defaultFilters: ArtistsFilter = {
  searchQuery: '',
  location: 'All Areas',
  popularityRange: [0, 5],
  sortBy: 'popularity',
  page: 1,
  limit: 9
};

const useArtistsList = (initialFilters?: Partial<ArtistsFilter>) => {
  // Merge default filters with any provided initial filters
  const [filters, setFilters] = useState<ArtistsFilter>({
    ...defaultFilters,
    ...initialFilters
  });
  
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [areas, setAreas] = useState<string[]>(['All Areas']);
  
  // Convert UI filters to API parameters
  const getApiParams = (): ArtistFilterParams => {
    const params: ArtistFilterParams = {
      page: filters.page,
      limit: filters.limit
    };

    // Search query
    if (filters.searchQuery) {
      params.search = filters.searchQuery;
    }

    // Location filter
    if (filters.location !== 'All Areas') {
      params.location = filters.location;
    }

    // Sort parameters
    switch (filters.sortBy) {
      case 'popularity':
        params.sortBy = 'popularity';
        params.sortOrder = 'desc';
        break;
      case 'name_asc':
        params.sortBy = 'name';
        params.sortOrder = 'asc';
        break;
      case 'name_desc':
        params.sortBy = 'name';
        params.sortOrder = 'desc';
        break;
      case 'artwork_count':
        // Might not be directly supported by API, fallback to popularity
        params.sortBy = 'popularity';
        params.sortOrder = 'desc';
        break;
      default:
        params.sortBy = 'popularity';
        params.sortOrder = 'desc';
    }

    return params;
  };

  // Fetch areas for filtering
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await artistService.getAreas();
        if (response.success && response.data?.areas) {
          const areaNames = ['All Areas', ...response.data.areas];
          setAreas(areaNames);
        } else {
          // Fallback to getArtistsByArea if getAreas fails
          const fallbackResponse = await artistService.getArtistsByArea();
          if (fallbackResponse.success && fallbackResponse.data?.areas) {
            const areaNames = ['All Areas', ...fallbackResponse.data.areas.map((area: any) => area.name)];
            setAreas(areaNames);
          }
        }
      } catch (error) {
        console.error('Error fetching artist areas:', error);
      }
    };
    
    fetchAreas();
  }, []);

  // Main fetch function for artists list
  const fetchArtists = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = getApiParams();
      const response = await artistService.getArtists(params);

      if (response.success && response.data) {
        // Map API artists to our Artist type
        const mappedArtists = response.data.items.map((artist: any) => 
          artistService.mapApiArtistToModel(artist)
        );
        
        // Filter out artists without location if needed for the map view
        const validatedArtists = mappedArtists.map((artist: Artist) => {
          // Ensure location data for mapping if missing
          if (!artist.location || 
              typeof artist.location.lat !== 'number' || 
              typeof artist.location.lng !== 'number') {
            
            // Add dummy location if completely missing
            if (!artist.location) {
              return {
                ...artist,
                location: {
                  lat: 19.0760 + (Math.random() * 0.1 - 0.05), // Random around Mumbai
                  lng: 72.8777 + (Math.random() * 0.1 - 0.05),
                  address: "Mumbai, India",
                  area: "Bandra" // Default area
                }
              };
            }
            
            // Fix specific missing coordinates
            return {
              ...artist,
              location: {
                ...artist.location,
                lat: artist.location.lat || 19.0760 + (Math.random() * 0.1 - 0.05),
                lng: artist.location.lng || 72.8777 + (Math.random() * 0.1 - 0.05),
                area: artist.location.area || "Mumbai"
              }
            };
          }
          
          return artist;
        });
        
        setArtists(validatedArtists);
        
        // Update pagination info
        if (response.data.pagination) {
          setTotalCount(response.data.pagination.total);
          setTotalPages(response.data.pagination.pages);
        }
      } else {
        console.warn('API returned unexpected format, using fallback data');
        // Use fallback data
        // setArtists(artistsData.slice(0, filters.limit));
        // setTotalCount(artistsData.length);
        // setTotalPages(Math.ceil(artistsData.length / filters.limit));
      }
    } catch (error) {
      console.error('Error fetching artists:', error);
      setError('Failed to load artists. Using sample data instead.');
      
      // Use fallback data
    //   setArtists(artistsData.slice(0, filters.limit));
    //   setTotalCount(artistsData.length);
    //   setTotalPages(Math.ceil(artistsData.length / filters.limit));
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch artists when filters change
  useEffect(() => {
    fetchArtists();
  }, [
    filters.page,
    filters.limit,
    filters.searchQuery,
    filters.location,
    filters.sortBy
  ]);
  
  // Filter artists with popularity filter client-side (since API might not support it directly)
  const filteredArtists = useMemo(() => {
    // We need client-side filtering for popularity range since API might not support it
    return artists.filter(artist => {
      const rating = artist.popularity || 0;
      return rating >= filters.popularityRange[0] && rating <= filters.popularityRange[1];
    });
  }, [artists, filters.popularityRange]);
  
  // Handler for updating filters
  const updateFilters = (newFilters: Partial<ArtistsFilter>) => {
    // If page isn't explicitly set but other filters change, reset to page 1
    if (!newFilters.page && (
      newFilters.searchQuery !== undefined ||
      newFilters.location !== undefined ||
      newFilters.sortBy !== undefined
    )) {
      newFilters.page = 1;
    }
    
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Reset all filters
  const resetAllFilters = () => {
    setFilters(defaultFilters);
  };

  // Set the current page
  const setPage = (page: number) => {
    updateFilters({ page });
  };

  return {
    artists: filteredArtists,
    loading,
    error,
    filters,
    updateFilters,
    resetAllFilters,
    areas,
    pagination: {
      currentPage: filters.page,
      totalPages,
      totalCount,
      setPage
    }
  };
};

export default useArtistsList;