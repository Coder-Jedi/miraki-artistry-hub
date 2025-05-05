import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import ArtworkModal from '@/components/ArtworkModal';
import useArtworks from '@/hooks/useArtworks';
import useArtists from '@/hooks/useArtists';
import ArtworkCardHome from '@/components/ArtworkCardHome';
import ArtistCardHome from '@/components/ArtistCardHome';
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

  const { featuredArtists } = useArtists(8); // Limit to 8 artists on homepage

  const artworkCarouselRef = useRef<HTMLDivElement>(null);
  const artworkCarouselApiRef = useRef<any>(null);
  const [artworkActiveIndex, setArtworkActiveIndex] = useState(0);
  
  const artistCarouselRef = useRef<HTMLDivElement>(null);
  const artistCarouselApiRef = useRef<any>(null);
  const [artistActiveIndex, setArtistActiveIndex] = useState(0);

  // Auto carousel scroll effects
  useEffect(() => {
    const handleArtworkScroll = () => {
      if (artworkCarouselApiRef.current) {
        const currentIndex = artworkCarouselApiRef.current.selectedScrollSnap();
        setArtworkActiveIndex(currentIndex);
      }
    };
    
    // Set up the API
    if (artworkCarouselApiRef.current) {
      artworkCarouselApiRef.current.on('select', handleArtworkScroll);
      artworkCarouselApiRef.current.on('scroll', handleArtworkScroll);
      // Initial setup
      setTimeout(handleArtworkScroll, 100);
    }
    
    return () => {
      if (artworkCarouselApiRef.current) {
        artworkCarouselApiRef.current.off('select', handleArtworkScroll);
        artworkCarouselApiRef.current.off('scroll', handleArtworkScroll);
      }
    };
  }, [artworkCarouselApiRef.current]);

  // Set up scroll event to change center card for artists
  useEffect(() => {
    const handleArtistScroll = () => {
      if (artistCarouselApiRef.current) {
        const currentIndex = artistCarouselApiRef.current.selectedScrollSnap();
        setArtistActiveIndex(currentIndex);
      }
    };
    
    // Set up the API
    if (artistCarouselApiRef.current) {
      artistCarouselApiRef.current.on('select', handleArtistScroll);
      artistCarouselApiRef.current.on('scroll', handleArtistScroll);
      // Initial setup
      setTimeout(handleArtistScroll, 100);
    }
    
    return () => {
      if (artistCarouselApiRef.current) {
        artistCarouselApiRef.current.off('select', handleArtistScroll);
        artistCarouselApiRef.current.off('scroll', handleArtistScroll);
      }
    };
  }, [artistCarouselApiRef.current]);

  return (
    <Layout>
      {/* Combined Hero Section with Header */}
      <HeroSection featuredArtworks={featuredArtworks} />
      
      {/* Featured Artworks Section */}
      <section id="featured" className="page-section pt-16 pb-12">
        <div className="container-fluid">
          <h2 className="section-heading mb-4">
            Featured Artworks
          </h2>
          <p className="text-mirakiBlue-600 dark:text-mirakiGray-300 max-w-2xl mb-6 mt-8">
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
                artworkCarouselApiRef.current = api;
              }}
            >
              <div className="relative">
                <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-30 h-12 w-12 lg:h-14 lg:w-14 rounded-full bg-mirakiBlue-100/80 dark:bg-mirakiBlue-800/80 hover:bg-mirakiBlue-200 dark:hover:bg-mirakiBlue-700 backdrop-blur-sm transition-all duration-300 transform hover:scale-110" />
                
                <CarouselContent ref={artworkCarouselRef} className="py-6 px-4">
                  {featuredArtworks.map((artwork, index) => (
                    <CarouselItem key={artwork._id} className="pl-4 md:basis-1/2 lg:basis-1/3 sm:basis-3/4">
                      <div 
                        className={`h-full transform transition-all duration-500 artwork-card-wrapper ${
                          index === artworkActiveIndex ? 'center' : ''
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
      
      {/* Artists Section with Link to Artists Page */}
      <section id="artists" className="page-section">
        <div className="container-fluid">
          <h2 className="section-heading mb-4">
            Featured Artists
          </h2>
          <p className="text-mirakiBlue-600 dark:text-mirakiGray-300 max-w-2xl mb-6 mt-8">
            Discover the talented artists behind these extraordinary works. Each artist brings their unique perspective and creative vision to our community.
          </p>
          
          <div className="mt-6 py-4 relative">
            <Carousel 
              opts={{
                align: "center",
                loop: true, // Enable infinite looping for circular carousel
                dragFree: false, // Disable drag-free to ensure proper looping
              }}
              className="w-full"
              setApi={(api) => {
                artistCarouselApiRef.current = api;
              }}
            >
              <div className="relative">
                <CarouselPrevious 
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-30 h-12 w-12 lg:h-14 lg:w-14 rounded-full bg-mirakiBlue-100/80 dark:bg-mirakiBlue-800/80 hover:bg-mirakiBlue-200 dark:hover:bg-mirakiBlue-700 backdrop-blur-sm transition-all duration-300 transform hover:scale-110 pointer-events-auto disabled:pointer-events-none"
                />
                
                <CarouselContent ref={artistCarouselRef} className="py-6 px-4">
                  {featuredArtists.map((artist, index) => (
                    <CarouselItem key={artist._id} className="pl-4 md:basis-1/2 lg:basis-1/3 sm:basis-3/4">
                      <div 
                        className={`h-full transform transition-all duration-500 artist-card-wrapper border-2 rounded-lg shadow-lg ${
                          index === artistActiveIndex 
                            ? 'border-mirakiGold shadow-mirakiGold/50 hover:border-mirakiBlue-700 hover:shadow-mirakiBlue/50' 
                            : 'border-transparent shadow-none hover:border-mirakiBlue-700 hover:shadow-mirakiBlue/50'
                        }`}
                      >
                        <ArtistCardHome 
                          artist={artist} 
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                
                <CarouselNext 
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-30 h-12 w-12 lg:h-14 lg:w-14 rounded-full bg-mirakiBlue-100/80 dark:bg-mirakiBlue-800/80 hover:bg-mirakiBlue-200 dark:hover:bg-mirakiBlue-700 backdrop-blur-sm transition-all duration-300 transform hover:scale-110 pointer-events-auto disabled:pointer-events-none"
                />
              </div>
            </Carousel>
          </div>
          
          <div className="text-center py-8">
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
