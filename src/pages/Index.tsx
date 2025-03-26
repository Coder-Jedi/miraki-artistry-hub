
import React from 'react';
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
              onArtworkClick={openArtworkModal} 
            />
          </div>
        </div>
      </section>
      
      {/* Artists Section Placeholder - To be implemented */}
      <section id="artists" className="page-section bg-mirakiBlue-50 dark:bg-mirakiBlue-950/50">
        <div className="container-fluid">
          <h2 className="section-heading mb-8">
            Featured Artists
          </h2>
          <p className="text-mirakiBlue-600 dark:text-mirakiGray-300 max-w-2xl mb-12">
            Discover the talented artists behind these extraordinary works. Each artist brings their unique perspective and creative vision to our community.
          </p>
          
          {/* Artist feature coming soon message */}
          <div className="text-center py-16 max-w-xl mx-auto">
            <div className="bg-white/50 dark:bg-mirakiBlue-900/50 border border-mirakiGray-200 dark:border-mirakiBlue-700 rounded-lg p-8">
              <h3 className="font-display text-xl font-medium text-mirakiBlue-800 dark:text-white mb-4">
                Artist Profiles Coming Soon
              </h3>
              <p className="text-mirakiBlue-600 dark:text-mirakiGray-300">
                We're working on detailed artist profiles to help you connect with the creative minds behind these amazing artworks. Check back soon!
              </p>
            </div>
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
