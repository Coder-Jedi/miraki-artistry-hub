
import React from 'react';
import { Artwork } from '@/types';
import ArtworkCard from './ArtworkCard';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

interface ArtworkGridProps {
  artworks: Artwork[];
  loading: boolean;
  onArtworkClick: (artwork: Artwork) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFavoriteButton?: boolean;
}

const ArtworkGrid: React.FC<ArtworkGridProps> = ({ 
  artworks, 
  loading, 
  onArtworkClick,
  currentPage,
  totalPages,
  onPageChange,
  showFavoriteButton = false
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="rounded-lg overflow-hidden">
            <div className="aspect-[4/3] image-loading" />
            <div className="p-4 bg-white dark:bg-mirakiBlue-800 border border-mirakiGray-200 dark:border-mirakiBlue-700 border-t-0">
              <div className="h-6 w-2/3 rounded-md bg-mirakiGray-200 dark:bg-mirakiBlue-700 animate-pulse mb-2" />
              <div className="h-4 w-1/2 rounded-md bg-mirakiGray-200 dark:bg-mirakiBlue-700 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (artworks.length === 0) {
    return (
      <div className="py-20 text-center">
        <h3 className="text-xl font-medium text-mirakiBlue-800 dark:text-mirakiGray-200 mb-2">No artworks found</h3>
        <p className="text-mirakiBlue-600 dark:text-mirakiGray-400">Try adjusting your filters or search criteria</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {artworks.map((artwork, index) => (
          <div 
            key={artwork.id}
            className="opacity-0 animate-fade-in"
            style={{
              animationDelay: `${Math.random() * 0.5}s`,
              animationFillMode: 'forwards'
            }}
          >
            <ArtworkCard 
              artwork={artwork} 
              onClick={onArtworkClick}
              showFavoriteButton={showFavoriteButton}
            />
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  className={`${currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <PaginationItem key={page}>
                  <PaginationLink 
                    isActive={currentPage === page}
                    onClick={() => onPageChange(page)}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                  className={`${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default ArtworkGrid;
