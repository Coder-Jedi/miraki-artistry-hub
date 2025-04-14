
import { useState, useEffect, useMemo } from 'react';
import { Artist } from '@/types';
import { artistsData, getFeaturedArtists } from '@/data/artists';

const useArtists = (limit?: number) => {
  const [loading, setLoading] = useState(true);
  
  // Use the artists data from our data source
  const featuredArtists = useMemo(() => {
    console.log("Artists data in hook:", artistsData);
    // Make sure all artists have location data
    const artists = getFeaturedArtists();
    // Explicitly log location data for debugging
    console.log("Featured artists with locations:", artists.map(a => ({
      name: a.name, 
      hasLocation: !!a.location, 
      location: a.location
    })));
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
