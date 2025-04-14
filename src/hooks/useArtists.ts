
import { useState, useEffect, useMemo } from 'react';
import { Artist } from '@/types';
import { artistsData, getFeaturedArtists } from '@/data/artists';

const useArtists = (limit?: number) => {
  const [loading, setLoading] = useState(true);
  
  // Use the artists data from our data source
  const featuredArtists = useMemo(() => {
    const artists = getFeaturedArtists();
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
