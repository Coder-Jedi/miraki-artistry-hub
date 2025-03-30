
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import ArtworkGrid from '@/components/ArtworkGrid';
import ArtworkModal from '@/components/ArtworkModal';
import useArtworks from '@/hooks/useArtworks';
import MapSection from '@/components/MapSection';

const Index: React.FC = () => {
  const {
    featuredArtworks,
    paginatedArtworks,
    loading,
    selectedArtwork,
    modalOpen,
    currentPage,
    totalPages,
    handlePageChange,
    viewArtworkDetails,
    closeArtworkModal,
    navigateArtwork,
  } = useArtworks(4); // Limit to 4 artworks on homepage

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
          
          <div className="mt-8">
            <ArtworkGrid 
              artworks={paginatedArtworks.slice(0, 4)} 
              loading={loading} 
              onArtworkClick={viewArtworkDetails}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
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
