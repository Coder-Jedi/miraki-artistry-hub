
import { useState, useEffect, useMemo } from 'react';
import { Artist } from '@/types';
import { artistsData, getFeaturedArtists } from '@/data/artists';

const useArtists = (limit?: number) => {
  const [loading, setLoading] = useState(true);
  
  // Use the artists data from our data source with improved location handling
  const featuredArtists = useMemo(() => {
    console.log("Artists data in hook:", artistsData.length);
    
    // Get featured artists
    let artists = getFeaturedArtists();

    // Verify all artists have location data (important for map display)
    artists = artists.map(artist => {
      // Make sure location exists and has all required fields
      if (!artist.location || 
          typeof artist.location.lat !== 'number' || 
          typeof artist.location.lng !== 'number') {
        console.warn(`Artist ${artist.name} has missing or invalid location data`);
        
        // Ensure there's some location data for mapping (dummy data if missing)
        if (!artist.location) {
          // Add dummy location in Mumbai if completely missing
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
        if (typeof artist.location.lat !== 'number' || typeof artist.location.lng !== 'number') {
          return {
            ...artist,
            location: {
              ...artist.location,
              lat: artist.location.lat || 19.0760 + (Math.random() * 0.1 - 0.05),
              lng: artist.location.lng || 72.8777 + (Math.random() * 0.1 - 0.05)
            }
          };
        }
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
    
    // Count artists by area for debugging
    const areaCount: Record<string, number> = {};
    artists.forEach(artist => {
      const area = artist.location?.area || 'Unknown';
      areaCount[area] = (areaCount[area] || 0) + 1;
    });
    
    console.log("Artists by area:", areaCount);
    
    // Log location validation results
    console.log("Artists with valid locations:", artists.filter(a => 
      a.location && 
      typeof a.location.lat === 'number' && 
      typeof a.location.lng === 'number' &&
      a.location.area
    ).length);
    
    return limit ? artists.slice(0, limit) : artists;
  }, [limit]);

  // Simulate loading state for data fetching
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return {
    featuredArtists,
    loading
  };
};

export default useArtists;
