
import { useState, useEffect, useMemo } from 'react';
import { Artist } from '@/types';
import { artistsData, getFeaturedArtists } from '@/data/artists';

const useArtists = (limit?: number) => {
  const [loading, setLoading] = useState(true);
  
  // Use the artists data from our data source
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
      }
      return artist;
    });
    
    // Explicitly log location data for debugging
    console.log("Featured artists with locations:", artists.filter(a => 
      a.location && 
      typeof a.location.lat === 'number' && 
      typeof a.location.lng === 'number'
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
