
import React, { useRef, useEffect } from 'react';
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

  // Set up scroll event to change center card
  useEffect(() => {
    const handleScroll = () => {
      if (carouselRef.current) {
        const items = carouselRef.current.querySelectorAll('.artwork-card-wrapper');
        const containerRect = carouselRef.current.getBoundingClientRect();
        const centerX = containerRect.left + containerRect.width / 2;
        
        let closestItem: Element | null = null;
        let closestDistance = Infinity;
        
        items.forEach((item) => {
          const itemRect = item.getBoundingClientRect();
          const itemCenterX = itemRect.left + itemRect.width / 2;
          const distance = Math.abs(centerX - itemCenterX);
          
          // Reset styles first
          (item as HTMLElement).style.zIndex = '10';
          (item as HTMLElement).style.transform = 'scale(0.9)';
          
          if (distance < closestDistance) {
            closestDistance = distance;
            closestItem = item;
          }
        });
        
        // Apply styles to center item
        if (closestItem) {
          (closestItem as HTMLElement).style.zIndex = '20';
          (closestItem as HTMLElement).style.transform = 'scale(1)';
        }
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
      <section id="featured" className="page-section">
        <div className="container-fluid">
          <h2 className="section-heading mb-8">
            Featured Artworks
          </h2>
          <p className="text-mirakiBlue-600 dark:text-mirakiGray-300 max-w-2xl mb-12">
            Discover exceptional artworks carefully selected from our collection. These pieces represent the diversity and talent of our artist community.
          </p>
          
          <div className="mt-8 px-4 py-8 relative">
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
              <CarouselContent ref={carouselRef} className="py-6">
                {featuredArtworks.map((artwork) => (
                  <CarouselItem key={artwork.id} className="pl-6 md:basis-1/2 lg:basis-1/3 sm:basis-3/4">
                    <div className="h-full transform transition-all duration-500 artwork-card-wrapper" style={{ transformOrigin: 'center', transform: 'scale(0.9)' }}>
                      <ArtworkCardHome 
                        artwork={artwork} 
                        onClick={viewArtworkDetails}
                        showFavoriteButton={true}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-end gap-4 mt-4">
                <CarouselPrevious className="relative inset-auto left-auto z-30 h-12 w-12 rounded-full bg-mirakiBlue-100 dark:bg-mirakiBlue-800 hover:bg-mirakiBlue-200 dark:hover:bg-mirakiBlue-700" />
                <CarouselNext className="relative inset-auto right-auto z-30 h-12 w-12 rounded-full bg-mirakiBlue-100 dark:bg-mirakiBlue-800 hover:bg-mirakiBlue-200 dark:hover:bg-mirakiBlue-700" />
              </div>
            </Carousel>
          </div>
          
          <div className="text-center py-12">
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
      <section id="map" className="page-section bg-mirakiBlue-50 dark:bg-mirakiBlue-950/50">
        <div className="container-fluid">
          <h2 className="section-heading mb-8">
            Find Artists Near You
          </h2>
          <p className="text-mirakiBlue-600 dark:text-mirakiGray-300 max-w-2xl mb-12">
            Discover talented artists in your area. Explore the map to find artists based on their location and view their artworks.
          </p>
          
          <div className="h-[500px] rounded-xl overflow-hidden shadow-lg">
            <MapSection artworks={featuredArtworks} onArtworkClick={viewArtworkDetails} />
          </div>
          
          <div className="text-center py-8">
            <Link 
              to="/explore#map-section"
              className="inline-flex items-center px-6 py-3 bg-mirakiGray-200 hover:bg-mirakiGray-300 text-mirakiBlue-900 font-medium rounded-md transition-colors duration-300"
            >
              Explore Map View
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
      
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
