import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapIcon, Palette, Grid, Search, Filter, SlidersHorizontal, Star } from 'lucide-react';
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

// Using the Artist type from types/index.ts instead of redefining it here

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
  const [artists, setArtists] = useState<Artist[]>([]);
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
    // Organize artworks by artist
    const artistMap = new Map<string, Artwork[]>();
    
    artworksData.forEach(artwork => {
      if (!artistMap.has(artwork.artist)) {
        artistMap.set(artwork.artist, []);
      }
      artistMap.get(artwork.artist)?.push(artwork);
    });
    
    // Convert map to array of Artist objects
    const artistsArray: Artist[] = [];
    artistMap.forEach((artworks, name) => {
      // Find matching artist from artistsData
      const artistData = artistsData.find(artist => artist.name === name);
      
      artistsArray.push({
        id: artistData?.id || `artist-${artistsArray.length + 1}`,
        name,
        artworks,
        bio: artistData?.bio,
        location: artistData?.location,
        profileImage: artistData?.profileImage || artworks[0].image,
        socialLinks: artistData?.socialLinks,
        // Assign random popularity rating from 1.0 to 5.0
        popularity: artistData?.popularity || parseFloat((2.5 + Math.random() * 2.5).toFixed(1))
      });
    });
    
    setArtists(artistsArray);
    setFilteredArtists(artistsArray);
    
    // If name param exists, select that artist
    if (nameFromParam) {
      const foundArtist = artistsArray.find(artist => 
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
  }, [nameFromParam]);
  
  useEffect(() => {
    if (!artists.length) return;
    
    let filtered = [...artists];
    
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
        filtered.sort((a, b) => b.artworks.length - a.artworks.length);
        break;
    }
    
    setFilteredArtists(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, artists]);

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

  if (loading) {
    return (
      <Layout>
        <div className="container-fluid py-24">
          <div className="max-w-6xl mx-auto">
            <h1 className="section-heading mb-12">Artists</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(index => (
                <div key={index} className="animate-pulse">
                  <div className="h-64 bg-mirakiGray-200 dark:bg-mirakiBlue-700 rounded-lg mb-4"></div>
                  <div className="h-6 w-2/3 bg-mirakiGray-200 dark:bg-mirakiBlue-700 rounded mb-2"></div>
                  <div className="h-4 w-1/2 bg-mirakiGray-200 dark:bg-mirakiBlue-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    // ... keep existing code (component JSX)
    <Layout>
      {/* Page Header with enhanced gradient */}
      <section id="artists" className={`page-section pt-24 pb-4 bg-gradient-to-r from-mirakiBlue-600 via-mirakiBlue-500 to-mirakiBlue-400 dark:from-mirakiBlue-900 dark:via-mirakiBlue-800 dark:to-mirakiBlue-700 transition-opacity duration-1000 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="container-fluid">
          <div className="max-w-4xl mx-auto md:mx-0 animate-fade-in opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
              {selectedArtist ? `${selectedArtist.name}` : 'Discover Artists'}
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8">
              {selectedArtist 
                ? `Explore the unique creative vision of ${selectedArtist.name} through their art collection.`
                : 'Meet the talented artists behind our curated collection of artworks, each with their own unique style and perspective.'}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="page-section py-8">
        <div className="container-fluid">
          <div className="max-w-6xl mx-auto">
            
            {/* Only show tabs when not viewing a specific artist */}
            {!selectedArtist ? (
              <Tabs defaultValue="list" onValueChange={setActiveTab} className="w-full mb-8">
                <div className="flex justify-center">
                  <TabsList className="mb-8">
                    <TabsTrigger value="list" className="flex items-center gap-2">
                      <Grid size={18} />
                      <span>Explore List</span>
                    </TabsTrigger>
                    <TabsTrigger value="map" className="flex items-center gap-2">
                      <MapIcon size={18} />
                      <span>Explore on Map</span>
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
                  
                  {/* Artists Grid */}
                  {filteredArtists.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {currentArtists.map(artist => (
                        <ArtistCard 
                          key={artist.id} 
                          artist={artist} 
                          onClick={() => setSelectedArtist(artist)}
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
                
                {/* Map View */}
                <TabsContent value="map" className={`transition-all duration-500 ${isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <div className="h-[600px] rounded-lg overflow-hidden">
                    <MapSection artworks={artworksData} onArtworkClick={handleArtworkClick} />
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <>
                <div className="mb-12">
                  <div className="flex flex-col md:flex-row items-start gap-8">
                    <div className="w-full md:w-1/3">
                      <div className="aspect-square overflow-hidden rounded-lg bg-mirakiGray-100 dark:bg-mirakiBlue-800">
                        <img 
                          src={selectedArtist.profileImage} 
                          alt={selectedArtist.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="w-full md:w-2/3">
                      <h2 className="font-display text-3xl font-semibold text-mirakiBlue-900 dark:text-white mb-4">
                        {selectedArtist.name}
                      </h2>
                      <p className="text-mirakiBlue-600 dark:text-mirakiGray-300 mb-6">
                        {selectedArtist.bio}
                      </p>
                      <div className="flex items-center gap-4">
                        <button className="bg-mirakiGold hover:bg-mirakiGold-600 text-mirakiBlue-900 px-4 py-2 rounded-md transition-colors">
                          Contact Artist
                        </button>
                        <button 
                          onClick={() => setSelectedArtist(null)}
                          className="border border-mirakiGray-300 dark:border-mirakiBlue-700 hover:bg-mirakiGray-100 dark:hover:bg-mirakiBlue-800 px-4 py-2 rounded-md transition-colors"
                        >
                          View All Artists
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              
                <h3 className="font-display text-2xl font-medium text-mirakiBlue-900 dark:text-white mb-8">
                  Artworks by {selectedArtist.name}
                </h3>
              
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {selectedArtist.artworks?.map(artwork => (
                    <ArtworkCard 
                      key={artwork.id}
                      artwork={artwork}
                      onClick={handleArtworkClick}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Artists;
