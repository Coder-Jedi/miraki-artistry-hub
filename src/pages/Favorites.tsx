
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import ArtworkGrid from '@/components/ArtworkGrid';
import ArtworkModal from '@/components/ArtworkModal';
import { useAuth } from '@/hooks/useAuth';
import { Artwork } from '@/types';
import { artworksData } from '@/data/artworks';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Artwork[]>([]);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  // For demonstration, we'll just simulate some favorites
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Simulate loading delay
    const timer = setTimeout(() => {
      // For demo purposes, we'll just use some random artworks as favorites
      const mockFavorites = artworksData.slice(0, 3); // First 3 artworks as favorites
      setFavorites(mockFavorites);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);
  
  const viewArtworkDetails = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setModalOpen(true);
  };
  
  const closeArtworkModal = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedArtwork(null), 300);
  };
  
  const navigateArtwork = (direction: 'next' | 'prev') => {
    if (!selectedArtwork || favorites.length <= 1) return;
    
    const currentIndex = favorites.findIndex(art => art.id === selectedArtwork.id);
    if (currentIndex === -1) return;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % favorites.length;
    } else {
      newIndex = (currentIndex - 1 + favorites.length) % favorites.length;
    }
    
    setSelectedArtwork(favorites[newIndex]);
  };

  return (
    <Layout>
      <section className="page-section py-16">
        <div className="container-fluid">
          <div className="max-w-4xl mx-auto text-center mb-10">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-mirakiBlue-900 dark:text-white">
              Your Favorites
            </h1>
            <p className="text-mirakiBlue-600 dark:text-mirakiGray-300 text-lg">
              A collection of artworks you've saved for inspiration or future purchase.
            </p>
          </div>
          
          {!loading && favorites.length === 0 ? (
            <div className="text-center py-20">
              <Heart size={64} className="mx-auto text-mirakiGray-300 dark:text-mirakiBlue-700 mb-6" />
              <h3 className="text-xl font-medium text-mirakiBlue-800 dark:text-mirakiGray-200 mb-3">
                No favorites yet
              </h3>
              <p className="text-mirakiBlue-600 dark:text-mirakiGray-400 max-w-md mx-auto mb-8">
                Start exploring artworks and click the heart icon to add them to your favorites collection.
              </p>
              <Button onClick={() => navigate('/explore')}>
                Explore Artworks
              </Button>
            </div>
          ) : (
            <div className="animate-fade-in">
              <ArtworkGrid 
                artworks={favorites} 
                loading={loading} 
                onArtworkClick={viewArtworkDetails}
                currentPage={1}
                totalPages={1}
                onPageChange={() => {}}
                showFavoriteButton={true}
              />
            </div>
          )}
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

export default Favorites;
