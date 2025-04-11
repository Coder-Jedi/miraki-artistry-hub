
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Map as MapIcon, Palette, Grid } from 'lucide-react';
import Layout from '@/components/Layout';
import { artworksData } from '@/data/artworks';
import { Artwork } from '@/types';
import ArtworkCard from '@/components/ArtworkCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { artistsData } from '@/data/artists';
import MapSection from '@/components/MapSection';

interface Artist {
  name: string;
  artworks: Artwork[];
  featuredImage: string;
}

const Artists: React.FC = () => {
  const [searchParams] = useSearchParams();
  const nameFromParam = searchParams.get('name');
  const [artists, setArtists] = useState<Artist[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('list');
  
  useEffect(() => {
    // Organize artworks by artist
    const artistMap = new Map<string, Artwork[]>();
    
    artworksData.forEach(artwork => {
      if (!artistMap.has(artwork.artist)) {
        artistMap.set(artwork.artist, []);
      }
      artistMap.get(artwork.artist)?.push(artwork);
    });
    
    // Convert map to array of Artist objects
    const artistsArray: Artist[] = [];
    artistMap.forEach((artworks, name) => {
      artistsArray.push({
        name,
        artworks,
        featuredImage: artworks[0].image // Use first artwork as featured image
      });
    });
    
    setArtists(artistsArray);
    
    // If name param exists, select that artist
    if (nameFromParam) {
      const foundArtist = artistsArray.find(artist => 
        artist.name.toLowerCase() === nameFromParam.toLowerCase()
      );
      if (foundArtist) {
        setSelectedArtist(foundArtist);
      }
    }
    
    // Simulate API loading delay
    setTimeout(() => {
      setLoading(false);
    }, 500);

    // Trigger animations after page load
    setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);
  }, [nameFromParam]);

  const handleArtworkClick = (artwork: Artwork) => {
    // Navigate to artwork details
    window.location.href = `/artwork/${artwork.id}`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="container-fluid py-24">
          <div className="max-w-6xl mx-auto">
            <h1 className="section-heading mb-12">Artists</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(index => (
                <div key={index} className="animate-pulse">
                  <div className="h-64 bg-mirakiGray-200 dark:bg-mirakiBlue-700 rounded-lg mb-4"></div>
                  <div className="h-6 w-2/3 bg-mirakiGray-200 dark:bg-mirakiBlue-700 rounded mb-2"></div>
                  <div className="h-4 w-1/2 bg-mirakiGray-200 dark:bg-mirakiBlue-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Page Header with gradient similar to Explore page */}
      <section id="artists" className={`page-section pt-24 pb-4 bg-gradient-to-r from-mirakiBlue-50 to-mirakiGray-100 dark:from-mirakiBlue-900 dark:to-mirakiBlue-800 transition-opacity duration-1000 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="container-fluid">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-mirakiBlue-900 dark:text-white">
              {selectedArtist ? `${selectedArtist.name}` : 'Discover Artists'}
            </h1>
            <p className="text-mirakiBlue-600 dark:text-mirakiGray-300 text-lg mb-8">
              {selectedArtist 
                ? `Explore the unique creative vision of ${selectedArtist.name} through their art collection.`
                : 'Meet the talented artists behind our curated collection of artworks, each with their own unique style and perspective.'}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="page-section py-8">
        <div className="container-fluid">
          <div className="max-w-6xl mx-auto">
            
            {/* Only show tabs when not viewing a specific artist */}
            {!selectedArtist ? (
              <Tabs defaultValue="list" onValueChange={setActiveTab} className="w-full mb-8">
                <div className="flex justify-center">
                  <TabsList className="mb-8">
                    <TabsTrigger value="list" className="flex items-center gap-2">
                      <Grid size={18} />
                      <span>Explore List</span>
                    </TabsTrigger>
                    <TabsTrigger value="map" className="flex items-center gap-2">
                      <MapIcon size={18} />
                      <span>Explore on Map</span>
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                {/* List View */}
                <TabsContent value="list" className={`transition-all duration-500 ${isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {artists.map(artist => (
                      <div 
                        key={artist.name} 
                        className="cursor-pointer group"
                        onClick={() => setSelectedArtist(artist)}
                      >
                        <div className="aspect-square overflow-hidden rounded-lg bg-mirakiGray-100 dark:bg-mirakiBlue-800 relative">
                          <img 
                            src={artist.featuredImage} 
                            alt={artist.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                            <div className="p-6">
                              <h3 className="font-display text-xl font-medium text-white mb-1">
                                {artist.name}
                              </h3>
                              <p className="text-mirakiGray-300 text-sm">
                                {artist.artworks.length} {artist.artworks.length === 1 ? 'artwork' : 'artworks'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                {/* Map View */}
                <TabsContent value="map" className={`transition-all duration-500 ${isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <div className="h-[600px] rounded-lg overflow-hidden">
                    <MapSection artworks={artworksData} onArtworkClick={handleArtworkClick} />
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              /* Artist Detail View - This stays the same as before */
              <>
                <div className="mb-12">
                  <div className="flex flex-col md:flex-row items-start gap-8">
                    <div className="w-full md:w-1/3">
                      <div className="aspect-square overflow-hidden rounded-lg bg-mirakiGray-100 dark:bg-mirakiBlue-800">
                        <img 
                          src={selectedArtist.featuredImage} 
                          alt={selectedArtist.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="w-full md:w-2/3">
                      <h2 className="font-display text-3xl font-semibold text-mirakiBlue-900 dark:text-white mb-4">
                        {selectedArtist.name}
                      </h2>
                      <p className="text-mirakiBlue-600 dark:text-mirakiGray-300 mb-6">
                        {selectedArtist.name} is a talented artist with {selectedArtist.artworks.length} artworks in our gallery.
                        Their unique style and perspective bring life to every piece they create.
                      </p>
                      <div className="flex items-center gap-4">
                        <button className="bg-mirakiGold hover:bg-mirakiGold-600 text-mirakiBlue-900 px-4 py-2 rounded-md transition-colors">
                          Contact Artist
                        </button>
                        <button 
                          onClick={() => setSelectedArtist(null)}
                          className="border border-mirakiGray-300 dark:border-mirakiBlue-700 hover:bg-mirakiGray-100 dark:hover:bg-mirakiBlue-800 px-4 py-2 rounded-md transition-colors"
                        >
                          View All Artists
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              
                <h3 className="font-display text-2xl font-medium text-mirakiBlue-900 dark:text-white mb-8">
                  Artworks by {selectedArtist.name}
                </h3>
              
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {selectedArtist.artworks.map(artwork => (
                    <ArtworkCard 
                      key={artwork.id}
                      artwork={artwork}
                      onClick={handleArtworkClick}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Artists;
