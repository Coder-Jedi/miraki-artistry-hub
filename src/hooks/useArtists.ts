import { useState, useEffect, useMemo } from 'react';
import { Artist } from '@/types';
import { artistService } from '@/services/artistService';
import { artistsData, getFeaturedArtists } from '@/data/artists'; // Keep for fallback

const useArtists = (limit?: number) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featuredArtists, setFeaturedArtists] = useState<Artist[]>([]);
  const [allAreas, setAllAreas] = useState<string[]>([]);
  
  // Fetch featured artists from API
  useEffect(() => {
    const fetchFeaturedArtists = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await artistService.getFeaturedArtists(limit);
        
        if (response.success && response.data?.artists) {
          // Map API response to our Artist type
          const mappedArtists = response.data.artists.map(artistService.mapApiArtistToModel);
          
          // Ensure all artists have required properties
          const validatedArtists = mappedArtists.map(artist => {
            // Make sure location exists and has all required fields
            if (!artist.location || 
                typeof artist.location.lat !== 'number' || 
                typeof artist.location.lng !== 'number') {
              console.warn(`Artist ${artist.name} has missing or invalid location data`);
              
              // Ensure there's some location data for mapping (dummy data if missing)
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
                  lng: artist.location.lng || 72.8777 + (Math.random() * 0.1 - 0.05)
                }
              };
            }
            
            // For artists with location but no area, assign to nearest known area
            if (artist.location && !artist.location.area) {
              return {
                ...artist,
                location: {
                  ...artist.location,
                  area: "Bandra" // Default area if not specified
                }
              };
            }
            
            return artist;
          });
          
          setFeaturedArtists(validatedArtists);
          
          // Count artists by area for debugging
          const areaCount: Record<string, number> = {};
          validatedArtists.forEach(artist => {
            const area = artist.location?.area || 'Unknown';
            areaCount[area] = (areaCount[area] || 0) + 1;
          });
          
          console.log("Artists by area:", areaCount);
          
          // Log location validation results
          console.log("Artists with valid locations:", validatedArtists.filter(a => 
            a.location && 
            typeof a.location.lat === 'number' && 
            typeof a.location.lng === 'number' &&
            a.location.area
          ).length);
        } else {
          // Fallback to local data if API response is invalid
          const localArtists = getFeaturedArtists();
          setFeaturedArtists(limit ? localArtists.slice(0, limit) : localArtists);
        }
      } catch (error) {
        console.error('Error fetching featured artists:', error);
        setError('Failed to load artists. Using sample data instead.');
        
        // Fallback to local data
        const localArtists = getFeaturedArtists();
        setFeaturedArtists(limit ? localArtists.slice(0, limit) : localArtists);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeaturedArtists();
  }, [limit]);
  
  // Fetch all artist areas
  useEffect(() => {
    const fetchArtistAreas = async () => {
      try {
        const response = await artistService.getAreas();
        if (response.success && response.data?.areas) {
          setAllAreas(response.data.areas);
        }
      } catch (error) {
        console.error('Error fetching artist areas:', error);
      }
    };
    
    fetchArtistAreas();
  }, []);
  
  // Get artist by ID
  const getArtistById = async (id: string): Promise<Artist | null> => {
    try {
      const response = await artistService.getArtistById(id);
      if (response.success && response.data) {
        return artistService.mapApiArtistToModel(response.data);
      }
      return null;
    } catch (error) {
      console.error(`Error fetching artist with ID ${id}:`, error);
      // Try to find it in local data as fallback
      return artistsData.find(artist => artist.id === id) || null;
    }
  };
  
  // Get artists grouped by area
  const getArtistsByArea = async () => {
    try {
      const response = await artistService.getArtistsByArea();
      if (response.success && response.data?.areas) {
        return response.data.areas;
      }
      return [];
    } catch (error) {
      console.error('Error fetching artists by area:', error);
      return [];
    }
  };

  return {
    featuredArtists,
    loading,
    error,
    allAreas,
    getArtistById,
    getArtistsByArea
  };
};

export default useArtists;
