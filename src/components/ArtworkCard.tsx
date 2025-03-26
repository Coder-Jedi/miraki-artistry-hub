
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Artwork } from '@/types';

interface ArtworkCardProps {
  artwork: Artwork;
  onClick: (artwork: Artwork) => void;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div 
      className="group cursor-pointer hover-lift rounded-lg overflow-hidden bg-white dark:bg-mirakiBlue-800 border border-mirakiGray-200 dark:border-mirakiBlue-700"
      onClick={() => onClick(artwork)}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <div className={`image-loading absolute inset-0 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`} />
        <img
          src={artwork.image}
          alt={artwork.title}
          className={`w-full h-full object-cover transform group-hover:scale-105 transition-all duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="inline-block px-2 py-1 text-xs font-medium bg-mirakiGold rounded text-mirakiBlue-900">
            {artwork.category}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg font-medium text-mirakiBlue-900 dark:text-white group-hover:text-mirakiBlue-700 dark:group-hover:text-mirakiGold transition-colors">
          {artwork.title}
        </h3>
        <p className="text-mirakiBlue-600 dark:text-mirakiGray-300 text-sm mt-1">
          by {artwork.artist}
        </p>
      </div>
    </div>
  );
};

export default ArtworkCard;
