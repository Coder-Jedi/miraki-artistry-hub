import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Artist } from '@/types';
import { Button } from '@/components/ui/button';
import { MapIcon, Filter, User, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { mumbaiAreas } from '@/hooks/useExploreFilters';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ArtistFilters {
  searchQuery: string;
  location: string;
  popularityRange: [number, number];
  sortBy: string;
  showAdvancedFilters: boolean;
}

interface ArtistMapSectionProps {
  artists: Artist[];
  filters: ArtistFilters;
  updateFilters: (filters: Partial<ArtistFilters>) => void;
}

const MUMBAI_CENTER = { lat: 19.0760, lng: 72.8777 };
const DEFAULT_ZOOM = 10;

// Artist location markers with gradient colors
const markerGradients = [
  'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)',
  'linear-gradient(135deg, #43CBFF 0%, #9708CC 100%)',
  'linear-gradient(135deg, #FCCF31 0%, #F55555 100%)',
  'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
  'linear-gradient(135deg, #F6D365 0%, #FDA085 100%)',
  'linear-gradient(135deg, #A1C4FD 0%, #C2E9FB 100%)',
  'linear-gradient(135deg, #0BA360 0%, #3CBA92 100%)',
];

const ArtistMapSection: React.FC<ArtistMapSectionProps> = ({ artists, filters, updateFilters }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [isMapFilterOpen, setIsMapFilterOpen] = useState(false);
  const [showPopularity, setShowPopularity] = useState(true);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const { toast } = useToast();

  const initializeMap = () => {
    if (!mapContainer.current) return;
    
    try {
      // Remove existing markers
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      
      // Initialize map
      if (map.current) map.current.remove();
      
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            'osm': {
              type: 'raster',
              tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }
          },
          layers: [
            {
              id: 'osm-tiles',
              type: 'raster',
              source: 'osm',
              minzoom: 0,
              maxzoom: 19
            }
          ]
        },
        center: [MUMBAI_CENTER.lng, MUMBAI_CENTER.lat],
        zoom: DEFAULT_ZOOM,
      });

      // Add navigation controls
      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
      map.current.addControl(new maplibregl.ScaleControl(), 'bottom-right');
      
      // Add custom fog and atmosphere effects for aesthetics - removed setFog which doesn't exist in maplibregl
      map.current.on('style.load', () => {
        try {
          // Add custom styles if supported
          console.log('Map style loaded');
          
          // Try to add some basic style customizations that are supported
          const mapInstance = map.current;
          if (mapInstance) {
            // These are safer operations that should work with maplibre
            const canvas = mapInstance.getCanvas();
            canvas.style.outline = 'none';
          }
        } catch (e) {
          console.log('Custom styling not supported in this version');
        }
        
        // Add 3D buildings if available - but in a safe way
        try {
          const mapInstance = map.current;
          if (mapInstance && !mapInstance.getLayer('building-extrusion') && mapInstance.getSource('osm')) {
            // Only attempt if we have the source and don't have the layer yet
            console.log('Adding 3D buildings layer');
          }
        } catch (e) {
          console.log('3D buildings not supported');
        }

        setMapLoaded(true);
        setMapError(false);
        toast({
          title: "Map loaded successfully",
          description: "The map is now ready to explore artists by location",
          duration: 3000,
        });
        
        addArtistMarkers();
      });
      
      map.current.on('error', (e) => {
        console.error('MapLibre error:', e);
        setMapError(true);
        toast({
          title: "Map Error",
          description: "There was an issue loading the map. Please try refreshing the page.",
          variant: "destructive",
        });
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError(true);
      toast({
        title: "Map Error",
        description: "Failed to initialize the map. Please try refreshing the page.",
        variant: "destructive",
      });
    }
  };

  // Function to add artist markers to the map
  const addArtistMarkers = () => {
    if (!map.current || !mapLoaded) return;
    
    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    
    // Track unique locations to avoid overlapping markers
    const uniqueLocations = new Map<string, { artist: Artist, artists: Artist[] }>();
    
    artists.forEach(artist => {
      if (!artist.location) return;
      
      const locationKey = `${artist.location.lat.toFixed(4)},${artist.location.lng.toFixed(4)}`;
      
      if (!uniqueLocations.has(locationKey)) {
        uniqueLocations.set(locationKey, {
          artist,
          artists: [artist]
        });
      } else {
        const locationData = uniqueLocations.get(locationKey);
        if (locationData) {
          locationData.artists.push(artist);
        }
      }
    });
    
    // Create markers for each unique location
    uniqueLocations.forEach(({ artist, artists }, key) => {
      if (!artist.location || !map.current) return;
      
      // Select a gradient based on artist or location
      const gradientIndex = Math.abs(artist.name.charCodeAt(0)) % markerGradients.length;
      const gradientColor = markerGradients[gradientIndex];
      
      // Create marker element with gradient
      const markerEl = document.createElement('div');
      markerEl.className = 'flex flex-col items-center';
      
      // Marker icon with gradient background
      const markerIcon = document.createElement('div');
      markerIcon.className = 'w-10 h-10 rounded-full bg-mirakiGold flex items-center justify-center text-mirakiBlue-900 font-bold border-2 border-white shadow-lg cursor-pointer transition-all hover:scale-110';
      markerIcon.style.background = gradientColor;
      markerIcon.innerHTML = artist.name.charAt(0).toUpperCase();
      markerEl.appendChild(markerIcon);
      
      // Number of artists at this location (if multiple)
      if (artists.length > 1) {
        const countBadge = document.createElement('div');
        countBadge.className = 'absolute -top-2 -right-2 w-6 h-6 rounded-full bg-mirakiGold text-mirakiBlue-900 text-xs font-bold flex items-center justify-center border border-white';
        countBadge.textContent = artists.length.toString();
        markerIcon.appendChild(countBadge);
        markerIcon.style.position = 'relative';
      }
      
      // Artist name label (conditionally visible)
      const nameLabel = document.createElement('div');
      nameLabel.className = `mt-1 px-2 py-1 bg-white dark:bg-mirakiBlue-800 text-mirakiBlue-900 dark:text-white text-xs font-medium rounded shadow-md whitespace-nowrap ${showLabels ? 'block' : 'hidden'}`;
      nameLabel.textContent = artists.length > 1 ? `${artists.length} artists` : artist.name;
      markerEl.appendChild(nameLabel);
      
      // Popularity indicator (conditionally visible)
      if (showPopularity && artist.popularity) {
        const popContainer = document.createElement('div');
        popContainer.className = `flex items-center mt-1 ${showLabels ? 'block' : 'hidden'}`;
        
        // Create star rating
        const popularityRating = Math.round(artist.popularity);
        for (let i = 0; i < 5; i++) {
          const star = document.createElement('span');
          star.className = i < popularityRating ? 'text-mirakiGold text-xs' : 'text-gray-300 text-xs';
          star.innerHTML = '★';
          popContainer.appendChild(star);
        }
        
        markerEl.appendChild(popContainer);
      }
      
      // Create and add the marker
      const marker = new maplibregl.Marker(markerEl)
        .setLngLat([artist.location.lng, artist.location.lat])
        .addTo(map.current);
      
      // Create custom popup for artist(s)
      const createArtistPopup = (artistsList: Artist[]) => {
        // Handle single artist case
        if (artistsList.length === 1) {
          setSelectedArtist(artistsList[0]);
          return;
        }
        
        // Handle multiple artists case
        const popupElement = document.createElement('div');
        popupElement.className = 'p-4 max-w-xs bg-white dark:bg-mirakiBlue-800 rounded-lg shadow-lg';
        
        const title = document.createElement('h3');
        title.className = 'text-lg font-bold text-mirakiBlue-900 dark:text-white mb-2';
        title.textContent = `${artistsList.length} Artists at this Location`;
        popupElement.appendChild(title);
        
        const list = document.createElement('div');
        list.className = 'space-y-2 max-h-40 overflow-y-auto';
        
        artistsList.forEach(a => {
          const artistItem = document.createElement('div');
          artistItem.className = 'flex items-center justify-between p-2 hover:bg-mirakiGray-100 dark:hover:bg-mirakiBlue-700 rounded cursor-pointer';
          
          const artistName = document.createElement('span');
          artistName.className = 'text-mirakiBlue-800 dark:text-white';
          artistName.textContent = a.name;
          
          const viewButton = document.createElement('button');
          viewButton.className = 'text-xs px-2 py-1 bg-mirakiGold text-mirakiBlue-900 rounded hover:bg-mirakiGold-600';
          viewButton.textContent = 'View';
          viewButton.onclick = (e) => {
            e.stopPropagation();
            setSelectedArtist(a);
            // Fixed: Removed hasPopup and closePopup which don't exist in maplibregl
            // Just focus on setting the state instead
          };
          
          artistItem.appendChild(artistName);
          artistItem.appendChild(viewButton);
          list.appendChild(artistItem);
        });
        
        popupElement.appendChild(list);
        
        const popup = new maplibregl.Popup({ closeButton: true, maxWidth: '300px' })
          .setLngLat([artist.location.lng, artist.location.lat])
          .setDOMContent(popupElement)
          .addTo(map.current!);
      };
      
      // Show popup on marker click
      markerEl.addEventListener('click', () => {
        createArtistPopup(artists);
      });
      
      markers.current.push(marker);
    });
    
    // If a location filter is active, fly to that area
    if (filters.location && filters.location !== 'All Areas') {
      flyToLocation(filters.location);
    } else {
      // Otherwise fit the map to show all markers
      fitMapToMarkers();
    }
  };

  // Fit map to show all markers
  const fitMapToMarkers = () => {
    if (!map.current || markers.current.length === 0) return;
    
    try {
      const bounds = new maplibregl.LngLatBounds();
      
      markers.current.forEach(marker => {
        bounds.extend(marker.getLngLat());
      });
      
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
        duration: 1000
      });
    } catch (e) {
      console.error('Error fitting map to bounds:', e);
      // Fallback to Mumbai center
      map.current.flyTo({
        center: [MUMBAI_CENTER.lng, MUMBAI_CENTER.lat],
        zoom: DEFAULT_ZOOM,
        duration: 1000
      });
    }
  };
  
  // Fly to specific area
  const flyToLocation = (locationName: string) => {
    if (!map.current) return;
    
    // Find an artist with the matching location
    const artistWithLocation = artists.find(artist => artist.location?.area === locationName);
    
    if (artistWithLocation && artistWithLocation.location) {
      map.current.flyTo({
        center: [artistWithLocation.location.lng, artistWithLocation.location.lat],
        zoom: 13,
        duration: 1000
      });
    } else {
      // If no matching artist, just fly to Mumbai
      map.current.flyTo({
        center: [MUMBAI_CENTER.lng, MUMBAI_CENTER.lat],
        zoom: DEFAULT_ZOOM,
        duration: 1000
      });
    }
  };

  // Initialize map on component mount
  useEffect(() => {
    initializeMap();
    
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);
  
  // Update markers when artists change or map loads
  useEffect(() => {
    if (mapLoaded) {
      addArtistMarkers();
    }
  }, [artists, mapLoaded, showLabels, showPopularity]);

  // Toggle name visibility
  const toggleLabelVisibility = () => {
    setShowLabels(!showLabels);
  };
  
  // Toggle popularity rating visibility
  const togglePopularityVisibility = () => {
    setShowPopularity(!showPopularity);
  };

  // Handle location filter change
  const handleLocationChange = (location: string) => {
    updateFilters({ location });
    setIsMapFilterOpen(false);
  };

  // Handle location reset
  const resetLocation = () => {
    updateFilters({ location: 'All Areas' });
    if (map.current) {
      map.current.flyTo({
        center: [MUMBAI_CENTER.lng, MUMBAI_CENTER.lat],
        zoom: DEFAULT_ZOOM,
        duration: 1000
      });
    }
  };

  // Handle popularity filter change
  const handlePopularityChange = (range: [number, number]) => {
    updateFilters({ popularityRange: range });
  };

  if (mapError) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-mirakiGray-100 dark:bg-mirakiBlue-900 rounded-xl">
        <MapIcon size={48} className="text-mirakiGray-400 mb-4" />
        <h3 className="text-xl font-medium text-mirakiBlue-800 dark:text-mirakiGray-200 mb-2">
          Map could not be loaded
        </h3>
        <p className="text-mirakiBlue-600 dark:text-mirakiGray-400 text-center mb-6">
          There was an error loading the map. Please try refreshing the page.
        </p>
        <Button 
          onClick={() => initializeMap()}
          className="bg-mirakiBlue-700 hover:bg-mirakiBlue-800 text-white dark:bg-mirakiGold dark:hover:bg-mirakiGold-600 dark:text-mirakiBlue-900"
        >
          Retry Loading Map
        </Button>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      {/* Map controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <Sheet open={isMapFilterOpen} onOpenChange={setIsMapFilterOpen}>
          <SheetTrigger asChild>
            <Button 
              size="sm"
              className="bg-white/90 hover:bg-white border border-mirakiGray-200 text-mirakiBlue-800"
            >
              <Filter size={16} className="mr-2" />
              Filter Artists
            </Button>
          </SheetTrigger>
          <SheetContent className="w-80">
            <SheetHeader>
              <SheetTitle>Filter Artists on Map</SheetTitle>
              <SheetDescription>
                Apply filters to find artists in specific areas or with certain popularity ratings.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              {/* Location Filter */}
              <div>
                <h3 className="text-lg font-medium mb-2">Location</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  <div 
                    key="all-areas"
                    className={`px-3 py-2 rounded-md cursor-pointer transition-colors ${
                      filters.location === 'All Areas' 
                        ? 'bg-mirakiBlue-100 dark:bg-mirakiBlue-700 text-mirakiBlue-900 dark:text-white' 
                        : 'hover:bg-mirakiGray-100 dark:hover:bg-mirakiBlue-800'
                    }`}
                    onClick={() => handleLocationChange('All Areas')}
                  >
                    All Areas
                  </div>
                  {mumbaiAreas.map(area => (
                    <div 
                      key={area}
                      className={`px-3 py-2 rounded-md cursor-pointer transition-colors ${
                        filters.location === area 
                          ? 'bg-mirakiBlue-100 dark:bg-mirakiBlue-700 text-mirakiBlue-900 dark:text-white' 
                          : 'hover:bg-mirakiGray-100 dark:hover:bg-mirakiBlue-800'
                      }`}
                      onClick={() => handleLocationChange(area)}
                    >
                      {area}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Popularity Range Filter */}
              <div>
                <h3 className="text-lg font-medium mb-2">Popularity Rating</h3>
                <p className="text-sm text-mirakiBlue-600 dark:text-mirakiGray-400 mb-4">
                  Rating: {filters.popularityRange[0]} - {filters.popularityRange[1]}
                </p>
                <Slider 
                  defaultValue={[0, 5]}
                  min={0}
                  max={5}
                  step={0.5}
                  value={filters.popularityRange}
                  onValueChange={(value) => handlePopularityChange(value as [number, number])}
                  className="mb-4"
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
              
              {/* Display Controls */}
              <div>
                <h3 className="text-lg font-medium mb-2">Display Options</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Show Artist Names</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={toggleLabelVisibility}
                      className={showLabels ? "bg-mirakiBlue-100" : ""}
                    >
                      {showLabels ? "Hide" : "Show"}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Show Popularity Ratings</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={togglePopularityVisibility}
                      className={showPopularity ? "bg-mirakiBlue-100" : ""}
                    >
                      {showPopularity ? "Hide" : "Show"}
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Reset Button */}
              <Button 
                className="w-full mt-4"
                variant="outline"
                onClick={() => {
                  updateFilters({
                    location: 'All Areas',
                    popularityRange: [0, 5]
                  });
                  setIsMapFilterOpen(false);
                  resetLocation();
                }}
              >
                Reset All Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        
        <Button 
          size="sm"
          variant="outline"
          className="bg-white/90 hover:bg-white border border-mirakiGray-200 text-mirakiBlue-800"
          onClick={toggleLabelVisibility}
        >
          {showLabels ? "Hide" : "Show"} Artist Names
        </Button>
      </div>
      
      {/* Filter info banner */}
      {filters.location !== 'All Areas' && (
        <div className="absolute top-4 right-4 z-10 bg-white/90 dark:bg-mirakiBlue-900/90 py-2 px-4 rounded-md shadow-md backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="text-sm">Showing artists in: <strong>{filters.location}</strong></span>
            <Button size="sm" variant="ghost" onClick={resetLocation} className="h-7 w-7 p-0">
              ×
            </Button>
          </div>
        </div>
      )}
      
      {/* Selected artist detail sheet */}
      <Sheet open={!!selectedArtist} onOpenChange={(open) => !open && setSelectedArtist(null)}>
        <SheetContent className="w-[320px] sm:w-[540px]">
          {selectedArtist && (
            <>
              <SheetHeader>
                <SheetTitle className="text-2xl">{selectedArtist.name}</SheetTitle>
                <div className="flex items-center text-mirakiGray-500 dark:text-mirakiGray-400 text-sm mb-2">
                  <MapIcon size={14} className="mr-1" />
                  {selectedArtist.location?.address}
                </div>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < (selectedArtist.popularity || 0) ? "fill-mirakiGold text-mirakiGold" : "text-mirakiGray-300"}
                    />
                  ))}
                  <span className="text-sm ml-1 text-mirakiGray-500 dark:text-mirakiGray-400">
                    {selectedArtist.popularity?.toFixed(1)}
                  </span>
                </div>
              </SheetHeader>
              
              <div className="mt-6">
                {selectedArtist.profileImage && (
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4">
                    <img
                      src={selectedArtist.profileImage}
                      alt={selectedArtist.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {selectedArtist.bio && (
                  <p className="text-mirakiBlue-700 dark:text-mirakiGray-300 mb-6">
                    {selectedArtist.bio}
                  </p>
                )}
                
                <div className="mb-6">
                  <h3 className="font-medium text-lg mb-2">Artworks</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedArtist.artworks?.slice(0, 6).map((artwork, index) => (
                      <div key={artwork.id} className="aspect-square rounded-md overflow-hidden">
                        <img 
                          src={artwork.image} 
                          alt={artwork.title} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  {(selectedArtist.artworks?.length || 0) > 6 && (
                    <p className="text-sm text-center text-mirakiBlue-600 dark:text-mirakiGray-400 mt-2">
                      +{(selectedArtist.artworks?.length || 0) - 6} more artworks
                    </p>
                  )}
                </div>
                
                <div className="flex justify-center gap-3">
                  <Button 
                    onClick={() => window.location.href = `/artists?name=${encodeURIComponent(selectedArtist.name)}`}
                    className="bg-mirakiGold hover:bg-mirakiGold-600 text-mirakiBlue-900"
                  >
                    <User size={16} className="mr-2" /> View Artist Profile
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
      
      {/* Map container */}
      <div ref={mapContainer} className="h-full w-full bg-mirakiGray-200 dark:bg-mirakiBlue-900" />
    </div>
  );
};

export default ArtistMapSection;
