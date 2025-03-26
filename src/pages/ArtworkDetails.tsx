
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Map, User, ImageOff } from 'lucide-react';
import Layout from '@/components/Layout';
import { artworksData } from '@/data/artworks';
import { Artwork } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ArtworkDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedArtworks, setRelatedArtworks] = useState<Artwork[]>([]);
  const [mainImageError, setMainImageError] = useState(false);
  const [relatedImagesError, setRelatedImagesError] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Simulate API call
    const fetchArtwork = () => {
      setLoading(true);
      setMainImageError(false); // Reset on new artwork load
      setRelatedImagesError({});
      
      setTimeout(() => {
        const foundArtwork = artworksData.find(art => art.id === id);
        setArtwork(foundArtwork || null);
        
        // Find related artworks (same category or artist)
        if (foundArtwork) {
          const related = artworksData
            .filter(art => 
              art.id !== foundArtwork.id && 
              (art.category === foundArtwork.category || art.artist === foundArtwork.artist)
            )
            .slice(0, 4);
          setRelatedArtworks(related);
        }
        
        setLoading(false);
      }, 300);
    };

    fetchArtwork();
  }, [id]);

  // Get full URL for main artwork image
  const getFullImageUrl = (imagePath: string) => {
    return imagePath.startsWith('http') 
      ? imagePath 
      : `${window.location.origin}${imagePath}`;
  };

  const handleMainImageError = () => {
    if (!artwork) return;
    const imageUrl = getFullImageUrl(artwork.image);
    console.error(`Failed to load main artwork image: ${imageUrl}`);
    setMainImageError(true);
  };

  const handleRelatedImageError = (artworkId: string) => {
    const relatedArtwork = relatedArtworks.find(art => art.id === artworkId);
    if (!relatedArtwork) return;
    
    const imageUrl = getFullImageUrl(relatedArtwork.image);
    console.error(`Failed to load related artwork image: ${imageUrl}`);
    setRelatedImagesError(prev => ({ ...prev, [artworkId]: true }));
  };

  if (loading) {
    return (
      <Layout>
        <div className="container-fluid py-16">
          <div className="max-w-5xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 w-64 bg-mirakiGray-200 dark:bg-mirakiBlue-700 rounded mb-4"></div>
              <div className="h-80 bg-mirakiGray-200 dark:bg-mirakiBlue-700 rounded mb-6"></div>
              <div className="h-4 w-full bg-mirakiGray-200 dark:bg-mirakiBlue-700 rounded mb-2"></div>
              <div className="h-4 w-full bg-mirakiGray-200 dark:bg-mirakiBlue-700 rounded mb-2"></div>
              <div className="h-4 w-2/3 bg-mirakiGray-200 dark:bg-mirakiBlue-700 rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!artwork) {
    return (
      <Layout>
        <div className="container-fluid py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Artwork Not Found</h2>
          <p className="mb-8">The artwork you're looking for doesn't exist or has been removed.</p>
          <Link to="/">
            <Button>
              <ArrowLeft className="mr-2" size={16} />
              Return to Gallery
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const mainImageUrl = getFullImageUrl(artwork.image);

  return (
    <Layout>
      <div className="container-fluid pt-24 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link 
              to="/" 
              className="inline-flex items-center text-mirakiBlue-600 dark:text-mirakiGray-300 hover:text-mirakiBlue-800 dark:hover:text-white transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Gallery
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Artwork Image */}
            <div className="bg-white dark:bg-mirakiBlue-800 rounded-lg overflow-hidden shadow-md">
              {mainImageError ? (
                <div className="w-full aspect-[4/3] flex flex-col items-center justify-center bg-mirakiGray-100 dark:bg-mirakiBlue-900">
                  <ImageOff size={64} className="text-mirakiGray-400 mb-3" />
                  <p className="text-mirakiBlue-500 dark:text-mirakiGray-400">Image not available</p>
                </div>
              ) : (
                <img 
                  src={mainImageUrl} 
                  alt={artwork.title} 
                  className="w-full h-auto object-cover aspect-[4/3]"
                  onError={handleMainImageError}
                />
              )}
            </div>
            
            {/* Artwork Details */}
            <div>
              <span className="inline-block px-3 py-1 text-sm font-medium bg-mirakiGold/10 text-mirakiGold border border-mirakiGold/20 rounded-full mb-4">
                {artwork.category}
              </span>
              <h1 className="font-display text-3xl md:text-4xl font-semibold text-mirakiBlue-900 dark:text-white mb-4">
                {artwork.title}
              </h1>
              <p className="text-xl text-mirakiBlue-700 dark:text-mirakiGray-300 mb-6 flex items-center">
                <User size={18} className="mr-2" />
                by <Link to={`/artists?name=${encodeURIComponent(artwork.artist)}`} className="ml-1 font-medium hover:text-mirakiGold transition-colors">{artwork.artist}</Link>
              </p>
              
              <div className="prose prose-mirakiBlue dark:prose-invert max-w-none mb-8">
                <p className="text-mirakiBlue-800 dark:text-mirakiGray-200">
                  {artwork.description}
                </p>
              </div>
              
              {artwork.location && (
                <div className="mt-6 pt-6 border-t border-mirakiGray-200 dark:border-mirakiBlue-700">
                  <h3 className="font-medium text-mirakiBlue-900 dark:text-white mb-2 flex items-center">
                    <Map size={18} className="mr-2" />
                    Location
                  </h3>
                  <p className="text-mirakiBlue-700 dark:text-mirakiGray-300">
                    {artwork.location.address}
                  </p>
                </div>
              )}
              
              <div className="mt-8">
                <Button className="bg-mirakiGold hover:bg-mirakiGold-600 text-mirakiBlue-900">
                  Contact About This Artwork
                </Button>
              </div>
            </div>
          </div>
          
          {/* Related Artworks */}
          {relatedArtworks.length > 0 && (
            <div className="mt-16">
              <h2 className="section-heading mb-8">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedArtworks.map(related => {
                  const relatedImageUrl = getFullImageUrl(related.image);
                  
                  return (
                    <Link to={`/artwork/${related.id}`} key={related.id}>
                      <Card className="overflow-hidden hover-lift">
                        <div className="aspect-[4/3] overflow-hidden">
                          {relatedImagesError[related.id] ? (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-mirakiGray-100 dark:bg-mirakiBlue-900">
                              <ImageOff size={32} className="text-mirakiGray-400 mb-2" />
                              <p className="text-mirakiBlue-500 dark:text-mirakiGray-400 text-sm">Image not available</p>
                            </div>
                          ) : (
                            <img 
                              src={relatedImageUrl} 
                              alt={related.title}
                              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                              onError={() => handleRelatedImageError(related.id)}
                            />
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-display text-lg font-medium text-mirakiBlue-900 dark:text-white">
                            {related.title}
                          </h3>
                          <p className="text-mirakiBlue-600 dark:text-mirakiGray-300 text-sm mt-1">
                            by {related.artist}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ArtworkDetails;
