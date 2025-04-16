
import { Artist, Artwork } from '@/types';
import { artworksData } from '@/data/artworks';
import { artistsData } from '@/data/artists';

// Fix the data inconsistency between artworks and artists
export const ensureDataConsistency = () => {
  console.log('Starting data consistency check...');
  
  try {
    // Create lookup maps
    const artistMap = new Map<string, Artist>();
    artistsData.forEach(artist => {
      artistMap.set(artist.name, artist);
    });

    // First pass: Check for artworks with non-existent artists
    let artworksWithMissingArtists = artworksData.filter(artwork => 
      !artistMap.has(artwork.artist)
    );
    
    if (artworksWithMissingArtists.length > 0) {
      console.warn(`Found ${artworksWithMissingArtists.length} artworks with non-existent artists:`, 
        artworksWithMissingArtists.map(a => `${a.title} by ${a.artist}`));
    }

    // Second pass: Map artworks to their artists
    artistsData.forEach(artist => {
      const artistArtworks = artworksData.filter(artwork => 
        artwork.artist === artist.name
      );
      
      if (artistArtworks.length === 0) {
        console.warn(`Artist ${artist.name} has no mapped artworks`);
      } else {
        console.log(`Artist ${artist.name} has ${artistArtworks.length} artworks`);
      }
      
      // Update artist with their artworks
      artist.artworks = artistArtworks;
    });

    // Store the updated artists in localStorage for consistency
    localStorage.setItem('artists', JSON.stringify(artistsData));
    
    console.log('Data consistency check complete. Updated artists with mapped artworks.');
    return {
      artistsWithNoArtworks: artistsData.filter(artist => !artist.artworks || artist.artworks.length === 0).length,
      totalArtworks: artworksData.length,
      totalArtistsWithArtworks: artistsData.filter(artist => artist.artworks && artist.artworks.length > 0).length
    };
  } catch (error) {
    console.error('Error in data consistency check:', error);
    return { error: true };
  }
};
