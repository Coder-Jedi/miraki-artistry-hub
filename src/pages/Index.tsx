
import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import ArtworkModal from '@/components/ArtworkModal';
import useArtworks from '@/hooks/useArtworks';
import MapSection from '@/components/MapSection';
import ArtworkCardHome from '@/components/ArtworkCardHome';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext 
} from '@/components/ui/carousel';

const Index: React.FC = () => {
  const {
    featuredArtworks,
    paginatedArtworks,
    loading,
    selectedArtwork,
    modalOpen,
    viewArtworkDetails,
    closeArtworkModal,
    navigateArtwork,
  } = useArtworks(4); // Limit to 4 artworks on homepage

  const carouselRef = useRef<HTMLDivElement>(null);
  const carouselApiRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Set up scroll event to change center card
  useEffect(() => {
    const handleScroll = () => {
      if (carouselApiRef.current) {
        const currentIndex = carouselApiRef.current.selectedScrollSnap();
        setActiveIndex(currentIndex);
      }
    };
    
    // Set up the API
    if (carouselApiRef.current) {
      carouselApiRef.current.on('select', handleScroll);
      carouselApiRef.current.on('scroll', handleScroll);
      // Initial setup
      setTimeout(handleScroll, 100);
    }
    
    return () => {
      if (carouselApiRef.current) {
        carouselApiRef.current.off('select', handleScroll);
        carouselApiRef.current.off('scroll', handleScroll);
      }
    };
  }, [carouselApiRef.current]);

  return (
    <Layout>
      {/* Hero Section */}
      <Hero featuredArtworks={featuredArtworks} />
      
      {/* Featured Artworks Section */}
      <section id="featured" className="page-section pt-16 pb-12">
        <div className="container-fluid">
          <h2 className="section-heading mb-4">
            Featured Artworks
          </h2>
          <p className="text-mirakiBlue-600 dark:text-mirakiGray-300 max-w-2xl mb-6">
            Discover exceptional artworks carefully selected from our collection. These pieces represent the diversity and talent of our artist community.
          </p>
          
          <div className="mt-6 py-4 relative">
            <Carousel 
              opts={{
                align: "center",
                loop: true,
                dragFree: true,
              }}
              className="w-full"
              setApi={(api) => {
                carouselApiRef.current = api;
              }}
            >
              <div className="relative">
                <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-30 h-12 w-12 lg:h-14 lg:w-14 rounded-full bg-mirakiBlue-100/80 dark:bg-mirakiBlue-800/80 hover:bg-mirakiBlue-200 dark:hover:bg-mirakiBlue-700 backdrop-blur-sm transition-all duration-300 transform hover:scale-110" />
                
                <CarouselContent ref={carouselRef} className="py-6 px-4">
                  {featuredArtworks.map((artwork, index) => (
                    <CarouselItem key={artwork.id} className="pl-4 md:basis-1/2 lg:basis-1/3 sm:basis-3/4">
                      <div 
                        className={`h-full transform transition-all duration-500 artwork-card-wrapper ${
                          index === activeIndex ? 'center' : ''
                        }`}
                      >
                        <ArtworkCardHome 
                          artwork={artwork} 
                          onClick={viewArtworkDetails}
                          showFavoriteButton={true}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                
                <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-30 h-12 w-12 lg:h-14 lg:w-14 rounded-full bg-mirakiBlue-100/80 dark:bg-mirakiBlue-800/80 hover:bg-mirakiBlue-200 dark:hover:bg-mirakiBlue-700 backdrop-blur-sm transition-all duration-300 transform hover:scale-110" />
              </div>
            </Carousel>
          </div>
          
          <div className="text-center py-8">
            <Link 
              to="/explore"
              className="inline-flex items-center px-6 py-3 bg-mirakiBlue-800 hover:bg-mirakiBlue-700 text-white font-medium rounded-md transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              Explore All Artworks
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Interactive Map Section */}
      <MapSection artworks={featuredArtworks} onArtworkClick={viewArtworkDetails} />
      
      {/* Artists Section with Link to Artists Page */}
      <section id="artists" className="page-section">
        <div className="container-fluid">
          <h2 className="section-heading mb-8">
            Featured Artists
          </h2>
          <p className="text-mirakiBlue-600 dark:text-mirakiGray-300 max-w-2xl mb-12">
            Discover the talented artists behind these extraordinary works. Each artist brings their unique perspective and creative vision to our community.
          </p>
          
          <div className="text-center py-8 max-w-xl mx-auto">
            <Link 
              to="/artists"
              className="inline-flex items-center px-6 py-3 bg-mirakiGold hover:bg-mirakiGold-600 text-mirakiBlue-900 font-medium rounded-md transition-colors duration-300"
            >
              Explore All Artists
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Artwork Modal */}
      <ArtworkModal 
        artwork={selectedArtwork} 
        isOpen={modalOpen}
        onClose={closeArtworkModal}
        onNavigate={navigateArtwork}
      />
    </Layout>
  );
};

export default Index;
