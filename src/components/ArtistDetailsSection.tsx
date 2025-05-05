import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Artist, Artwork } from '@/types';
import { ArrowLeft, ImageOff } from 'lucide-react';
import ArtworkCard from '@/components/ArtworkCard';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import { artistService } from '@/services/artistService';
import { artworkService } from '@/services/artworkService';
import { artistsData } from '@/data/artists'; // Keep for fallback

interface ArtistDetailsSectionProps {
  artistId?: string;
  artistName?: string;
  onBackClick: () => void;
}

const ArtistDetailsSection: React.FC<ArtistDetailsSectionProps> = ({ 
  artistId, 
  artistName, 
  onBackClick 
}) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Use either the prop id, param id, or name for fetching
  const artistIdentifier = artistId || id || artistName;
  
  const [artist, setArtist] = useState<Artist | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileImageError, setProfileImageError] = useState(false);

  useEffect(() => {
    const fetchArtistData = async () => {
      if (!artistIdentifier) {
        setError("No artist identifier provided");
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // Try to fetch by ID first (if it looks like an ID)
        let response;
        if (artistIdentifier && !artistIdentifier.includes(' ')) {
          response = await artistService.getArtistById(artistIdentifier);
        }
        
        // If not successful by ID or not an ID, try to search by name
        if (!response?.success && artistName) {
          // Use the filter option with the search parameter
          const searchResponse = await artistService.getArtists({
            search: artistName,
            limit: 1
          });
          
          if (searchResponse.success && searchResponse.data?.items?.length > 0) {
            // Get the first matching artist's full details
            const foundArtist = searchResponse.data.items[0];
            response = await artistService.getArtistById(foundArtist._id);
          }
        }
        
        if (response?.success && response.data) {
          const fetchedArtist = artistService.mapApiArtistToModel(response.data);
          setArtist(fetchedArtist);
          
          // If the artist has artworks in the response, use them
          if (fetchedArtist.artworks && fetchedArtist.artworks.length > 0) {
            setArtworks(fetchedArtist.artworks);
          }
          // Otherwise fetch the artist's artworks separately
          else if (fetchedArtist._id) {
            try {
              const artworksResponse = await artworkService.getArtworksByArtist(
                fetchedArtist._id,
                { limit: 12 }
              );
              
              if (artworksResponse.success && artworksResponse.data?.items) {
                const mappedArtworks = artworksResponse.data.items.map(
                  artworkService.mapApiArtworkToModel
                );
                setArtworks(mappedArtworks);
              }
            } catch (artworksError) {
              console.error('Error fetching artist artworks:', artworksError);
            }
          }
        } else {
          // API call unsuccessful or didn't find the artist
          setError('Artist not found');
          
          // Try to find in local data as fallback
          const fallbackArtist = artistsData.find(a => 
            a.id === artistIdentifier || 
            (artistName && a.name.toLowerCase() === artistName.toLowerCase())
          );
          
          if (fallbackArtist) {
            setArtist(fallbackArtist);
            // Use any artworks that might already be associated in local data
            if (fallbackArtist.artworks) {
              setArtworks(fallbackArtist.artworks);
            }
          }
        }
      } catch (fetchError) {
        console.error('Error fetching artist details:', fetchError);
        setError('Failed to load artist details. Please try again later.');
        
        // Try local data fallback
        if (artistName) {
          const fallbackArtist = artistsData.find(a => 
            a.name.toLowerCase() === artistName.toLowerCase() ||
            a.id === artistIdentifier
          );
          
          if (fallbackArtist) {
            setArtist(fallbackArtist);
            // Use any artworks already assigned in the local data
            if (fallbackArtist.artworks) {
              setArtworks(fallbackArtist.artworks);
            }
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArtistData();
  }, [artistIdentifier, artistName, id]);

  const handleArtworkClick = (artwork: Artwork) => {
    // Navigate to artwork details
    navigate(`/artwork/${artwork._id}`);
  };

  const getFullImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return '';
    return imagePath.startsWith('http') 
      ? imagePath 
      : `${window.location.origin}${imagePath}`;
  };

  const handleProfileImageError = () => {
    setProfileImageError(true);
  };

  // Function to render star ratings
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center space-x-1 mt-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={i < Math.floor(rating) ? "currentColor" : "none"}
              stroke="currentColor"
              className={`h-4 w-4 ${
                i < Math.floor(rating) 
                  ? "text-mirakiGold fill-mirakiGold" 
                  : "text-mirakiGray-300 dark:text-mirakiGray-600"
              }`}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            {/* Half star overlay */}
            {i === Math.floor(rating) && rating % 1 >= 0.5 && (
              <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                  className="h-4 w-4 text-mirakiGold fill-mirakiGold"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
            )}
          </div>
        ))}
        <span className="text-xs text-mirakiGray-500 dark:text-mirakiGray-400">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <section className="page-section pt-24 py-8 animate-fade-in">
        <div className="container-fluid">
          <div className="max-w-6xl mx-auto">
            {/* Back button skeleton */}
            <div className="w-32 h-8 bg-mirakiGray-200 dark:bg-mirakiBlue-700 rounded animate-pulse mb-8"></div>
            
            <div className="mb-12">
              {/* Artist profile section skeleton */}
              <div className="relative rounded-xl overflow-hidden">
                <div className="p-8 bg-mirakiGray-100 dark:bg-mirakiBlue-800/50">
                  <div className="flex flex-col md:flex-row items-start gap-8">
                    <div className="w-full md:w-1/3">
                      <div className="aspect-square bg-mirakiGray-200 dark:bg-mirakiBlue-700 rounded-lg animate-pulse"></div>
                      <div className="mt-4 p-4 bg-mirakiGray-200 dark:bg-mirakiBlue-700 rounded-lg animate-pulse h-24"></div>
                    </div>
                    <div className="w-full md:w-2/3">
                      <div className="bg-mirakiGray-200 dark:bg-mirakiBlue-700 p-6 rounded-lg animate-pulse">
                        <div className="h-8 w-2/3 bg-mirakiGray-300 dark:bg-mirakiBlue-600 rounded mb-4"></div>
                        <div className="h-4 bg-mirakiGray-300 dark:bg-mirakiBlue-600 rounded mb-2"></div>
                        <div className="h-4 bg-mirakiGray-300 dark:bg-mirakiBlue-600 rounded mb-2"></div>
                        <div className="h-4 bg-mirakiGray-300 dark:bg-mirakiBlue-600 rounded mb-4 w-1/2"></div>
                        
                        <div className="flex space-x-3 mt-6">
                          <div className="h-10 w-24 bg-mirakiGray-300 dark:bg-mirakiBlue-600 rounded"></div>
                          <div className="h-10 w-24 bg-mirakiGray-300 dark:bg-mirakiBlue-600 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Artworks section skeleton */}
            <div className="h-8 w-64 bg-mirakiGray-200 dark:bg-mirakiBlue-700 rounded animate-pulse mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="aspect-[3/4] bg-mirakiGray-200 dark:bg-mirakiBlue-700 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!artist) {
    return (
      <section className="page-section pt-24 py-8 animate-fade-in">
        <div className="container-fluid text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Artist Not Found</h2>
          <p className="mb-8">The artist you're looking for doesn't exist or has been removed.</p>
          <Button onClick={onBackClick}>
            <ArrowLeft className="mr-2" size={16} />
            Return to Artists
          </Button>
        </div>
      </section>
    );
  }
  
  const profileImageUrl = getFullImageUrl(artist.profileImage);

  return (
    <section className="page-section pt-24 py-8 animate-fade-in">
      <div className="container-fluid">
        <div className="max-w-6xl mx-auto">
          {/* Back button */}
          <button 
            onClick={onBackClick}
            className="flex items-center space-x-2 mb-8 text-mirakiBlue-600 dark:text-mirakiGray-300 hover:text-mirakiBlue-800 dark:hover:text-white transition-colors group"
            aria-label="Back to artists"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Back to Artists</span>
          </button>
          
          <div className="mb-12">
            {/* Artist profile section with gradient background */}
            <div className="relative rounded-xl overflow-hidden">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-mirakiBlue-100 to-mirakiGold/20 dark:from-mirakiBlue-900/50 dark:to-mirakiGold/10 opacity-50"></div>
              
              <div className="relative z-10 p-8">
                <div className="flex flex-col md:flex-row items-start gap-8">
                  <div className="w-full md:w-1/3">
                    <div className="aspect-square overflow-hidden rounded-lg bg-mirakiGray-100 dark:bg-mirakiBlue-800 shadow-xl border border-white/30 dark:border-mirakiBlue-700/30">
                      {profileImageError ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-mirakiGray-100 dark:bg-mirakiBlue-900">
                          <ImageOff size={64} className="text-mirakiGray-400 mb-3" />
                          <p className="text-mirakiBlue-500 dark:text-mirakiGray-400">Image not available</p>
                        </div>
                      ) : (
                        <img 
                          src={profileImageUrl} 
                          alt={artist.name} 
                          className="w-full h-full object-cover"
                          onError={handleProfileImageError}
                        />
                      )}
                    </div>
                    
                    {/* Artist ratings and stats */}
                    <div className="mt-4 p-4 bg-white/80 dark:bg-mirakiBlue-800/80 backdrop-blur-md rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-medium text-mirakiBlue-700 dark:text-mirakiGray-200">Rating</h4>
                          {renderStarRating(artist.popularity || 0)}
                        </div>
                        <div className="text-right">
                          <h4 className="text-sm font-medium text-mirakiBlue-700 dark:text-mirakiGray-200">Artworks</h4>
                          <p className="text-lg font-semibold text-mirakiBlue-900 dark:text-white">
                            {artworks.length}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-2/3">
                    <div className="bg-white/90 dark:bg-mirakiBlue-900/90 backdrop-blur-md p-6 rounded-lg shadow-md">
                      <h2 className="font-display text-3xl font-semibold text-mirakiBlue-900 dark:text-white mb-2">
                        {artist.name}
                      </h2>
                      
                      {/* Location badge */}
                      {artist.location?.area && (
                        <div className="mb-4">
                          <Badge variant="outline" className="bg-mirakiBlue-50 dark:bg-mirakiBlue-800 text-mirakiBlue-600 dark:text-mirakiGray-300">
                            {artist.location.area}, Mumbai
                          </Badge>
                        </div>
                      )}
                      
                      <p className="text-mirakiBlue-600 dark:text-mirakiGray-300 mb-6 leading-relaxed">
                        {artist.bio || "No biography available for this artist."}
                      </p>
                      
                      <div className="flex flex-wrap gap-3 md:gap-4">
                        {/* <Button variant="default" className="bg-mirakiGold hover:bg-mirakiGold/90 text-mirakiBlue-900">
                          Contact Artist
                        </Button> */}
                        
                        {artist.socialLinks?.website && (
                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <Button variant="outline" className="border-mirakiGray-300 dark:border-mirakiBlue-700" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(artist.socialLinks?.website, '_blank');
                                }}>
                                Visit Website
                              </Button>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80">
                              <div className="flex justify-between space-x-4">
                                <div>
                                  <h4 className="text-sm font-semibold">{artist.name}'s Website</h4>
                                  <p className="text-sm">{artist.socialLinks?.website}</p>
                                </div>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        
          <h3 className="font-display text-2xl font-medium text-mirakiBlue-900 dark:text-white mb-8">
            Artworks by {artist.name}
          </h3>
        
          {artworks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {artworks.map(artwork => (
                <ArtworkCard 
                  key={artwork._id}
                  artwork={artwork}
                  onClick={handleArtworkClick}
                  showFavoriteButton={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-mirakiGray-50 dark:bg-mirakiBlue-800/30 rounded-lg">
              <p className="text-mirakiBlue-600 dark:text-mirakiGray-300">
                No artworks available for this artist.
              </p>
            </div>
          )}
          
          {error && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ArtistDetailsSection;
