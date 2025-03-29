
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Artwork } from '@/types';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

interface HeroProps {
  featuredArtworks: Artwork[];
}

const Hero: React.FC<HeroProps> = ({ featuredArtworks }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});
  const [imagesError, setImagesError] = useState<Record<string, boolean>>({});

  // Handle image loading state
  const handleImageLoad = (id: string) => {
    setImagesLoaded(prev => ({ ...prev, [id]: true }));
  };

  const handleImageError = (id: string, url: string) => {
    console.error(`Failed to load Hero image: ${id}, URL: ${url}`);
    setImagesError(prev => ({ ...prev, [id]: true }));
    setImagesLoaded(prev => ({ ...prev, [id]: true }));
  };

  const handleSlideChange = (index: number) => {
    const newDirection = index > activeIndex ? 'right' : 'left';
    setDirection(newDirection);
    setIsAnimating(true);
    setActiveIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <section className="relative w-full overflow-hidden bg-mirakiBlue-900 mb-16">
      <Carousel 
        className="w-full relative"
        opts={{
          align: 'start',
          loop: true,
        }}
        setApi={(api) => {
          if (api) {
            api.on('select', () => {
              const selectedIndex = api.selectedScrollSnap();
              if (selectedIndex !== activeIndex) {
                handleSlideChange(selectedIndex);
              }
            });
          }
        }}
      >
        <CarouselContent className="h-[70vh]">
          {featuredArtworks.map((artwork, index) => {
            const imageUrl = artwork.image.startsWith('http') 
              ? artwork.image 
              : `${window.location.origin}${artwork.image}`;
            
            return (
              <CarouselItem key={artwork.id} className="h-full">
                <div className="relative w-full h-full overflow-hidden">
                  {/* Load the image with animation effects */}
                  <div 
                    className={cn(
                      "absolute inset-0 w-full h-full transition-all duration-700",
                      isAnimating ? (
                        direction === 'right' 
                          ? 'animate-slide-in opacity-0' 
                          : 'animate-slide-in opacity-0'
                      ) : 'opacity-100',
                    )}
                    style={{
                      backgroundImage: `url(${imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      transformOrigin: direction === 'right' ? 'left center' : 'right center',
                    }}
                  >
                    {!imagesLoaded[artwork.id] && (
                      <div className="absolute inset-0 bg-mirakiBlue-900 animate-pulse"></div>
                    )}
                    <img 
                      src={imageUrl}
                      alt=""
                      className="hidden"
                      onLoad={() => handleImageLoad(artwork.id)}
                      onError={() => handleImageError(artwork.id, imageUrl)}
                    />
                  </div>
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-mirakiBlue-900/90 via-mirakiBlue-900/50 to-transparent" />
                  
                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-center p-8 md:p-16 z-10">
                    <div 
                      className={cn(
                        "max-w-3xl transition-all duration-500",
                        activeIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                      )}
                    >
                      <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                        {artwork.title}
                      </h1>
                      <p className="text-lg md:text-xl text-mirakiGray-200 mb-8">
                        by {artwork.artist}
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <Link 
                          to={`/artwork/${artwork.id}`}
                          className="inline-flex items-center px-6 py-3 bg-mirakiGold hover:bg-mirakiGold-600 text-mirakiBlue-900 font-medium rounded-md transition-colors duration-300"
                        >
                          View Details
                          <ArrowRight size={18} className="ml-2" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        
        <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center">
          <div className="flex space-x-2">
            {featuredArtworks.map((_, index) => (
              <button
                key={index}
                onClick={() => handleSlideChange(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  activeIndex === index 
                    ? 'bg-mirakiGold w-8' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        <CarouselPrevious 
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-mirakiBlue-800/50 text-white hover:bg-mirakiBlue-800 border-0 h-12 w-12"
          onClick={() => {
            const newIndex = activeIndex === 0 ? featuredArtworks.length - 1 : activeIndex - 1;
            handleSlideChange(newIndex);
          }}
        >
          <ChevronLeft className="h-6 w-6" />
        </CarouselPrevious>
        
        <CarouselNext 
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-mirakiBlue-800/50 text-white hover:bg-mirakiBlue-800 border-0 h-12 w-12"
          onClick={() => {
            const newIndex = (activeIndex + 1) % featuredArtworks.length;
            handleSlideChange(newIndex);
          }}
        >
          <ChevronRight className="h-6 w-6" />
        </CarouselNext>
      </Carousel>
      
      {/* Explore CTA Banner */}
      <div className="relative bg-mirakiBlue-800 py-6 px-4">
        <div className="container-fluid flex flex-col md:flex-row items-center justify-between">
          <div className="text-white mb-4 md:mb-0">
            <h2 className="text-2xl font-display">Discover Exceptional Art From Local Artists</h2>
            <p className="text-mirakiGray-300 mt-2">Explore a curated collection of unique artworks in your community</p>
          </div>
          <div className="flex gap-4">
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
      </div>
    </section>
  );
};

export default Hero;
