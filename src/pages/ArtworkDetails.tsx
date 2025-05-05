import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Map, User, ImageOff, ShoppingCart } from 'lucide-react';
import Layout from '@/components/Layout';
import { Artwork } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/utils/priceFormatter';
import { useAuth } from '@/hooks/useAuth';
import { artworkService } from '@/services/artworkService';
import { artworksData } from '@/data/artworks'; // Keep for fallback
import QuantityControls from '@/components/QuantityControls';

const ArtworkDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedArtworks, setRelatedArtworks] = useState<Artwork[]>([]);
  const [mainImageError, setMainImageError] = useState(false);
  const [relatedImagesError, setRelatedImagesError] = useState<Record<string, boolean>>({});
  const { addToCart, cart } = useAuth();

  // Check if the artwork is already in the cart
  const cartItem = cart.find(item => 
    item.artworkId === id || 
    item._id === id ||
    (item.artwork && item.artwork._id === id)
  );
  const quantity = cartItem?.quantity || 0;

  useEffect(() => {
    // Fetch artwork from API
    const fetchArtwork = async () => {
      if (!id) return;
      
      setLoading(true);
      setMainImageError(false); // Reset on new artwork load
      setRelatedImagesError({});
      setError(null);
      
      try {
        // Get artwork details from API
        const response = await artworkService.getArtworkById(id);
        
        if (response.success && response.data) {
          const fetchedArtwork = artworkService.mapApiArtworkToModel(response.data);
          setArtwork(fetchedArtwork);
          
          // Fetch related artworks (same category or artist)
          if (fetchedArtwork) {
            try {
              // Query for related artworks with the same category or artist
              const relatedResponse = await artworkService.getArtworks({
                limit: 4,
                category: fetchedArtwork.category
              });
              
              if (relatedResponse.success && relatedResponse.data?.items) {
                // Map and filter out the current artwork
                const mappedRelated = relatedResponse.data.items
                  .map(artworkService.mapApiArtworkToModel)
                  .filter(art => art._id !== id);
                
                // If we don't have enough artworks from the same category, we could fetch by artist
                if (mappedRelated.length < 2) {
                  // Try to get more related by artist
                  const artistRelatedResponse = await artworkService.getArtworksByArtist(
                    fetchedArtwork.artistId || '',
                    { limit: 4 }
                  );
                  
                  if (artistRelatedResponse.success && artistRelatedResponse.data?.items) {
                    const artistMappedRelated = artistRelatedResponse.data.items
                      .map(artworkService.mapApiArtworkToModel)
                      .filter(art => art._id !== id);
                    
                    // Combine unique items from both queries
                    const combinedRelated = [...mappedRelated];
                    
                    artistMappedRelated.forEach(artworkItem => {
                      if (!combinedRelated.some(item => item._id === artworkItem._id)) {
                        combinedRelated.push(artworkItem);
                      }
                    });
                    
                    // Limit to 4
                    setRelatedArtworks(combinedRelated.slice(0, 4));
                  } else {
                    setRelatedArtworks(mappedRelated);
                  }
                } else {
                  setRelatedArtworks(mappedRelated.slice(0, 4));
                }
              }
            } catch (relatedError) {
              console.error('Error fetching related artworks:', relatedError);
              // Fallback to local data for related artworks
              if (fetchedArtwork) {
                const fallbackRelated = artworksData
                  .filter(art => 
                    art._id !== id && 
                    (art.category === fetchedArtwork.category || art.artist === fetchedArtwork.artist)
                  )
                  .slice(0, 4);
                setRelatedArtworks(fallbackRelated);
              }
            }
          }
        } else {
          // API call was successful but no artwork found
          setError('Artwork not found');
          
          // Try to find in local data as fallback
          const fallbackArtwork = artworksData.find(art => art._id === id);
          if (fallbackArtwork) {
            setArtwork(fallbackArtwork);
            
            // Find related artworks from local data
            const fallbackRelated = artworksData
              .filter(art => 
                art._id !== id && 
                (art.category === fallbackArtwork.category || art.artist === fallbackArtwork.artist)
              )
              .slice(0, 4);
            setRelatedArtworks(fallbackRelated);
          }
        }
      } catch (fetchError) {
        console.error('Error fetching artwork:', fetchError);
        setError('Failed to load artwork details. Please try again later.');
        
        // Try to find in local data as fallback
        const fallbackArtwork = artworksData.find(art => art._id === id);
        if (fallbackArtwork) {
          setArtwork(fallbackArtwork);
          
          // Find related artworks from local data
          const fallbackRelated = artworksData
            .filter(art => 
              art._id !== id && 
              (art.category === fallbackArtwork.category || art.artist === fallbackArtwork.artist)
            )
            .slice(0, 4);
          setRelatedArtworks(fallbackRelated);
        }
      } finally {
        setLoading(false);
      }
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
    const relatedArtwork = relatedArtworks.find(art => art._id === artworkId);
    if (!relatedArtwork) return;
    
    const imageUrl = getFullImageUrl(relatedArtwork.image);
    console.error(`Failed to load related artwork image: ${imageUrl}`);
    setRelatedImagesError(prev => ({ ...prev, [artworkId]: true }));
  };

  const handleBuyNow = () => {
    if (!artwork) return;
    
    addToCart(artwork);
    navigate('/checkout');
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
              to="/explore" 
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
                by <Link to={`/artists?id=${encodeURIComponent(artwork.artistId)}`} className="ml-1 font-medium hover:text-mirakiGold transition-colors">{artwork.artist}</Link>
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
              
              {/* Price and Purchase Section */}
              {artwork.price && (
                <div className="mt-6 pt-6 border-t border-mirakiGray-200 dark:border-mirakiBlue-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-mirakiBlue-900 dark:text-white mb-1">Price</h3>
                      <p className="text-2xl font-bold text-mirakiBlue-800 dark:text-white">
                        {formatPrice(artwork.price)}
                      </p>
                    </div>
                    {artwork.forSale && (
                      <div className="space-x-2">
                        {quantity > 0 ? (
                          <QuantityControls
                            artwork={artwork}
                            quantity={quantity}
                            className="justify-end"
                          />
                        ) : (
                          <>
                            <Button
                              onClick={() => addToCart(artwork)}
                              variant="outline"
                              className="flex items-center gap-2"
                            >
                              <ShoppingCart size={18} />
                              Add to Cart
                            </Button>
                            <Button 
                              className="bg-mirakiGold hover:bg-mirakiGold-600 text-mirakiBlue-900"
                              onClick={handleBuyNow}
                            >
                              Buy Now
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
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
                    <Link to={`/artwork/${related._id}`} key={related._id}>
                      <Card className="overflow-hidden hover-lift">
                        <div className="aspect-[4/3] overflow-hidden">
                          {relatedImagesError[related._id] ? (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-mirakiGray-100 dark:bg-mirakiBlue-900">
                              <ImageOff size={32} className="text-mirakiGray-400 mb-2" />
                              <p className="text-mirakiBlue-500 dark:text-mirakiGray-400 text-sm">Image not available</p>
                            </div>
                          ) : (
                            <img 
                              src={relatedImageUrl} 
                              alt={related.title}
                              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                              onError={() => handleRelatedImageError(related._id)}
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
