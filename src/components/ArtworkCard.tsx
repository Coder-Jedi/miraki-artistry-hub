import { useState } from 'react';
import { Artwork } from '@/types';
import { ImageOff, Heart, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/utils/priceFormatter';
import { useNavigate } from 'react-router-dom';
import QuantityControls from './QuantityControls';

interface ArtworkCardProps {
  artwork: Artwork;
  onClick: (artwork: Artwork) => void;
  showFavoriteButton?: boolean;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ 
  artwork, 
  onClick,
  showFavoriteButton = false
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { 
    isAuthenticated, 
    cart, 
    addToCart,
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  } = useAuth();
  
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Find quantity in cart - check multiple ID fields for compatibility
  const cartItem = cart.find(item => 
    item.artworkId === artwork._id || 
    item._id === artwork._id ||
    (item.artwork && item.artwork._id === artwork._id)
  );
  const quantity = cartItem?.quantity || 0;

  // Check if artwork is in favorites
  const isArtworkFavorite = isFavorite(artwork._id);

  const handleImageError = () => {
    console.error(`Failed to load image: ${artwork.image}`);
    setImageError(true);
    setImageLoaded(true); // We still consider it "loaded" to remove loading indicator
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card onClick
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add artworks to your favorites.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (isArtworkFavorite) {
        await removeFromFavorites(artwork._id);
      } else {
        await addToFavorites(artwork);
      }
    } catch (error) {
      console.error('Error toggling favorite status:', error);
    }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!artwork.price || !artwork.forSale) {
      toast({
        title: "Not Available",
        description: "This artwork is not available for purchase.",
        variant: "destructive"
      });
      return;
    }
    addToCart(artwork);
    navigate('/checkout');
  };

  // Make sure we use the full URL for images
  const imageUrl = artwork.image.startsWith('http') 
    ? artwork.image 
    : `${window.location.origin}${artwork.image}`;

  return (
    <div 
      className="group h-full cursor-pointer rounded-lg overflow-hidden bg-white dark:bg-mirakiBlue-800 border border-mirakiGray-200 dark:border-mirakiBlue-700 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col"
      onClick={() => onClick(artwork)}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <div className={`absolute inset-0 bg-mirakiGray-100 dark:bg-mirakiBlue-950 animate-pulse ${imageLoaded ? 'hidden' : 'block'}`} />
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-mirakiGray-100 dark:bg-mirakiBlue-950">
            <div className="flex flex-col items-center text-center p-4">
              <ImageOff size={32} className="text-mirakiGray-400 mb-2" />
              <p className="text-mirakiBlue-500 dark:text-mirakiGray-400">Image not available</p>
            </div>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={artwork.title}
            className={`w-full h-full object-cover transform group-hover:scale-105 transition-all duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
          />
        )}
        
        {/* Category Tag */}
        <div className="absolute bottom-0 left-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="inline-block px-2 py-1 text-xs font-medium bg-mirakiGold rounded text-mirakiBlue-900">
            {artwork.category}
          </span>
        </div>
        
        {/* Favorite Button */}
        {showFavoriteButton && (
          <button 
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
              isArtworkFavorite 
                ? 'bg-red-100 text-red-500 shadow-md transform scale-110' 
                : 'bg-white/80 text-mirakiBlue-700 dark:bg-mirakiBlue-900/80 dark:text-mirakiGray-300 backdrop-blur-sm opacity-0 group-hover:opacity-100 hover:scale-110'
            }`}
            onClick={handleFavoriteClick}
            aria-label={isArtworkFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              size={18} 
              fill={isArtworkFavorite ? "currentColor" : "none"} 
              className={`transform transition-transform ${isArtworkFavorite ? 'scale-110' : ''}`}
            />
          </button>
        )}
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
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
        
        {/* Price and Controls Section */}
        <div className="mt-auto pt-3 border-t border-mirakiGray-200 dark:border-mirakiBlue-700">
          {artwork.price && artwork.forSale ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-mirakiBlue-900 dark:text-white font-medium">
                  {formatPrice(artwork.price)}
                </span>
                <Button 
                  variant="secondary"
                  className="h-8"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </Button>
              </div>
              
              {quantity > 0 ? (
                <QuantityControls 
                  artwork={artwork}
                  quantity={quantity}
                  className="justify-center"
                />
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full h-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(artwork);
                  }}
                >
                  <ShoppingCart size={16} className="mr-2" />
                  Add to Cart
                </Button>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-sm text-mirakiGray-500 dark:text-mirakiGray-400">
                Price unavailable
              </span>
              <Badge className="bg-mirakiGray-100 dark:bg-mirakiGray-800 text-mirakiGray-700 dark:text-mirakiGray-300 hover:bg-mirakiGray-200 dark:hover:bg-mirakiGray-700">
                Inquire
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtworkCard;
