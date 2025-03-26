
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Artwork } from '@/types';

interface HeroProps {
  featuredArtworks: Artwork[];
}

const Hero: React.FC<HeroProps> = ({ featuredArtworks }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});
  
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
    setImagesLoaded(prev => ({ ...prev, [id]: true }));
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Carousel */}
      <div className="absolute inset-0 w-full h-full">
        {featuredArtworks.map((artwork, index) => {
          // Create a hidden image element to preload and check loading status
          return (
            <div
              key={artwork.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
                currentSlide === index ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img 
                src={artwork.image}
                alt=""
                className="hidden"
                onLoad={() => handleImageLoad(artwork.id)}
                onError={() => handleImageLoad(artwork.id)} // Mark as loaded even on error
              />
              <div 
                className="absolute inset-0 w-full h-full"
                style={{
                  backgroundImage: `url(${artwork.image})`,
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
              <div className="absolute inset-0 bg-gradient-to-t from-mirakiBlue-900/90 via-mirakiBlue-900/50 to-transparent" />
            </div>
          );
        })}
      </div>
      
      {/* Content */}
      <div className="container relative z-10 h-full flex flex-col justify-center pt-24">
        <div className="max-w-3xl animate-fade-in opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Discover Exceptional Art From Local Artists
          </h1>
          <p className="text-lg md:text-xl text-mirakiGray-200 mb-8">
            Explore a curated collection of unique artworks created by talented artists in your community. Support local creativity and find your next masterpiece.
          </p>
          <div className="flex flex-wrap gap-4">
            <a 
              href="#explore" 
              className="inline-flex items-center px-6 py-3 bg-mirakiGold hover:bg-mirakiGold-600 text-mirakiBlue-900 font-medium rounded-md transition-colors duration-300"
            >
              Explore Artworks
              <ArrowRight size={18} className="ml-2" />
            </a>
            <Link 
              to="/artists" 
              className="px-6 py-3 border border-white/30 hover:bg-white/10 text-white font-medium rounded-md transition-colors duration-300"
            >
              Meet the Artists
            </Link>
          </div>
        </div>

        {/* Current Artwork Info */}
        <div className="absolute bottom-12 left-0 right-0 container">
          <div className="bg-white/10 backdrop-blur-md p-4 md:p-6 rounded-lg max-w-md animate-slide-in opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
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
        <div className="absolute bottom-12 right-12 z-20">
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
    </section>
  );
};

export default Hero;
