
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Artist } from '@/types';
import { ArrowLeft } from 'lucide-react';
import ArtworkCard from '@/components/ArtworkCard';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';

interface ArtistDetailsSectionProps {
  artist: Artist;
  onBackClick: () => void;
}

const ArtistDetailsSection: React.FC<ArtistDetailsSectionProps> = ({ artist, onBackClick }) => {
  const navigate = useNavigate();

  const handleArtworkClick = (artwork: any) => {
    // Navigate to artwork details
    navigate(`/artwork/${artwork.id}`);
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

  return (
    <section className="page-section py-8 animate-fade-in">
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
                      <img 
                        src={artist.profileImage} 
                        alt={artist.name} 
                        className="w-full h-full object-cover"
                      />
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
                            {artist.artworks?.length || 0}
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
                        <Button variant="default" className="bg-mirakiGold hover:bg-mirakiGold/90 text-mirakiBlue-900">
                          Contact Artist
                        </Button>
                        
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
        
          {artist.artworks && artist.artworks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {artist.artworks.map(artwork => (
                <ArtworkCard 
                  key={artwork.id}
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
        </div>
      </div>
    </section>
  );
};

export default ArtistDetailsSection;
