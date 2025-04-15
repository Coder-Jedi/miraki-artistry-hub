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
import { useNavigate } from 'react-router-dom';

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

// Mumbai area coordinates with enhanced colors for better visibility
const areaCoordinates: Record<string, AreaCoordinate> = {
  'All Areas': { lat: 19.0760, lng: 72.8777, zoom: 10, color: '#FFFFFF' },
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
  const areaMarkers = useRef<maplibregl.Marker[]>([]);
  const artistMarkers = useRef<maplibregl.Marker[]>([]);
  const activeArea = useRef<maplibregl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);
  const [artistsByArea, setArtistsByArea] = useState<Record<string, Artist[]>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showMenu, setShowMenu] = useState(true);
  const [activeArtists, setActiveArtists] = useState<Artist[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

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
  
  // Navigate to an artist's profile
  const navigateToArtist = (artist: Artist) => {
    navigate(`/artists?name=${encodeURIComponent(artist.name)}`);
  };

  // Initialize map with enhanced colors
  const initializeMap = () => {
    console.log('Initializing map...');
    if (!mapContainer.current) {
      console.error('Map container ref is null');
      return;
    }
    
    try {
      // Remove existing markers
      areaMarkers.current.forEach(marker => marker.remove());
      areaMarkers.current = [];
      
      artistMarkers.current.forEach(marker => marker.remove());
      artistMarkers.current = [];
      
      // Initialize map
      if (map.current) map.current.remove();
      
      // Enhanced dark mode map style with better visibility
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            'osm': {
              type: 'raster',
              // Use a medium-dark basemap for better visibility
              tiles: ['https://a.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            },
            // Add a separate layer for map labels with enhanced visibility
            'labels': {
              type: 'raster',
              tiles: ['https://a.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}.png'],
              tileSize: 256
            }
          },
          layers: [
            {
              id: 'osm-tiles',
              type: 'raster',
              source: 'osm',
              minzoom: 0,
              maxzoom: 19,
              paint: {
                'raster-opacity': 0.7, // Dim the base map
                'raster-brightness-min': 0.3, // Darken the base map
                'raster-brightness-max': 0.7, // But not too much
                'raster-contrast': 0.2, // Reduce contrast for better dark mode
                'raster-saturation': -0.4 // Desaturate slightly
              }
            },
            {
              id: 'labels-tiles',
              type: 'raster',
              source: 'labels',
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

      // Add navigation controls
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

        // Add artist pins for initial view or selected area
        if (filters.location !== 'All Areas') {
          addArtistPins(filters.location);
        }
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

  // Function to add area markers to the map with enhanced visibility
  const addAreaMarkers = () => {
    if (!map.current || !mapLoaded) {
      console.log('Map not ready for markers');
      return;
    }
    
    // Clear existing area markers
    areaMarkers.current.forEach(marker => marker.remove());
    areaMarkers.current = [];
    
    // For each area, create a circular area marker with enhanced visibility
    Object.entries(areaCoordinates).forEach(([areaName, coords]) => {
      if (areaName === 'All Areas') return;
      
      const artistCount = artistsByArea[areaName]?.length || 0;
      
      // Skip areas with no artists unless specifically filtered
      if (artistCount === 0 && filters.location !== areaName) return;
      
      // Create marker element
      const el = document.createElement('div');
      el.className = 'area-marker';
      el.style.cursor = 'pointer';
      
      // Area bubble with artist count - enhanced for better visibility
      const bubble = document.createElement('div');
      bubble.className = `area-bubble flex items-center justify-center rounded-full transition-all duration-300`;
      
      // Size based on artist count but ensure minimum visibility
      bubble.style.width = `${Math.max(65, 45 + artistCount * 5)}px`;
      bubble.style.height = `${Math.max(65, 45 + artistCount * 5)}px`;
      
      // Enhanced gradient background with stronger colors
      const baseColor = coords.color;
      bubble.style.background = `radial-gradient(circle, ${baseColor} 0%, ${baseColor}99 70%, ${baseColor}66 100%)`;
      bubble.style.border = `3px solid ${baseColor}`;
      bubble.style.boxShadow = `0 0 15px ${baseColor}66, inset 0 0 8px rgba(255,255,255,0.6)`;
      
      // Inner content with area name and artist count - improved visibility
      const content = document.createElement('div');
      content.className = 'flex flex-col items-center justify-center text-center p-1';
      
      const nameEl = document.createElement('div');
      nameEl.className = 'text-sm font-bold text-mirakiBlue-900';
      nameEl.style.textShadow = '0 1px 3px rgba(255,255,255,0.8)';
      nameEl.textContent = areaName.length > 10 ? areaName.split(' ')[0] : areaName;
      
      const countEl = document.createElement('div');
      countEl.className = 'text-xs font-semibold text-mirakiBlue-900';
      countEl.style.textShadow = '0 1px 2px rgba(255,255,255,0.8)';
      countEl.textContent = `${artistCount} ${artistCount === 1 ? 'artist' : 'artists'}`;
      
      content.appendChild(nameEl);
      content.appendChild(countEl);
      bubble.appendChild(content);
      el.appendChild(bubble);
      
      // Add pulsing effect for areas with many artists
      if (artistCount > 5) {
        const pulse = document.createElement('div');
        pulse.className = 'absolute -inset-2 rounded-full animate-ping';
        pulse.style.background = `${baseColor}33`;
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
        bubble.style.boxShadow = `0 0 20px ${baseColor}aa, inset 0 0 12px rgba(255,255,255,0.8)`;
        setHoveredArea(areaName);
      });
      
      el.addEventListener('mouseleave', () => {
        bubble.style.transform = 'scale(1)';
        bubble.style.boxShadow = `0 0 15px ${baseColor}66, inset 0 0 8px rgba(255,255,255,0.6)`;
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
        
        // Show artist pins for this area
        addArtistPins(areaName);
      });
      
      areaMarkers.current.push(marker);
      
      // If this is the currently filtered area, highlight it
      if (filters.location === areaName) {
        el.classList.add('active-area');
        activeArea.current = marker;
      }
    });
    
    // If a location filter is active, fly to that area and add artist pins
    if (filters.location && filters.location !== 'All Areas') {
      flyToLocation(filters.location);
      addArtistPins(filters.location);
    } else {
      // Otherwise fit the map to show all markers
      fitMapToMarkers();
    }
  };
  
  // Function to add artist pins for a selected area
  const addArtistPins = (areaName: string) => {
    if (!map.current || !mapLoaded) return;
    
    // Clear existing artist markers
    artistMarkers.current.forEach(marker => marker.remove());
    artistMarkers.current = [];
    
    const areaArtists = artistsByArea[areaName] || [];
    setActiveArtists(areaArtists);
    
    if (areaArtists.length === 0) {
      console.log(`No artists in ${areaName}`);
      return;
    }
    
    console.log(`Adding ${areaArtists.length} artist pins for ${areaName}`);
    
    // Get the area coordinates as center point
    const areaCenterCoords = areaCoordinates[areaName];
    if (!areaCenterCoords) return;
    
    // Create a spiral of pins around the area center
    areaArtists.forEach((artist, index) => {
      // Create pin with slight position variation to avoid overlap
      const angle = (index / areaArtists.length) * Math.PI * 2;
      const radius = 0.005 + (index % 3) * 0.002; // Vary radius in 3 rings
      
      // Calculate offset position in a spiral pattern
      const lat = areaCenterCoords.lat + Math.sin(angle) * radius;
      const lng = areaCenterCoords.lng + Math.cos(angle) * radius;
      
      // Create artist pin element
      const pinEl = document.createElement('div');
      pinEl.className = 'artist-pin';
      pinEl.innerHTML = artist.name.charAt(0).toUpperCase();
      
      // Add artist name label
      const labelEl = document.createElement('div');
      labelEl.className = 'artist-pin-label';
      labelEl.textContent = artist.name;
      pinEl.appendChild(labelEl);
      
      // Create and add the marker
      const marker = new maplibregl.Marker({
        element: pinEl,
        anchor: 'bottom',
      })
        .setLngLat([lng, lat])
        .addTo(map.current);
      
      // Create popup with artist details
      const popupHTML = `
        <div class="p-3 max-w-[250px]">
          <h3 class="font-bold text-white mb-2">${artist.name}</h3>
          <p class="text-sm text-gray-300 mb-2">${artist.location?.address || areaName}</p>
          <p class="text-sm text-gray-300 mb-2">${artist.artworks?.length || 0} artwork${artist.artworks?.length !== 1 ? 's' : ''}</p>
          <div class="mt-2 flex justify-center">
            <a href="/artists?name=${encodeURIComponent(artist.name)}" 
              class="inline-block px-3 py-1 bg-mirakiGold text-mirakiBlue-900 text-sm font-medium rounded hover:bg-mirakiGold-600 transition-colors">
              View Profile
            </a>
          </div>
        </div>
      `;
      
      const popup = new maplibregl.Popup({
        offset: [0, -20],
        closeButton: true,
        closeOnClick: true
      }).setHTML(popupHTML);
      
      // Show popup on pin click
      pinEl.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering area click
        marker.setPopup(popup).togglePopup();
      });
      
      artistMarkers.current.push(marker);
    });
  };

  // Show artists for a specific area
  const showArtistsForArea = (areaName: string) => {
    // This function would be called when an area is clicked
    console.log(`Showing artists for ${areaName}:`, artistsByArea[areaName]);
    // Add artist pins
    addArtistPins(areaName);
  };

  // Fit map to show all markers
  const fitMapToMarkers = () => {
    if (!map.current || areaMarkers.current.length === 0) {
      console.log('Cannot fit map to markers: map not initialized or no markers');
      return;
    }
    
    try {
      const bounds = new maplibregl.LngLatBounds();
      
      areaMarkers.current.forEach(marker => {
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

  // Initialize map on component mount with delay for better loading
  useEffect(() => {
    // Only initialize map when this component is visible and after a short delay
    const initMapWhenVisible = () => {
      if (mapContainer.current && !map.current) {
        console.log('Component mounted, initializing map');
        initializeMap();
      }
    };
    
    // Short delay to ensure DOM is fully ready
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
    if (mapLoaded && map.current) {
      addAreaMarkers();
    }
  }, [artistsByArea, mapLoaded]);

  // Watch for location filter changes to update map view
  useEffect(() => {
    console.log('Location filter changed:', filters.location);
    if (mapLoaded && map.current) {
      if (filters.location !== 'All Areas') {
        flyToLocation(filters.location);
        addArtistPins(filters.location);
      } else {
        fitMapToMarkers();
        // Clear artist pins when showing all areas
        artistMarkers.current.forEach(marker => marker.remove());
        artistMarkers.current = [];
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
      
      // Clear artist pins
      artistMarkers.current.forEach(marker => marker.remove());
      artistMarkers.current = [];
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
      {/* Map container with enhanced styling */}
      <div className="relative h-[600px] bg-[#262D40] rounded-lg overflow-hidden border border-mirakiBlue-800 map-container">
        {/* Gradient overlay for improved readability */}
        <div className="map-gradient-overlay"></div>
        
        {/* Side menu toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-4 z-20 bg-mirakiBlue-900/80 hover:bg-mirakiBlue-800 text-white shadow-lg"
          onClick={toggleMenu}
        >
          {showMenu ? <Layers size={20} /> : <Layers size={20} />}
        </Button>

        {/* Side menu for area selection - enhanced style */}
        <div 
          className={cn(
            "absolute left-0 top-0 bottom-0 z-20 w-64 bg-gradient-to-br from-mirakiBlue-900/95 to-mirakiBlue-800/95 backdrop-blur-md border-r border-mirakiBlue-700 transition-transform duration-300 transform shadow-xl",
            showMenu ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="p-4 bg-gradient-to-r from-mirakiBlue-900 to-mirakiBlue-800 border-b border-mirakiBlue-700">
            <h3 className="text-lg font-medium text-white mb-2">Artist Areas</h3>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-mirakiGray-500" size={16} />
              <Input
                type="text"
                placeholder="Search areas..."
                className="pl-8 bg-mirakiBlue-800/80 border-mirakiBlue-700 text-white"
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
                          ? "bg-gradient-to-r from-mirakiBlue-800/80 to-mirakiBlue-700/80 border border-mirakiBlue-700" 
                          : "hover:bg-mirakiBlue-800/50",
                        hoveredArea === area && "bg-mirakiBlue-800/30"
                      )}
                      onClick={() => {
                        updateFilters({ location: area });
                        flyToLocation(area);
                        addArtistPins(area);
                      }}
                    >
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-2 shadow-glow"
                          style={{ 
                            backgroundColor: areaColor,
                            boxShadow: `0 0 8px ${areaColor}99` 
                          }}
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
        
        {/* Area info when area is selected - enhanced styling */}
        {filters.location !== 'All Areas' && (
          <div className="absolute right-4 top-4 z-20 p-4 bg-gradient-to-br from-mirakiBlue-900/95 to-mirakiBlue-800/95 backdrop-blur-md rounded-lg border border-mirakiBlue-700 shadow-lg max-w-xs">
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
                    <Badge 
                      key={artist.id} 
                      variant="outline" 
                      className="bg-mirakiBlue-800/80 text-white border-mirakiBlue-700 cursor-pointer hover:bg-mirakiBlue-700"
                      onClick={() => navigateToArtist(artist)}
                    >
                      {artist.name}
                    </Badge>
                  ))}
                  {(artistsByArea[filters.location]?.length || 0) > 5 && (
                    <Badge variant="outline" className="bg-mirakiBlue-800/80 text-mirakiGray-300 border-mirakiBlue-700">
                      +{(artistsByArea[filters.location]?.length || 0) - 5} more
                    </Badge>
                  )}
                </div>
                <Button 
                  size="sm" 
                  className="w-full mt-2 bg-gradient-to-r from-mirakiGold to-mirakiGold-600 hover:from-mirakiGold-600 hover:to-mirakiGold text-mirakiBlue-900"
                  onClick={() => {
                    // Keep current filter but show the list view
                    document.querySelector('[value="list"]')?.dispatchEvent(
                      new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                      })
                    );
                  }}
                >
                  View Artist List
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistMapSection;
