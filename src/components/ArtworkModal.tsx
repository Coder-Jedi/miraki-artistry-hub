
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, ExternalLink, ImageOff } from 'lucide-react';
import { Artwork } from '@/types';

interface ArtworkModalProps {
  artwork: Artwork | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (direction: 'next' | 'prev') => void;
}

const ArtworkModal: React.FC<ArtworkModalProps> = ({
  artwork,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [modalClass, setModalClass] = useState('opacity-0 scale-95');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        onNavigate('next');
      } else if (e.key === 'ArrowLeft') {
        onNavigate('prev');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNavigate]);

  // Handle animation
  useEffect(() => {
    if (isOpen) {
      setModalClass('opacity-100 scale-100');
      document.body.style.overflow = 'hidden';
      // Reset states when modal opens with new artwork
      setImageLoaded(false);
      setImageError(false);
    } else {
      setModalClass('opacity-0 scale-95');
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, artwork]);
  
  if (!artwork) return null;

  const handleImageError = () => {
    console.error(`Failed to load image in modal: ${artwork.image}`);
    setImageError(true);
    setImageLoaded(true); // We still consider it "loaded" to remove loading indicator
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      } transition-opacity duration-300`}
    >
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm ${
          isOpen ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-300`}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div
        className={`relative bg-white dark:bg-mirakiBlue-900 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row transition-all duration-400 ${modalClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>
        
        {/* Navigation Buttons */}
        <button
          onClick={() => onNavigate('prev')}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Previous artwork"
        >
          <ChevronLeft size={24} />
        </button>
        
        <button
          onClick={() => onNavigate('next')}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Next artwork"
        >
          <ChevronRight size={24} />
        </button>
        
        {/* Image */}
        <div className="relative md:w-[55%] h-[300px] md:h-auto overflow-hidden bg-mirakiBlue-950 dark:bg-mirakiBlue-950">
          <div className={`image-loading absolute inset-0 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`} />
          
          {imageError ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <ImageOff size={48} className="text-mirakiGray-400 mb-2" />
              <p className="text-mirakiGray-400">Image unavailable</p>
            </div>
          ) : (
            <img
              src={artwork.image}
              alt={artwork.title}
              className={`w-full h-full object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              onError={handleImageError}
            />
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          <span className="inline-block px-3 py-1 text-sm font-medium bg-mirakiGold/10 text-mirakiGold border border-mirakiGold/20 rounded-full mb-4">
            {artwork.category}
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-medium text-mirakiBlue-900 dark:text-white mb-2">
            {artwork.title}
          </h2>
          <p className="text-lg text-mirakiBlue-700 dark:text-mirakiGray-300 mb-6">
            by {artwork.artist}
          </p>
          <div className="prose prose-mirakiBlue dark:prose-invert max-w-none">
            <p className="text-mirakiBlue-800 dark:text-mirakiGray-200">
              {artwork.description}
            </p>
          </div>
          
          {artwork.location && (
            <div className="mt-6 pt-6 border-t border-mirakiGray-200 dark:border-mirakiBlue-700">
              <h3 className="font-medium text-mirakiBlue-900 dark:text-white mb-2">Location</h3>
              <p className="text-mirakiBlue-700 dark:text-mirakiGray-300">
                {artwork.location.address}
              </p>
            </div>
          )}
          
          <div className="mt-6 flex justify-between items-center">
            <Link 
              to={`/artists?name=${encodeURIComponent(artwork.artist)}`}
              className="text-mirakiBlue-700 dark:text-mirakiGray-300 hover:text-mirakiBlue-900 dark:hover:text-white"
            >
              View Artist Profile
            </Link>
            <Link 
              to={`/artwork/${artwork.id}`}
              className="inline-flex items-center text-mirakiGold hover:text-mirakiGold-600 font-medium"
            >
              Full Details
              <ExternalLink size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkModal;
