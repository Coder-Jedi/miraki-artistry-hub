
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapIcon, Palette, Grid, Search, Filter, SlidersHorizontal } from 'lucide-react';
import Layout from '@/components/Layout';
import { artworksData } from '@/data/artworks';
import { Artwork, Artist } from '@/types';
import ArtworkCard from '@/components/ArtworkCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { artistsData } from '@/data/artists';
import MapSection from '@/components/MapSection';
import ArtistCard from '@/components/ArtistCard';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { mumbaiAreas } from '@/hooks/useExploreFilters';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ArtistCardHome from '@/components/ArtistCardHome';
import ArtistMapSection from '@/components/ArtistMapSection';
import ArtistDetailsSection from '@/components/ArtistDetailsSection';
import useArtists from '@/hooks/useArtists';
import { Skeleton } from '@/components/ui/skeleton';

interface ArtistFilters {
  searchQuery: string;
  location: string;
  popularityRange: [number, number];
  sortBy: string;
  showAdvancedFilters: boolean;
}

const Artists: React.FC = () => {
  const [searchParams] = useSearchParams();
  const nameFromParam = searchParams.get('name');
  
  // Use the useArtists hook instead of managing artists state directly
  const { featuredArtists, loading: artistsLoading } = useArtists();
  
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('list');
  const [currentPage, setCurrentPage] = useState(1);

  // Filters state
  const [filters, setFilters] = useState<ArtistFilters>({
    searchQuery: '',
    location: 'All Areas',
    popularityRange: [0, 5],
    sortBy: 'popularity',
    showAdvancedFilters: false
  });

  // Pagination configuration
  const artistsPerPage = 9;

  useEffect(() => {
    // Log the artists data for debugging
    console.log("Artists data from useArtists:", featuredArtists);
    console.log(`Artists with locations: ${featuredArtists.filter(a => a.location).length}/${featuredArtists.length}`);
    
    // If name param exists, select that artist
    if (nameFromParam && featuredArtists.length > 0) {
      const foundArtist = featuredArtists.find(artist => 
        artist.name.toLowerCase() === nameFromParam.toLowerCase()
      );
      if (foundArtist) {
        setSelectedArtist(foundArtist);
      }
    }
    
    // Simulate API loading delay
    setTimeout(() => {
      setLoading(false);
    }, 500);

    // Trigger animations after page load
    setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);
  }, [nameFromParam, featuredArtists]);
  
  useEffect(() => {
    if (!featuredArtists.length) return;
    
    let filtered = [...featuredArtists];
    
    // Apply search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(artist => 
        artist.name.toLowerCase().includes(query) || 
        artist.bio?.toLowerCase().includes(query)
      );
    }
    
    // Apply location filter
    if (filters.location !== 'All Areas') {
      filtered = filtered.filter(artist => artist.location?.area === filters.location);
    }
    
    // Apply popularity range filter
    filtered = filtered.filter(artist => {
      const rating = artist.popularity || 0;
      return rating >= filters.popularityRange[0] && rating <= filters.popularityRange[1];
    });
    
    // Apply sorting
    switch (filters.sortBy) {
      case 'popularity':
        filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
      case 'name_asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'artwork_count':
        filtered.sort((a, b) => (b.artworks?.length || 0) - (a.artworks?.length || 0));
        break;
    }
    
    setFilteredArtists(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, featuredArtists]);

  const handleArtworkClick = (artwork: Artwork) => {
    // Navigate to artwork details
    window.location.href = `/artwork/${artwork.id}`;
  };

  const updateFilters = (newFilters: Partial<ArtistFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const toggleAdvancedFilters = () => {
    setFilters(prev => ({ ...prev, showAdvancedFilters: !prev.showAdvancedFilters }));
  };

  // Calculate the current artists to display based on pagination
  const indexOfLastArtist = currentPage * artistsPerPage;
  const indexOfFirstArtist = indexOfLastArtist - artistsPerPage;
  const currentArtists = filteredArtists.slice(indexOfFirstArtist, indexOfLastArtist);
  const totalPages = Math.ceil(filteredArtists.length / artistsPerPage);

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleBackToArtists = () => {
    setSelectedArtist(null);
  };

  if (loading || artistsLoading) {
    return (
      <Layout>
        {/* Updated loader with proper styling */}
        <section className="page-section bg-gradient-to-r from-mirakiBlue-50 to-mirakiGray-100 dark:from-mirakiBlue-900 dark:to-mirakiBlue-800 pt-24 pb-4">
          <div className="container-fluid">
            <div className="max-w-4xl mx-auto md:mx-0">
              <Skeleton className="h-12 w-2/3 mb-4" />
              <Skeleton className="h-6 w-3/4 mb-8" />
            </div>
          </div>
        </section>
        
        <div className="container-fluid py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center mb-8">
              <Skeleton className="h-12 w-80" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(index => (
                <div key={index} className="bg-white/80 dark:bg-mirakiBlue-900/80 rounded-lg border border-mirakiGray-200 dark:border-mirakiBlue-700 p-6 shadow-sm">
                  <div className="flex flex-col items-center">
                    <Skeleton className="w-32 h-32 rounded-full mb-4" />
                    <Skeleton className="h-6 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-1/4 mb-3" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Updated page header with gradient to match explore page */}
      <section id="artists" className="page-section pt-24 pb-4 bg-gradient-to-r from-mirakiBlue-50 to-mirakiGray-100 dark:from-mirakiBlue-900 dark:to-mirakiBlue-800 transition-opacity duration-1000">
        <div className="container-fluid">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-mirakiBlue-900 dark:text-white">
              Discover Artists
            </h1>
            <p className="text-mirakiBlue-600 dark:text-mirakiGray-300 text-lg mb-8">
              Explore the profiles of talented artists and their unique creations. Connect and support their journey.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      {selectedArtist ? (
        <ArtistDetailsSection artist={selectedArtist} onBackClick={handleBackToArtists} />
      ) : (
        <section className="page-section py-8">
          <div className="container-fluid">
            <div className="max-w-6xl mx-auto">
              {/* Enhanced Tabs with animated underlines and icons */}
              <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
                <div className="flex justify-center">
                  <TabsList className="mb-8 bg-white/20 dark:bg-mirakiBlue-900/20 backdrop-blur-md rounded-full p-1">
                    <TabsTrigger 
                      value="list" 
                      className="flex items-center gap-2 rounded-full px-6 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-mirakiBlue-800 data-[state=active]:shadow-md transition-all duration-300"
                    >
                      <Grid size={18} />
                      <span>Artist List</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="map" 
                      className="flex items-center gap-2 rounded-full px-6 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-mirakiBlue-800 data-[state=active]:shadow-md transition-all duration-300"
                    >
                      <MapIcon size={18} />
                      <span>Explore Map</span>
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                {/* List View with Search and Filters */}
                <TabsContent value="list" className={`transition-all duration-500 ${isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  {/* Search and Filter Bar */}
                  <div className="mb-8 bg-white/90 dark:bg-mirakiBlue-900/90 backdrop-blur-md rounded-lg p-4 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                      <div className="relative w-full md:w-auto md:min-w-[300px] flex-grow md:flex-grow-0">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mirakiBlue-400 dark:text-mirakiGray-500" size={18} />
                        <Input 
                          type="text"
                          placeholder="Search artists..."
                          value={filters.searchQuery}
                          onChange={(e) => updateFilters({ searchQuery: e.target.value })}
                          className="pl-10 w-full"
                        />
                      </div>
                      
                      <div className="flex flex-wrap gap-2 items-center">
                        {/* Sort Dropdown */}
                        <DropdownMenu>
                          <DropdownMenuTrigger className="inline-flex items-center px-3 py-2 border border-mirakiGray-200 dark:border-mirakiBlue-700 rounded-md bg-white dark:bg-mirakiBlue-800 text-sm text-mirakiBlue-800 dark:text-mirakiGray-200">
                            <SlidersHorizontal className="mr-2" size={16} />
                            Sort By
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => updateFilters({ sortBy: 'popularity' })} className={filters.sortBy === 'popularity' ? "bg-mirakiGray-100 dark:bg-mirakiBlue-700" : ""}>
                              Most Popular
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateFilters({ sortBy: 'name_asc' })} className={filters.sortBy === 'name_asc' ? "bg-mirakiGray-100 dark:bg-mirakiBlue-700" : ""}>
                              Name (A-Z)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateFilters({ sortBy: 'name_desc' })} className={filters.sortBy === 'name_desc' ? "bg-mirakiGray-100 dark:bg-mirakiBlue-700" : ""}>
                              Name (Z-A)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateFilters({ sortBy: 'artwork_count' })} className={filters.sortBy === 'artwork_count' ? "bg-mirakiGray-100 dark:bg-mirakiBlue-700" : ""}>
                              Most Artworks
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        
                        {/* Location Filter */}
                        <DropdownMenu>
                          <DropdownMenuTrigger className="inline-flex items-center px-3 py-2 border border-mirakiGray-200 dark:border-mirakiBlue-700 rounded-md bg-white dark:bg-mirakiBlue-800 text-sm text-mirakiBlue-800 dark:text-mirakiGray-200">
                            <MapIcon className="mr-2" size={16} />
                            Location
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="max-h-[300px] overflow-y-auto">
                            {mumbaiAreas.map(area => (
                              <DropdownMenuItem 
                                key={area} 
                                onClick={() => updateFilters({ location: area })}
                                className={filters.location === area ? "bg-mirakiGray-100 dark:bg-mirakiBlue-700" : ""}
                              >
                                {area}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        
                        {/* Advanced Filters Toggle */}
                        <button 
                          onClick={toggleAdvancedFilters}
                          className={`inline-flex items-center px-3 py-2 rounded-md text-sm ${
                            filters.showAdvancedFilters 
                              ? 'bg-mirakiBlue-100 text-mirakiBlue-800 dark:bg-mirakiBlue-700 dark:text-white' 
                              : 'border border-mirakiGray-200 dark:border-mirakiBlue-700 bg-white dark:bg-mirakiBlue-800 text-mirakiBlue-800 dark:text-mirakiGray-200'
                          }`}
                        >
                          <Filter className="mr-2" size={16} />
                          Advanced Filters
                        </button>
                      </div>
                    </div>
                    
                    {/* Advanced Filters Panel */}
                    <Collapsible open={filters.showAdvancedFilters} className="mt-4">
                      <CollapsibleContent className="pt-4 border-t border-mirakiGray-200 dark:border-mirakiBlue-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Popularity Range */}
                          <div>
                            <label className="text-sm font-medium text-mirakiBlue-800 dark:text-mirakiGray-200 mb-2 block">
                              Popularity Rating: {filters.popularityRange[0]} - {filters.popularityRange[1]}
                            </label>
                            <Slider 
                              defaultValue={[0, 5]}
                              min={0}
                              max={5}
                              step={0.5}
                              value={filters.popularityRange}
                              onValueChange={(value) => updateFilters({ popularityRange: value as [number, number] })}
                              className="mb-6"
                            />
                            <div className="flex justify-between text-xs text-mirakiBlue-600 dark:text-mirakiGray-400">
                              <span>0</span>
                              <span>1</span>
                              <span>2</span>
                              <span>3</span>
                              <span>4</span>
                              <span>5</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end mt-4">
                          <button 
                            onClick={() => updateFilters({
                              searchQuery: '',
                              location: 'All Areas',
                              popularityRange: [0, 5],
                              sortBy: 'popularity'
                            })}
                            className="px-3 py-2 text-sm text-mirakiBlue-600 hover:text-mirakiBlue-800 dark:text-mirakiGray-300 dark:hover:text-white"
                          >
                            Reset Filters
                          </button>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                  
                  {/* Results Count */}
                  <div className="mb-4 flex justify-between items-center">
                    <p className="text-mirakiBlue-600 dark:text-mirakiGray-300">
                      Showing {filteredArtists.length} {filteredArtists.length === 1 ? 'artist' : 'artists'}
                    </p>
                  </div>
                  
                  {/* Artists Grid - Updated to use ArtistCardHome for consistent UI */}
                  {filteredArtists.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {currentArtists.map(artist => (
                        <ArtistCardHome 
                          key={artist.id} 
                          artist={artist} 
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-mirakiGray-50 dark:bg-mirakiBlue-800/30 rounded-lg">
                      <Palette className="mx-auto h-16 w-16 text-mirakiGray-400 dark:text-mirakiGray-600" />
                      <h3 className="mt-4 text-xl font-medium text-mirakiBlue-800 dark:text-white">No Artists Found</h3>
                      <p className="mt-2 text-mirakiBlue-600 dark:text-mirakiGray-300">
                        Try adjusting your search or filter criteria.
                      </p>
                      <button
                        onClick={() => updateFilters({
                          searchQuery: '',
                          location: 'All Areas',
                          popularityRange: [0, 5]
                        })}
                        className="mt-4 px-4 py-2 bg-mirakiBlue-600 text-white rounded-md hover:bg-mirakiBlue-700 transition-colors"
                      >
                        Reset Filters
                      </button>
                    </div>
                  )}
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Pagination className="mt-10">
                      <PaginationContent>
                        {currentPage > 1 && (
                          <PaginationItem>
                            <PaginationPrevious onClick={() => paginate(currentPage - 1)} />
                          </PaginationItem>
                        )}
                        
                        {pageNumbers.map(number => {
                          // Display only current page, first page, last page, and 1 page before and after current
                          const isCurrentPage = number === currentPage;
                          const isFirstPage = number === 1;
                          const isLastPage = number === totalPages;
                          const isNearCurrentPage = Math.abs(number - currentPage) <= 1;
                          
                          if (isCurrentPage || isFirstPage || isLastPage || isNearCurrentPage) {
                            return (
                              <PaginationItem key={number}>
                                <PaginationLink
                                  isActive={isCurrentPage}
                                  onClick={() => paginate(number)}
                                >
                                  {number}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          }
                          
                          // Show ellipsis between page ranges
                          if ((currentPage > 3 && number === 2) || (currentPage < totalPages - 2 && number === totalPages - 1)) {
                            return <PaginationEllipsis key={`ellipsis-${number}`} />;
                          }
                          
                          return null;
                        })}
                        
                        {currentPage < totalPages && (
                          <PaginationItem>
                            <PaginationNext onClick={() => paginate(currentPage + 1)} />
                          </PaginationItem>
                        )}
                      </PaginationContent>
                    </Pagination>
                  )}
                </TabsContent>
                
                {/* Enhanced Map View with Snapchat-style visualization */}
                <TabsContent value="map" className={`transition-all duration-500 ${isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <div className="mb-4 text-center">
                    <p className="text-mirakiBlue-600 dark:text-mirakiGray-300 text-sm">
                      Explore artists by area in an interactive map. Click on areas to see artists based there.
                    </p>
                  </div>
                  <ArtistMapSection 
                    artists={filteredArtists} 
                    filters={filters}
                    updateFilters={updateFilters}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default Artists;
