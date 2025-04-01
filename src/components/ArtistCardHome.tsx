
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Artist } from '@/types';
import { ImageOff, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface ArtistCardHomeProps {
  artist: Artist;
}

const ArtistCardHome: React.FC<ArtistCardHomeProps> = ({ artist }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    console.error(`Failed to load image: ${artist.profileImage}`);
    setImageError(true);
    setImageLoaded(true); // We still consider it "loaded" to remove loading indicator
  };

  const handleClick = () => {
    navigate(`/artists?name=${encodeURIComponent(artist.name)}`);
  };

  // Make sure we use the full URL for images
  const imageUrl = artist.profileImage?.startsWith('http') 
    ? artist.profileImage 
    : artist.profileImage ? `${window.location.origin}${artist.profileImage}` : '';

  return (
    <div className="artist-card-wrapper relative h-full transform transition-all duration-500">
      {/* Outer gradient box with blur effect in dark mode */}
      <div className="absolute inset-0 rounded-xl dark:bg-gradient-to-br dark:from-mirakiBlue-700/50 dark:to-mirakiGold/20 dark:backdrop-blur-md bg-white -m-4 p-8" />
      
      <Card 
        className="group cursor-pointer overflow-hidden bg-transparent border-none shadow-none transition-all duration-300 hover:-translate-y-1 h-full relative z-10"
        onClick={handleClick}
      >
        <div className="relative aspect-square overflow-hidden rounded-full mx-auto w-44 h-44 mt-4">
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
              className={`relative z-10 w-full h-full object-cover transform group-hover:scale-105 transition-all duration-500 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={handleImageError}
              style={{ transform: 'translateZ(20px)' }}
            />
          )}
        </div>
        
        <CardContent className="p-4 text-center bg-transparent">
          <h3 className="font-display text-lg font-medium text-mirakiBlue-900 dark:text-white group-hover:text-mirakiBlue-700 dark:group-hover:text-mirakiGold transition-colors">
            {artist.name}
          </h3>
          
          {artist.bio && (
            <p className="mt-2 text-mirakiBlue-700 dark:text-mirakiGray-300 text-sm line-clamp-2">
              {artist.bio}
            </p>
          )}
        </CardContent>
        
        <CardFooter className="px-4 pb-4 pt-0 bg-transparent flex-col">
          {/* Location information */}
          {artist.location?.address && (
            <div className="text-center w-full">
              <span className="text-sm text-mirakiBlue-600 dark:text-mirakiGray-400">
                {artist.location.address}
              </span>
            </div>
          )}
          
          {/* Social Links */}
          {artist.socialLinks && (
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
              {/* Add more social icons if needed */}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ArtistCardHome;
