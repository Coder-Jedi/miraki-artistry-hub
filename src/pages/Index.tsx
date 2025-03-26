
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import FilterBar from '@/components/FilterBar';
import ArtworkGrid from '@/components/ArtworkGrid';
import ArtworkModal from '@/components/ArtworkModal';
import useArtworks from '@/hooks/useArtworks';

const Index: React.FC = () => {
  const {
    featuredArtworks,
    filteredArtworks,
    loading,
    filters,
    updateFilters,
    selectedArtwork,
    modalOpen,
    openArtworkModal,
    viewArtworkDetails,
    closeArtworkModal,
    navigateArtwork,
  } = useArtworks();

  return (
    <Layout>
      {/* Hero Section */}
      <Hero featuredArtworks={featuredArtworks} />
      
      {/* Explore Section */}
      <section id="explore" className="page-section">
        <div className="container-fluid">
          <h2 className="section-heading mb-16">
            Explore Artworks
          </h2>
          
          <FilterBar 
            filters={filters} 
            updateFilters={updateFilters} 
            totalArtworks={filteredArtworks.length} 
          />
          
          <div className="mt-8">
            <ArtworkGrid 
              artworks={filteredArtworks} 
              loading={loading} 
              onArtworkClick={viewArtworkDetails} 
            />
          </div>
        </div>
      </section>
      
      {/* Artists Section with Link to Artists Page */}
      <section id="artists" className="page-section bg-mirakiBlue-50 dark:bg-mirakiBlue-950/50">
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
