
import { useState } from 'react';
import { Artwork } from '@/types';
import { ImageOff, Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface ArtworkCardHomeProps {
  artwork: Artwork;
  onClick: (artwork: Artwork) => void;
  showFavoriteButton?: boolean;
}

const ArtworkCardHome: React.FC<ArtworkCardHomeProps> = ({ 
  artwork, 
  onClick,
  showFavoriteButton = false
}) => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleImageError = () => {
    console.error(`Failed to load image: ${artwork.image}`);
    setImageError(true);
    setImageLoaded(true); // We still consider it "loaded" to remove loading indicator
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card onClick
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add artworks to your favorites.",
        variant: "destructive"
      });
      return;
    }
    
    // Toggle favorite state
    setIsFavorite(!isFavorite);
    
    toast({
      title: isFavorite ? "Removed from Favorites" : "Added to Favorites",
      description: isFavorite 
        ? `"${artwork.title}" has been removed from your favorites.` 
        : `"${artwork.title}" has been added to your favorites.`,
      variant: "default"
    });
  };

  // Make sure we use the full URL for images
  const imageUrl = artwork.image.startsWith('http') 
    ? artwork.image 
    : `${window.location.origin}${artwork.image}`;

  return (
    <div className="artwork-card-wrapper relative h-full transform transition-all duration-500">
      {/* Outer gradient box with blur effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-mirakiBlue-100/80 to-mirakiGold/20 dark:from-mirakiBlue-700/50 dark:to-mirakiGold/20 backdrop-blur-md -m-2 p-6" />
      
      <Card 
        className="group cursor-pointer overflow-hidden bg-white/80 dark:bg-mirakiBlue-800/80 border border-mirakiGray-200/50 dark:border-mirakiBlue-700/50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full relative z-10"
        onClick={() => onClick(artwork)}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          {/* Blur backdrop effect */}
          <div className="absolute inset-0 z-0 scale-110 opacity-50 blur-xl">
            {!imageError && (
              <img
                src={imageUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            )}
          </div>
          
          <div className={`absolute inset-0 bg-mirakiGray-100 dark:bg-mirakiBlue-950 animate-pulse ${imageLoaded ? 'hidden' : 'block'}`} />
          
          {imageError ? (
            <div className="relative z-10 w-full h-full flex items-center justify-center bg-mirakiGray-100 dark:bg-mirakiBlue-950">
              <div className="flex flex-col items-center text-center p-4">
                <ImageOff size={32} className="text-mirakiGray-400 mb-2" />
                <p className="text-mirakiBlue-500 dark:text-mirakiGray-400">Image not available</p>
              </div>
            </div>
          ) : (
            <img
              src={imageUrl}
              alt={artwork.title}
              className={`relative z-10 w-full h-full object-cover transform group-hover:scale-105 transition-all duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={handleImageError}
            />
          )}
          
          {/* Category Tag */}
          <div className="absolute bottom-0 left-0 p-3 z-20 bg-gradient-to-t from-black/80 to-transparent w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="inline-block px-2 py-1 text-xs font-medium bg-mirakiGold rounded text-mirakiBlue-900">
              {artwork.category}
            </span>
          </div>
          
          {/* Favorite Button */}
          {showFavoriteButton && (
            <button 
              className={`absolute top-3 right-3 p-2 rounded-full z-20 transition-all duration-300 ${
                isFavorite 
                  ? 'bg-red-100 text-red-500 shadow-md transform scale-110' 
                  : 'bg-white/80 text-mirakiBlue-700 dark:bg-mirakiBlue-900/80 dark:text-mirakiGray-300 backdrop-blur-sm opacity-0 group-hover:opacity-100 hover:scale-110'
              }`}
              onClick={handleFavoriteClick}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart 
                size={18} 
                fill={isFavorite ? "currentColor" : "none"} 
                className={`transform transition-transform ${isFavorite ? 'scale-110' : ''}`}
              />
            </button>
          )}
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-display text-lg font-medium text-mirakiBlue-900 dark:text-white group-hover:text-mirakiBlue-700 dark:group-hover:text-mirakiGold transition-colors line-clamp-1">
            {artwork.title}
          </h3>
          <p className="text-mirakiBlue-600 dark:text-mirakiGray-300 text-sm mt-1">
            by {artwork.artist}
          </p>
          
          {artwork.description && (
            <p className="mt-2 text-mirakiBlue-700 dark:text-mirakiGray-300 text-sm line-clamp-2">
              {artwork.description}
            </p>
          )}
        </CardContent>
        
        <CardFooter className="px-4 pb-4 pt-0">
          {/* Price Information (if available) */}
          {artwork.price ? (
            <div className="flex items-center justify-between w-full">
              <span className="text-mirakiBlue-900 dark:text-white font-medium">
                ${artwork.price.toLocaleString()}
              </span>
              {artwork.forSale && (
                <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-full">
                  For Sale
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <span className="text-sm text-mirakiGray-500 dark:text-mirakiGray-400">
                Price unavailable
              </span>
              <span className="text-xs px-2 py-0.5 bg-mirakiGray-100 dark:bg-mirakiGray-800 text-mirakiGray-700 dark:text-mirakiGray-300 rounded-full">
                Inquire
              </span>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ArtworkCardHome;
