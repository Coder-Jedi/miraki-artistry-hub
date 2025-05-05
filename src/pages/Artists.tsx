import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapIcon, Palette, Grid, Search, Filter, SlidersHorizontal } from 'lucide-react';
import Layout from '@/components/Layout';
import { Artist } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ArtistCardHome from '@/components/ArtistCardHome';
import ArtistMapSection from '@/components/ArtistMapSection';
import ArtistDetailsSection from '@/components/ArtistDetailsSection';
import useArtistsList, { ArtistsFilter } from '@/hooks/useArtistsList';
import { Skeleton } from '@/components/ui/skeleton';

// SearchInput component to prevent focus loss
const SearchInput = ({ initialValue = '', onSearch }: { initialValue: string, onSearch: (value: string) => void }) => {
  const [inputValue, setInputValue] = useState(initialValue);
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onSearch(newValue);
  };
  
  return (
    <div className="relative w-full md:w-auto md:min-w-[300px] flex-grow md:flex-grow-0">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mirakiBlue-400 dark:text-mirakiGray-500" size={18} />
      <Input 
        type="text"
        placeholder="Search artists..."
        value={inputValue}
        onChange={handleChange}
        className="pl-10 w-full"
      />
    </div>
  );
};

const Artists: React.FC = () => {
  const [searchParams] = useSearchParams();
  const nameFromParam = searchParams.get('name');
  const idFromParam = searchParams.get('id');
  
  // Use the useArtistsList hook for listing artists
  const {
    artists,
    loading,
    filters,
    updateFilters,
    resetAllFilters,
    areas,
    pagination
  } = useArtistsList();
  
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('list');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isArtistDetailsView, setIsArtistDetailsView] = useState(false);

  // Determine if we should show artist details based on URL parameters
  useEffect(() => {
    setIsArtistDetailsView(!!(nameFromParam || idFromParam));
  }, [nameFromParam, idFromParam]);

  // Trigger animations after page load
  useEffect(() => {
    setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);
  }, []);

  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(prev => !prev);
  };

  const handleBackToArtists = () => {
    setIsArtistDetailsView(false);
    // Update the URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.delete('name');
    url.searchParams.delete('id');
    window.history.pushState({}, '', url);
  };

  // Switch to list view from map
  const handleSwitchToListView = () => {
    setActiveTab('list');
  };

  // Handle search from the isolated component
  const handleSearch = (value: string) => {
    updateFilters({ searchQuery: value });
  };

  // Generate page numbers for display in pagination
  const getVisiblePages = () => {
    const totalPages = pagination.totalPages;
    const currentPage = pagination.currentPage;
    
    if (totalPages <= 7) {
      // If less than 7 pages, show all pages
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    if (currentPage <= 4) {
      // If current page is near the beginning
      return [1, 2, 3, 4, 5, '...', totalPages];
    }
    
    if (currentPage >= totalPages - 3) {
      // If current page is near the end
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    
    // Current page is somewhere in the middle
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  // Function to render artist grid content based on loading state
  const renderArtistContent = () => {
    if (loading) {
      return (
        <div className="mt-6">
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
      );
    }

    if (artists.length === 0) {
      return (
        <div className="text-center py-12 bg-mirakiGray-50 dark:bg-mirakiBlue-800/30 rounded-lg mt-6">
          <Palette className="mx-auto h-16 w-16 text-mirakiGray-400 dark:text-mirakiGray-600" />
          <h3 className="mt-4 text-xl font-medium text-mirakiBlue-800 dark:text-white">No Artists Found</h3>
          <p className="mt-2 text-mirakiBlue-600 dark:text-mirakiGray-300">
            Try adjusting your search or filter criteria.
          </p>
          <button
            onClick={resetAllFilters}
            className="mt-4 px-4 py-2 bg-mirakiBlue-600 text-white rounded-md hover:bg-mirakiBlue-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
          {artists.map(artist => (
            <ArtistCardHome 
              key={artist._id || artist.id} 
              artist={artist} 
            />
          ))}
        </div>
        
        {/* Pagination - only show when we have artists and more than one page */}
        {pagination.totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <Pagination>
              <PaginationContent>
                {/* Previous Page Button */}
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => pagination.setPage(Math.max(1, pagination.currentPage - 1))}
                    className={`${pagination.currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                  />
                </PaginationItem>
                
                {/* Page Numbers */}
                {getVisiblePages().map((page, idx) => 
                  page === '...' ? (
                    <PaginationItem key={`ellipsis-${idx}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={page}>
                      <PaginationLink 
                        isActive={pagination.currentPage === page} 
                        onClick={() => pagination.setPage(page as number)}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                
                {/* Next Page Button */}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => pagination.setPage(Math.min(pagination.totalPages, pagination.currentPage + 1))}
                    className={`${pagination.currentPage >= pagination.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </>
    );
  };

  // Render map content based on loading state
  const renderMapContent = () => {
    // if (loading) {
    //   return (
    //     <div className="mt-6">
    //       <Skeleton className="w-full h-[500px] rounded-lg" />
    //     </div>
    //   );
    // }

    return (
      <ArtistMapSection 
        artists={artists} 
        filters={{
          searchQuery: filters.searchQuery,
          location: filters.location,
          popularityRange: filters.popularityRange,
          sortBy: filters.sortBy,
          showAdvancedFilters
        }}
        updateFilters={(newFilters) => updateFilters(newFilters as Partial<ArtistsFilter>)}
        onViewListClick={handleSwitchToListView}
      />
    );
  };

  return (
    <Layout>
      {isArtistDetailsView ? (
        <ArtistDetailsSection 
          artistId={idFromParam || undefined} 
          artistName={nameFromParam || undefined} 
          onBackClick={handleBackToArtists} 
        />
      ) : (
        <>
          {/* Page header */}
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
          <section className="page-section py-8">
            <div className="container-fluid">
              <div className="max-w-6xl mx-auto">
                {/* Tabs with artist list and map view */}
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
                    {/* Search and Filter Bar - Always visible even during loading */}
                    <div className="mb-8 bg-white/90 dark:bg-mirakiBlue-900/90 backdrop-blur-md rounded-lg p-4 shadow-sm">
                      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        {/* Isolated search input component */}
                        <SearchInput 
                          initialValue={filters.searchQuery} 
                          onSearch={handleSearch} 
                        />
                        
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
                            </DropdownMenuContent>
                          </DropdownMenu>
                          
                          {/* Location Filter */}
                          <DropdownMenu>
                            <DropdownMenuTrigger className="inline-flex items-center px-3 py-2 border border-mirakiGray-200 dark:border-mirakiBlue-700 rounded-md bg-white dark:bg-mirakiBlue-800 text-sm text-mirakiBlue-800 dark:text-mirakiGray-200">
                              <MapIcon className="mr-2" size={16} />
                              Location
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="max-h-[300px] overflow-y-auto">
                              {areas.map(area => (
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
                              showAdvancedFilters 
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
                      <Collapsible open={showAdvancedFilters} className="mt-4">
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
                              onClick={resetAllFilters}
                              className="px-3 py-2 text-sm text-mirakiBlue-600 hover:text-mirakiBlue-800 dark:text-mirakiGray-300 dark:hover:text-white"
                            >
                              Reset Filters
                            </button>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                    
                    {/* Results Count - Always show, just updates with loading state */}
                    <div className="mb-4 flex items-center justify-between">
                      {loading ? (
                        <Skeleton className="h-6 w-48" />
                      ) : (
                        <p className="text-mirakiBlue-600 dark:text-mirakiGray-300">
                          Showing {artists.length} of {pagination.totalCount} {pagination.totalCount === 1 ? 'artist' : 'artists'}
                          {pagination.totalPages > 1 && (
                            <span className="ml-2 text-mirakiBlue-500 dark:text-mirakiGray-400">
                              (Page {pagination.currentPage} of {pagination.totalPages})
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                    
                    {/* Artist Grid - Changes based on loading state */}
                    {renderArtistContent()}
                  </TabsContent>
                  
                  {/* Map View */}
                  <TabsContent value="map" className={`transition-all duration-500 ${isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    <div className="mb-4 text-center">
                      <p className="text-mirakiBlue-600 dark:text-mirakiGray-300 text-sm">
                        Explore artists by area in an interactive map. Click on areas to see artists based there.
                      </p>
                    </div>
                    {renderMapContent()}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </section>
        </>
      )}
    </Layout>
  );
};

export default Artists;
