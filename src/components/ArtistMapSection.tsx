
import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Artist } from '@/types';
import { Button } from '@/components/ui/button';
import { MapIcon, Filter, User, Star, Layers, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mumbaiAreas } from '@/hooks/useExploreFilters';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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

// Define a common type for area coordinates to ensure all have the same structure
type AreaCoordinate = {
  lat: number;
  lng: number;
  zoom: number;
  color: string;
};

// Mumbai area coordinates and styling
const areaCoordinates: Record<string, AreaCoordinate> = {
  'All Areas': { lat: 19.0760, lng: 72.8777, zoom: 10, color: '#FFFFFF' }, // Add color property
  'Bandra': { lat: 19.0596, lng: 72.8295, zoom: 13.5, color: '#FF9A9E' },
  'Colaba': { lat: 18.9067, lng: 72.8147, zoom: 13.5, color: '#43CBFF' },
  'Dadar': { lat: 19.0178, lng: 72.8478, zoom: 13.5, color: '#FCCF31' },
  'Fort': { lat: 18.9340, lng: 72.8340, zoom: 13.5, color: '#667EEA' },
  'Juhu': { lat: 19.1075, lng: 72.8263, zoom: 13.5, color: '#F6D365' },
  'Kala Ghoda': { lat: 18.9281, lng: 72.8319, zoom: 14, color: '#A1C4FD' },
  'Lower Parel': { lat: 18.9982, lng: 72.8270, zoom: 13.5, color: '#0BA360' },
  'Malabar Hill': { lat: 18.9548, lng: 72.7985, zoom: 13.5, color: '#FF9A9E' },
  'Marine Drive': { lat: 18.9442, lng: 72.8239, zoom: 13.5, color: '#43CBFF' },
  'Powai': { lat: 19.1176, lng: 72.9081, zoom: 13.5, color: '#FCCF31' },
  'Worli': { lat: 19.0096, lng: 72.8173, zoom: 13.5, color: '#667EEA' },
  'Andheri': { lat: 19.1136, lng: 72.8697, zoom: 13.5, color: '#F6D365' },
  'Navi Mumbai - Vashi': { lat: 19.0748, lng: 73.0008, zoom: 13.5, color: '#A1C4FD' },
  'Navi Mumbai - Belapur': { lat: 19.0237, lng: 73.0400, zoom: 13.5, color: '#0BA360' },
  'Navi Mumbai - Nerul': { lat: 19.0353, lng: 73.0197, zoom: 13.5, color: '#FF9A9E' },
  'Navi Mumbai - Kharghar': { lat: 19.0474, lng: 73.0658, zoom: 13.5, color: '#43CBFF' }
};

const MUMBAI_CENTER = { lat: 19.0760, lng: 72.8777 };
const DEFAULT_ZOOM = 10;

const ArtistMapSection: React.FC<ArtistMapSectionProps> = ({ artists, filters, updateFilters }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);
  const activeArea = useRef<maplibregl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);
  const [artistsByArea, setArtistsByArea] = useState<Record<string, Artist[]>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showMenu, setShowMenu] = useState(true);
  const { toast } = useToast();

  // Group artists by area and count them
  useEffect(() => {
    const groupedArtists: Record<string, Artist[]> = {};
    
    // Initialize all areas with empty arrays
    Object.keys(areaCoordinates).forEach(area => {
      if (area !== 'All Areas') {
        groupedArtists[area] = [];
      }
    });
    
    // Group artists by area
    artists.forEach(artist => {
      const area = artist.location?.area;
      if (area && area !== 'All Areas' && area in groupedArtists) {
        groupedArtists[area].push(artist);
      }
    });
    
    console.log('Artists grouped by area:', Object.entries(groupedArtists).map(([area, artists]) => 
      ({ area, count: artists.length })));
    setArtistsByArea(groupedArtists);
  }, [artists]);
  
  // Initialize map with dark style
  const initializeMap = () => {
    console.log('Initializing map...');
    if (!mapContainer.current) {
      console.error('Map container ref is null');
      return;
    }
    
    try {
      // Remove existing markers
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      
      // Initialize map
      if (map.current) map.current.remove();
      
      // Dark mode map style inspired by Snapchat
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            'osm': {
              type: 'raster',
              tiles: ['https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'],
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
        pitch: 30, // Add slight tilt for 3D effect
        bearing: 15, // Slight rotation for dynamic feel
      });

      // Add minimal navigation controls
      map.current.addControl(new maplibregl.NavigationControl({
        showCompass: true,
        showZoom: true,
        visualizePitch: true
      }), 'bottom-right');
      
      // Add scale control
      map.current.addControl(
        new maplibregl.ScaleControl({
          maxWidth: 100,
          unit: 'metric'
        }),
        'bottom-left'
      );
      
      map.current.on('load', () => {
        console.log('Map loaded successfully');
        setMapLoaded(true);
        setMapError(false);
        toast({
          title: "Map loaded successfully",
          description: "Explore artists by areas in Mumbai",
          duration: 3000,
        });
        
        // Add area markers
        addAreaMarkers();
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

  // Function to add area markers to the map
  const addAreaMarkers = () => {
    if (!map.current || !mapLoaded) {
      console.log('Map not ready for markers');
      return;
    }
    
    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    
    // For each area, create a circular area marker
    Object.entries(areaCoordinates).forEach(([areaName, coords]) => {
      if (areaName === 'All Areas') return;
      
      const artistCount = artistsByArea[areaName]?.length || 0;
      
      // Skip areas with no artists unless specifically filtered
      if (artistCount === 0 && filters.location !== areaName) return;
      
      // Create marker element
      const el = document.createElement('div');
      el.className = 'area-marker';
      el.style.cursor = 'pointer';
      
      // Area bubble with artist count
      const bubble = document.createElement('div');
      bubble.className = `flex items-center justify-center rounded-full transition-all duration-300 shadow-lg`;
      bubble.style.width = `${Math.max(60, 40 + artistCount * 5)}px`;
      bubble.style.height = `${Math.max(60, 40 + artistCount * 5)}px`;
      bubble.style.background = `radial-gradient(circle, ${coords.color}cc 0%, ${coords.color}66 100%)`;
      bubble.style.border = `2px solid ${coords.color}`;
      
      // Inner content with area name and artist count
      const content = document.createElement('div');
      content.className = 'flex flex-col items-center justify-center text-center p-1';
      
      const nameEl = document.createElement('div');
      nameEl.className = 'text-xs font-bold text-white';
      nameEl.textContent = areaName.length > 10 ? areaName.split(' ')[0] : areaName;
      
      const countEl = document.createElement('div');
      countEl.className = 'text-xs font-semibold text-white';
      countEl.textContent = `${artistCount} ${artistCount === 1 ? 'artist' : 'artists'}`;
      
      content.appendChild(nameEl);
      content.appendChild(countEl);
      bubble.appendChild(content);
      el.appendChild(bubble);
      
      // Add pulsing effect for areas with many artists
      if (artistCount > 5) {
        const pulse = document.createElement('div');
        pulse.className = 'absolute -inset-2 rounded-full animate-ping';
        pulse.style.background = `${coords.color}33`;
        el.appendChild(pulse);
      }
      
      // Create and add the marker
      const marker = new maplibregl.Marker({
        element: el,
        anchor: 'center',
      })
        .setLngLat([coords.lng, coords.lat])
        .addTo(map.current);
      
      // Add hover effects
      el.addEventListener('mouseenter', () => {
        bubble.style.transform = 'scale(1.1)';
        setHoveredArea(areaName);
      });
      
      el.addEventListener('mouseleave', () => {
        bubble.style.transform = 'scale(1)';
        setHoveredArea(null);
      });
      
      // Add click handler to fly to area
      el.addEventListener('click', () => {
        flyToLocation(areaName);
        updateFilters({ location: areaName });
        
        // Highlight active area
        document.querySelectorAll('.area-marker').forEach(el => {
          (el as HTMLElement).classList.remove('active-area');
        });
        el.classList.add('active-area');
        
        // Show artist list for this area
        showArtistsForArea(areaName);
      });
      
      markers.current.push(marker);
      
      // If this is the currently filtered area, highlight it
      if (filters.location === areaName) {
        el.classList.add('active-area');
        activeArea.current = marker;
      }
    });
    
    // If a location filter is active, fly to that area
    if (filters.location && filters.location !== 'All Areas') {
      flyToLocation(filters.location);
    } else {
      // Otherwise fit the map to show all markers
      fitMapToMarkers();
    }
  };
  
  // Show artists for a specific area
  const showArtistsForArea = (areaName: string) => {
    // This function would be called when an area is clicked
    console.log(`Showing artists for ${areaName}:`, artistsByArea[areaName]);
    // Actual implementation handled via the filters
  };

  // Fit map to show all markers
  const fitMapToMarkers = () => {
    if (!map.current || markers.current.length === 0) {
      console.log('Cannot fit map to markers: map not initialized or no markers');
      return;
    }
    
    try {
      const bounds = new maplibregl.LngLatBounds();
      
      markers.current.forEach(marker => {
        bounds.extend(marker.getLngLat());
      });
      
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 12,
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
    if (!map.current) {
      console.log('Cannot fly to location: map not initialized');
      return;
    }
    
    const areaCoords = areaCoordinates[locationName as keyof typeof areaCoordinates];
    
    if (areaCoords) {
      console.log(`Flying to ${locationName}: lat ${areaCoords.lat}, lng ${areaCoords.lng}, zoom ${areaCoords.zoom}`);
      map.current.flyTo({
        center: [areaCoords.lng, areaCoords.lat],
        zoom: areaCoords.zoom,
        duration: 1000,
        pitch: 45, // Increase pitch for immersive view
        bearing: Math.random() * 60 - 30, // Random slight rotation for dynamic feel
      });
    } else {
      // If no matching coordinates, fall back to Mumbai center
      map.current.flyTo({
        center: [MUMBAI_CENTER.lng, MUMBAI_CENTER.lat],
        zoom: DEFAULT_ZOOM,
        duration: 1000,
        pitch: 30,
        bearing: 15,
      });
    }
  };

  // Handle search in the area list
  const filteredAreas = Object.entries(artistsByArea)
    .filter(([area, artists]) => {
      return artists.length > 0 && 
        (searchQuery === '' || area.toLowerCase().includes(searchQuery.toLowerCase()));
    })
    .sort((a, b) => b[1].length - a[1].length);

  // Initialize map on component mount - Fixed to only run when tab is active
  useEffect(() => {
    // Only initialize map when this component is visible (fixes map not loading issue)
    const initMapWhenVisible = () => {
      if (mapContainer.current && !map.current) {
        console.log('Component mounted, initializing map');
        initializeMap();
      }
    };
    
    // Small delay to ensure DOM is ready
    const timer = setTimeout(initMapWhenVisible, 300);
    
    return () => {
      clearTimeout(timer);
      if (map.current) {
        console.log('Cleaning up map');
        map.current.remove();
      }
    };
  }, []);
  
  // Update markers when artists change or map loads
  useEffect(() => {
    console.log('Artists or display options changed, updating markers');
    if (mapLoaded) {
      addAreaMarkers();
    }
  }, [artistsByArea, mapLoaded]);

  // Watch for location filter changes to update map view
  useEffect(() => {
    console.log('Location filter changed:', filters.location);
    if (mapLoaded && map.current) {
      if (filters.location !== 'All Areas') {
        flyToLocation(filters.location);
      } else {
        fitMapToMarkers();
      }
    }
  }, [filters.location, mapLoaded]);

  // Handle location reset
  const resetLocation = () => {
    updateFilters({ location: 'All Areas' });
    if (map.current) {
      map.current.flyTo({
        center: [MUMBAI_CENTER.lng, MUMBAI_CENTER.lat],
        zoom: DEFAULT_ZOOM,
        duration: 1000,
        pitch: 30,
        bearing: 15,
      });
    }
  };

  // Toggle side menu
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  if (mapError) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-mirakiBlue-900 rounded-xl">
        <MapIcon size={48} className="text-mirakiGray-400 mb-4" />
        <h3 className="text-xl font-medium text-mirakiGray-200 mb-2">
          Map could not be loaded
        </h3>
        <p className="text-mirakiGray-400 text-center mb-6">
          There was an error loading the map. Please try refreshing the page.
        </p>
        <Button 
          onClick={() => initializeMap()}
          className="bg-mirakiGold hover:bg-mirakiGold-600 text-mirakiBlue-900"
        >
          Retry Loading Map
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {/* Map container with dark theme */}
      <div className="relative h-[600px] bg-[#121212] rounded-lg overflow-hidden border border-mirakiBlue-800">
        {/* Side menu toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-4 z-10 bg-mirakiBlue-900/80 hover:bg-mirakiBlue-800 text-white"
          onClick={toggleMenu}
        >
          {showMenu ? <Layers size={20} /> : <Layers size={20} />}
        </Button>

        {/* Side menu for area selection - Snapchat style */}
        <div 
          className={cn(
            "absolute left-0 top-0 bottom-0 z-10 w-64 bg-mirakiBlue-900/90 backdrop-blur-md border-r border-mirakiBlue-800 transition-transform duration-300 transform",
            showMenu ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="p-4 bg-mirakiBlue-900 border-b border-mirakiBlue-800">
            <h3 className="text-lg font-medium text-white mb-2">Artist Areas</h3>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-mirakiGray-500" size={16} />
              <Input
                type="text"
                placeholder="Search areas..."
                className="pl-8 bg-mirakiBlue-800 border-mirakiBlue-700 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="p-2 h-full overflow-auto pb-20">
            {filteredAreas.length > 0 ? (
              <div className="space-y-2">
                {filteredAreas.map(([area, areaArtists]) => {
                  const areaColor = areaCoordinates[area as keyof typeof areaCoordinates]?.color || '#ffffff';
                  return (
                    <div 
                      key={area}
                      className={cn(
                        "p-2 rounded-lg cursor-pointer transition-all duration-200",
                        filters.location === area 
                          ? "bg-mirakiBlue-800 border border-mirakiBlue-700" 
                          : "hover:bg-mirakiBlue-800/50",
                        hoveredArea === area && "bg-mirakiBlue-800/30"
                      )}
                      onClick={() => {
                        updateFilters({ location: area });
                        flyToLocation(area);
                      }}
                    >
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: areaColor }}
                        />
                        <div className="flex-1">
                          <div className="text-white text-sm font-medium">{area}</div>
                          <div className="text-mirakiGray-400 text-xs">
                            {areaArtists.length} {areaArtists.length === 1 ? 'artist' : 'artists'}
                          </div>
                        </div>
                        <div className="text-mirakiGold text-xs font-bold">
                          {areaArtists.length > 5 ? '🔥' : ''}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center p-4 text-mirakiGray-400">
                No artists found in these areas
              </div>
            )}
            
            {filteredAreas.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full border-mirakiBlue-700 text-white hover:bg-mirakiBlue-800"
                onClick={resetLocation}
              >
                Show All Areas
              </Button>
            )}
          </div>
        </div>
        
        {/* Main map container */}
        <div ref={mapContainer} className="h-full w-full" />
        
        {/* Area info when area is selected */}
        {filters.location !== 'All Areas' && (
          <div className="absolute right-4 top-4 z-10 p-4 bg-mirakiBlue-900/90 backdrop-blur-md rounded-lg border border-mirakiBlue-800 max-w-xs">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-white">{filters.location}</h4>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-mirakiGray-400 hover:text-white"
                onClick={resetLocation}
              >
                ×
              </Button>
            </div>
            <div className="text-sm text-mirakiGray-300 mb-2">
              {artistsByArea[filters.location]?.length || 0} artists in this area
            </div>
            {artistsByArea[filters.location]?.length > 0 && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {artistsByArea[filters.location]?.slice(0, 5).map(artist => (
                    <Badge key={artist.id} variant="outline" className="bg-mirakiBlue-800 text-white border-mirakiBlue-700">
                      {artist.name}
                    </Badge>
                  ))}
                  {(artistsByArea[filters.location]?.length || 0) > 5 && (
                    <Badge variant="outline" className="bg-mirakiBlue-800 text-mirakiGray-300 border-mirakiBlue-700">
                      +{(artistsByArea[filters.location]?.length || 0) - 5} more
                    </Badge>
                  )}
                </div>
                <Button 
                  size="sm" 
                  className="w-full mt-2 bg-mirakiGold hover:bg-mirakiGold-600 text-mirakiBlue-900"
                  onClick={() => {
                    // Keep current filter but show the list view
                    document.querySelector('[value="list"]')?.dispatchEvent(
                      new MouseEvent('click', { bubbles: true })
                    );
                  }}
                >
                  <User size={16} className="mr-2" />
                  View Artist List
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Interactive legend */}
        <div className="absolute right-4 bottom-16 z-10 p-3 bg-mirakiBlue-900/80 backdrop-blur-md rounded-lg border border-mirakiBlue-800">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-mirakiGold" />
              <span className="text-white text-xs">1-3 artists</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-mirakiGold" />
              <span className="text-white text-xs">4-6 artists</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-full bg-mirakiGold relative">
                <div className="absolute -inset-1 rounded-full animate-ping bg-mirakiGold/30" />
              </div>
              <span className="text-white text-xs">7+ artists</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistMapSection;
