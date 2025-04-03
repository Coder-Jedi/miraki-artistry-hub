
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ImageOff } from 'lucide-react';
import { Artwork } from '@/types';

interface HeroProps {
  featuredArtworks: Artwork[];
}

const Hero: React.FC<HeroProps> = ({ featuredArtworks }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});
  const [imagesError, setImagesError] = useState<Record<string, boolean>>({});
  
  // Auto-rotation for carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredArtworks.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [featuredArtworks.length]);
  
  // Manual navigation
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Track image loading
  const handleImageLoad = (id: string) => {
    console.log(`Hero image loaded successfully: ${id}`);
    setImagesLoaded(prev => ({ ...prev, [id]: true }));
  };

  // Track image error
  const handleImageError = (id: string, url: string) => {
    console.error(`Failed to load Hero image: ${id}, URL: ${url}`);
    setImagesError(prev => ({ ...prev, [id]: true }));
    setImagesLoaded(prev => ({ ...prev, [id]: true })); // Mark as loaded to remove loading state
  };

  return (
    <section className="relative w-full py-6 md:py-12 overflow-hidden bg-mirakiGray-50 dark:bg-mirakiBlue-900/30">
      {/* Background Carousel */}
      <div className="container-fluid">
        <div className="relative aspect-video md:aspect-[21/9] overflow-hidden rounded-2xl shadow-xl">
          {featuredArtworks.map((artwork, index) => {
            // Get full URL for the image
            const imageUrl = artwork.image.startsWith('http') 
              ? artwork.image 
              : `${window.location.origin}${artwork.image}`;
            
            return (
              <div
                key={artwork.id}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
                  currentSlide === index ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {/* Hidden image for preloading */}
                <img 
                  src={imageUrl}
                  alt=""
                  className="hidden"
                  onLoad={() => handleImageLoad(artwork.id)}
                  onError={() => handleImageError(artwork.id, imageUrl)}
                />
                
                {imagesError[artwork.id] ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-mirakiBlue-900">
                    <div className="flex flex-col items-center text-center p-4">
                      <ImageOff size={64} className="text-mirakiGray-400 mb-4" />
                      <p className="text-mirakiGray-300 text-xl">Image not available</p>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="absolute inset-0 w-full h-full"
                    style={{
                      backgroundImage: `url(${imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      opacity: imagesLoaded[artwork.id] ? 1 : 0,
                      transition: 'opacity 0.5s ease-in-out'
                    }}
                  >
                    {!imagesLoaded[artwork.id] && (
                      <div className="absolute inset-0 bg-mirakiBlue-900 animate-pulse"></div>
                    )}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-mirakiBlue-900/90 via-mirakiBlue-900/50 to-transparent" />
              </div>
            );
          })}
        
          {/* Current Artwork Info */}
          <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 right-0 max-w-md">
            <div className="bg-white/10 backdrop-blur-md p-4 md:p-6 rounded-lg animate-slide-in opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
              <h3 className="font-display text-xl text-white">
                {featuredArtworks[currentSlide]?.title}
              </h3>
              <p className="text-mirakiGray-200 mt-2">
                by {featuredArtworks[currentSlide]?.artist}
              </p>
              <Link 
                to={`/artwork/${featuredArtworks[currentSlide]?.id}`}
                className="mt-4 inline-flex items-center text-mirakiGold hover:text-mirakiGold-600 transition-colors"
              >
                View Details
                <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 z-20">
            <div className="flex space-x-2">
              {featuredArtworks.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    currentSlide === index 
                      ? 'bg-mirakiGold w-8' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
