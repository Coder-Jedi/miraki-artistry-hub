
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Artist } from '@/types';
import { ImageOff, ExternalLink, Star } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface ArtistCardProps {
  artist: Artist;
  onClick?: () => void;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist, onClick }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    console.error(`Failed to load image: ${artist.profileImage}`);
    setImageError(true);
    setImageLoaded(true); // We still consider it "loaded" to remove loading indicator
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/artists?name=${encodeURIComponent(artist.name)}`);
    }
  };

  // Function to render star ratings
  const renderStarRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={14} className="text-mirakiGold fill-mirakiGold" />
        ))}
        
        {hasHalfStar && (
          <div className="relative">
            <Star size={14} className="text-mirakiGold" />
            <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
              <Star size={14} className="text-mirakiGold fill-mirakiGold" />
            </div>
          </div>
        )}
        
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star key={`empty-${i}`} size={14} className="text-mirakiGray-300 dark:text-mirakiGray-600" />
        ))}
        
        <span className="ml-1 text-xs text-mirakiGray-500 dark:text-mirakiGray-400">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  // Make sure we use the full URL for images
  const imageUrl = artist.profileImage?.startsWith('http') 
    ? artist.profileImage 
    : artist.profileImage ? `${window.location.origin}${artist.profileImage}` : '';

  return (
    <div className="artist-card-wrapper relative h-full transform transition-all duration-500 hover:-translate-y-1">
      {/* Outer gradient box with blur effect in dark mode */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-mirakiBlue-200/70 to-mirakiGold/30 dark:from-mirakiBlue-800/50 dark:to-mirakiGold/20 backdrop-blur-md -m-4 p-8" />
      
      <Card 
        className="group cursor-pointer overflow-hidden bg-white/80 dark:bg-mirakiBlue-900/80 backdrop-blur-md border border-mirakiGray-200 shadow-md transition-all duration-300 h-full relative z-10 dark:border-mirakiBlue-800 hover:border-mirakiGold hover:shadow-mirakiGold/20"
        onClick={handleClick}
      >
        <div className="relative aspect-square overflow-hidden rounded-full mx-auto w-32 h-32 mt-6">
          {/* Blur backdrop effect */}
          <div className="absolute inset-0 z-0 scale-110 opacity-50 blur-xl">
            {!imageError && imageUrl && (
              <img
                src={imageUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            )}
          </div>
          
          <div className={`absolute inset-0 bg-mirakiGray-100 dark:bg-mirakiBlue-950 animate-pulse ${imageLoaded ? 'hidden' : 'block'}`} />
          
          {imageError || !imageUrl ? (
            <div className="relative z-10 w-full h-full flex items-center justify-center bg-mirakiGray-100 dark:bg-mirakiBlue-950 rounded-full">
              <div className="flex flex-col items-center text-center p-4">
                <ImageOff size={32} className="text-mirakiGray-400 mb-2" />
                <p className="text-mirakiBlue-500 dark:text-mirakiGray-400">Image not available</p>
              </div>
            </div>
          ) : (
            <img
              src={imageUrl}
              alt={artist.name}
              className={`relative z-10 w-full h-full object-cover transition-all duration-500 rounded-full shadow-lg group-hover:shadow-xl ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={handleImageError}
            />
          )}
        </div>
        
        <CardContent className="p-4 text-center">
          <h3 className="font-display text-lg font-medium text-mirakiBlue-900 group-hover:text-mirakiBlue-800 group-hover:font-semibold transition-colors dark:text-white dark:group-hover:text-mirakiGold mt-2">
            {artist.name}
          </h3>
          
          {/* Popularity Rating */}
          <div className="mt-1 flex justify-center">
            {renderStarRating(artist.popularity || 0)}
          </div>
          
          {artist.bio && (
            <p className="mt-3 text-mirakiBlue-700 text-sm line-clamp-2 dark:text-mirakiGray-300">
              {artist.bio}
            </p>
          )}
          
          {/* Artwork count */}
          <p className="mt-2 text-xs text-mirakiBlue-600 dark:text-mirakiGray-400">
            {artist.artworks?.length || 0} {(artist.artworks?.length || 0) === 1 ? 'artwork' : 'artworks'}
          </p>
        </CardContent>
        
        <CardFooter className="px-4 pb-5 pt-0 flex-col">
          {/* Location information */}
          {artist.location?.address && (
            <div className="text-center w-full">
              <span className="text-sm text-mirakiBlue-600 dark:text-mirakiGray-400">
                {artist.location.address}
              </span>
            </div>
          )}
          
          {/* Social Links */}
          {artist.socialLinks && Object.values(artist.socialLinks).some(link => !!link) && (
            <div className="flex justify-center space-x-3 mt-3">
              {artist.socialLinks.website && (
                <a 
                  href={artist.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-mirakiBlue-500 hover:text-mirakiBlue-700 dark:text-mirakiGold-400 dark:hover:text-mirakiGold"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ArtistCard;
