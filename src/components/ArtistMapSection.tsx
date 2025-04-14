import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Artist } from '@/types';
import { Button } from '@/components/ui/button';
import { MapIcon, Filter, User, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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

// Mumbai area coordinates for zooming to specific areas
const areaCoordinates = {
  'All Areas': { lat: 19.0760, lng: 72.8777, zoom: 10 },
  'Bandra': { lat: 19.0596, lng: 72.8295, zoom: 14 },
  'Colaba': { lat: 18.9067, lng: 72.8147, zoom: 14 },
  'Dadar': { lat: 19.0178, lng: 72.8478, zoom: 14 },
  'Fort': { lat: 18.9340, lng: 72.8340, zoom: 14 },
  'Juhu': { lat: 19.1075, lng: 72.8263, zoom: 14 },
  'Kala Ghoda': { lat: 18.9281, lng: 72.8319, zoom: 15 },
  'Lower Parel': { lat: 18.9982, lng: 72.8270, zoom: 14 },
  'Malabar Hill': { lat: 18.9548, lng: 72.7985, zoom: 14 },
  'Marine Drive': { lat: 18.9442, lng: 72.8239, zoom: 14 },
  'Powai': { lat: 19.1176, lng: 72.9081, zoom: 14 },
  'Worli': { lat: 19.0096, lng: 72.8173, zoom: 14 },
  'Andheri': { lat: 19.1136, lng: 72.8697, zoom: 14 },
  'Navi Mumbai - Vashi': { lat: 19.0748, lng: 73.0008, zoom: 14 },
  'Navi Mumbai - Belapur': { lat: 19.0237, lng: 73.0400, zoom: 14 },
  'Navi Mumbai - Nerul': { lat: 19.0353, lng: 73.0197, zoom: 14 },
  'Navi Mumbai - Kharghar': { lat: 19.0474, lng: 73.0658, zoom: 14 }
};

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
  const activePopup = useRef<maplibregl.Popup | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [showPopularity, setShowPopularity] = useState(true);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const { toast } = useToast();

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
      
      map.current.on('load', () => {
        console.log('Map loaded successfully');
        setMapLoaded(true);
        setMapError(false);
        toast({
          title: "Map loaded successfully",
          description: "The map is now ready to explore artists by location",
          duration: 3000,
        });
        
        // Add markers after map is loaded
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
    if (!map.current || !mapLoaded) {
      console.log('Map not ready for markers');
      return;
    }
    
    console.log('Adding markers for artists:', artists);
    
    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    
    // Directly check if artists have location data and log it
    artists.forEach(artist => {
      console.log(`Artist: ${artist.name}, Has location: ${!!artist.location}`, artist.location);
    });
    
    // Filter artists with valid location data
    const artistsWithLocations = artists.filter(artist => artist.location && 
      typeof artist.location.lat === 'number' && 
      typeof artist.location.lng === 'number');
    
    console.log(`Found ${artistsWithLocations.length} artists with valid location data`);
    
    // Track unique locations to avoid overlapping markers
    const uniqueLocations = new Map<string, { artist: Artist, artists: Artist[] }>();
    
    artistsWithLocations.forEach(artist => {
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
    
    console.log(`Creating markers for ${uniqueLocations.size} unique locations`);
    
    // Create markers for each unique location
    uniqueLocations.forEach(({ artist, artists }, key) => {
      if (!artist.location || !map.current) return;
      
      console.log(`Creating marker for ${artist.name} at [${artist.location.lng}, ${artist.location.lat}]`);
      
      // Select a gradient based on artist name
      const gradientIndex = Math.abs(artist.name.charCodeAt(0)) % markerGradients.length;
      const gradientColor = markerGradients[gradientIndex];
      
      // Create marker element with gradient
      const markerEl = document.createElement('div');
      markerEl.className = 'flex flex-col items-center';
      
      // Pin container
      const pinContainer = document.createElement('div');
      pinContainer.className = 'relative transform transition-all duration-300 hover:scale-110 cursor-pointer';
      pinContainer.style.width = '40px';
      pinContainer.style.height = '54px';
      
      // Create the pin shape with gradient background
      const pinShape = document.createElement('div');
      pinShape.className = 'absolute top-0 left-0 w-full h-full';
      pinShape.innerHTML = `
        <svg viewBox="0 0 40 54" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 0C8.95 0 0 8.95 0 20C0 31.05 8.95 40 20 40C31.05 40 40 31.05 40 20C40 8.95 31.05 0 20 0ZM20 54L8.95 40C3.16 34.21 0 27.37 0 20C0 8.95 8.95 0 20 0C31.05 0 40 8.95 40 20C40 27.37 36.84 34.21 31.05 40L20 54Z" fill="url(#${artist.id}-gradient)" />
          <defs>
            <linearGradient id="${artist.id}-gradient" x1="0" y1="0" x2="40" y2="54" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="${getGradientStartColor(gradientIndex)}" />
              <stop offset="100%" stop-color="${getGradientEndColor(gradientIndex)}" />
            </linearGradient>
          </defs>
        </svg>
      `;
      
      // Artist image in the pin
      const artistImage = document.createElement('div');
      artistImage.className = 'absolute top-2 left-1/2 transform -translate-x-1/2 w-7 h-7 rounded-full bg-white overflow-hidden border-2 border-white';
      
      // Create image element if profileImage exists
      if (artist.profileImage) {
        const imgElement = document.createElement('img');
        imgElement.src = artist.profileImage;
        imgElement.alt = artist.name;
        imgElement.className = 'w-full h-full object-cover';
        artistImage.appendChild(imgElement);
      } else {
        // Fallback to artist initial if no image
        artistImage.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-mirakiBlue-600 text-white font-bold text-sm">${artist.name.charAt(0).toUpperCase()}</div>`;
      }
      
      // Add shadow for 3D effect
      const shadow = document.createElement('div');
      shadow.className = 'absolute -bottom-1 left-1/2 transform -translate-x-1/2 rounded-full bg-black/20 blur-sm w-6 h-2 transition-all duration-300';
      
      // Assemble pin
      pinContainer.appendChild(pinShape);
      pinContainer.appendChild(artistImage);
      pinContainer.appendChild(shadow);
      markerEl.appendChild(pinContainer);
      
      // Artist name label (conditionally visible)
      if (showLabels) {
        const nameLabel = document.createElement('div');
        nameLabel.className = 'mt-1 px-2 py-1 bg-white dark:bg-mirakiBlue-800 text-mirakiBlue-900 dark:text-white text-xs font-medium rounded shadow-md whitespace-nowrap';
        nameLabel.textContent = artists.length > 1 ? `${artists.length} artists` : artist.name;
        markerEl.appendChild(nameLabel);
        
        // Popularity indicator
        if (showPopularity && artist.popularity) {
          const popContainer = document.createElement('div');
          popContainer.className = 'flex items-center mt-1';
          
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
      }
      
      try {
        // Create and add the marker
        const marker = new maplibregl.Marker({
          element: markerEl,
          anchor: 'bottom',
        })
          .setLngLat([artist.location.lng, artist.location.lat])
          .addTo(map.current);
        
        // Add hover animation
        pinContainer.addEventListener('mouseenter', () => {
          pinContainer.style.transform = 'scale(1.15) translateY(-5px)';
          shadow.style.width = '10px';
          shadow.style.filter = 'blur(3px)';
        });
        
        pinContainer.addEventListener('mouseleave', () => {
          pinContainer.style.transform = 'scale(1) translateY(0)';
          shadow.style.width = '6px';
          shadow.style.filter = 'blur(2px)';
        });
        
        // Create popup for artist(s)
        const handleMarkerClick = () => {
          // For single artist, select and show in sidebar
          if (artists.length === 1) {
            setSelectedArtist(artists[0]);
            return;
          }
          
          // For multiple artists, show popup with list
          const popupElement = document.createElement('div');
          popupElement.className = 'p-4 max-w-xs bg-white dark:bg-mirakiBlue-800 rounded-lg shadow-lg';
          
          const title = document.createElement('h3');
          title.className = 'text-lg font-bold text-mirakiBlue-900 dark:text-white mb-2';
          title.textContent = `${artists.length} Artists at this Location`;
          popupElement.appendChild(title);
          
          const list = document.createElement('div');
          list.className = 'space-y-2 max-h-40 overflow-y-auto';
          
          artists.forEach(a => {
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
              // Close any active popup
              if (activePopup.current) {
                activePopup.current.remove();
                activePopup.current = null;
              }
            };
            
            artistItem.appendChild(artistName);
            artistItem.appendChild(viewButton);
            list.appendChild(artistItem);
          });
          
          popupElement.appendChild(list);
          
          // Close any active popup before creating a new one
          if (activePopup.current) {
            activePopup.current.remove();
          }
          
          // Create and track the popup
          const popup = new maplibregl.Popup({ closeButton: true, maxWidth: '300px' })
            .setLngLat([artist.location.lng, artist.location.lat])
            .setDOMContent(popupElement)
            .addTo(map.current!);
          
          activePopup.current = popup;
          
          // Handle popup close event
          popup.on('close', () => {
            activePopup.current = null;
          });
        };
        
        // Show popup on marker click
        pinContainer.addEventListener('click', handleMarkerClick);
        
        markers.current.push(marker);
      } catch (error) {
        console.error('Error creating marker:', error);
      }
    });
    
    // If a location filter is active, fly to that area
    if (filters.location && filters.location !== 'All Areas') {
      flyToLocation(filters.location);
    } else {
      // Otherwise fit the map to show all markers
      fitMapToMarkers();
    }

    console.log(`Added ${markers.current.length} markers to the map`);
  };

  // Helper function to get gradient start color
  function getGradientStartColor(index: number): string {
    const startColors = ['#FF9A9E', '#43CBFF', '#FCCF31', '#667EEA', '#F6D365', '#A1C4FD', '#0BA360'];
    return startColors[index % startColors.length];
  }

  // Helper function to get gradient end color
  function getGradientEndColor(index: number): string {
    const endColors = ['#FECFEF', '#9708CC', '#F55555', '#764BA2', '#FDA085', '#C2E9FB', '#3CBA92'];
    return endColors[index % endColors.length];
  }

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
  
  // Fly to specific area using the area coordinates
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
        duration: 1000
      });
    } else {
      // If no matching coordinates, find an artist with the matching location
      const artistWithLocation = artists.find(artist => artist.location?.area === locationName);
      
      if (artistWithLocation && artistWithLocation.location) {
        console.log(`Flying to artist location: ${locationName}`);
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
    }
  };

  // Initialize map on component mount
  useEffect(() => {
    console.log('Component mounted, initializing map');
    initializeMap();
    
    return () => {
      if (map.current) {
        console.log('Cleaning up map');
        map.current.remove();
      }
    };
  }, []);
  
  // Update markers when artists change or map loads
  useEffect(() => {
    console.log('Artists or display options changed, updating markers');
    console.log('Artists in component:', artists);
    console.log('Artists with locations:', artists.filter(a => a.location).length);
    if (mapLoaded) {
      addArtistMarkers();
    }
  }, [artists, mapLoaded, showLabels, showPopularity]);

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
    <div className="flex flex-col w-full">
      {/* Filter options - moved above the map */}
      <div className="mb-4 p-4 bg-white/90 dark:bg-mirakiBlue-900/90 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Filter Artists on Map</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Location Filter */}
          <div>
            <h4 className="text-sm font-medium mb-2">Location</h4>
            <div className="relative">
              <select 
                value={filters.location}
                onChange={(e) => handleLocationChange(e.target.value)}
                className="w-full p-2 rounded border border-mirakiGray-200 dark:border-mirakiBlue-700 bg-white dark:bg-mirakiBlue-800 text-mirakiBlue-800 dark:text-white"
              >
                {mumbaiAreas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Popularity Range Filter */}
          <div>
            <h4 className="text-sm font-medium mb-2">
              Popularity Rating: {filters.popularityRange[0]} - {filters.popularityRange[1]}
            </h4>
            <Slider 
              defaultValue={[0, 5]}
              min={0}
              max={5}
              step={0.5}
              value={filters.popularityRange}
              onValueChange={(value) => handlePopularityChange(value as [number, number])}
              className="mb-1"
            />
            <div className="flex justify-between text-xs text-mirakiBlue-600 dark:text-mirakiGray-400">
              <span>0</span>
              <span>5</span>
            </div>
          </div>
          
          {/* Display Controls */}
          <div>
            <h4 className="text-sm font-medium mb-2">Display Options</h4>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleLabelVisibility}
                className={showLabels ? "bg-mirakiBlue-100 dark:bg-mirakiBlue-700" : ""}
              >
                {showLabels ? "Hide" : "Show"} Names
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={togglePopularityVisibility}
                className={showPopularity ? "bg-mirakiBlue-100 dark:bg-mirakiBlue-700" : ""}
              >
                {showPopularity ? "Hide" : "Show"} Ratings
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => {
                  updateFilters({
                    location: 'All Areas',
                    popularityRange: [0, 5]
                  });
                  resetLocation();
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filter info banner */}
      {filters.location !== 'All Areas' && (
        <div className="mb-2 bg-white/90 dark:bg-mirakiBlue-900/90 py-2 px-4 rounded-md shadow-md backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="text-sm">Showing artists in: <strong>{filters.location}</strong></span>
            <Button size="sm" variant="ghost" onClick={resetLocation} className="h-7 w-7 p-0">
              ×
            </Button>
          </div>
        </div>
      )}
      
      {/* Debug info with more details */}
      <div className="bg-yellow-100 text-yellow-800 p-2 rounded-md mb-2 text-xs">
        <p>Artists loaded: {artists.length} | Map loaded: {mapLoaded ? 'Yes' : 'No'} | Markers: {markers.current.length}</p>
        <p>Artist locations: {artists.filter(a => a.location).length}/{artists.length}</p>
        <p>Current filters: {filters.location !== 'All Areas' ? filters.location : 'No location filter'}, Rating: {filters.popularityRange[0]}-{filters.popularityRange[1]}</p>
        <button 
          onClick={() => console.log('Filtered artists:', artists)} 
          className="underline hover:text-yellow-900"
        >
          Log Artists Data
        </button>
      </div>
      
      {/* Map container with fixed height */}
      <div className="relative h-[600px] border border-mirakiGray-200 dark:border-mirakiBlue-700 rounded-lg shadow-md overflow-hidden">
        <div ref={mapContainer} className="h-full w-full bg-mirakiGray-200 dark:bg-mirakiBlue-900" />
        
        {/* Selected artist popup */}
        {selectedArtist && (
          <div className="absolute right-4 top-4 w-[320px] bg-white dark:bg-mirakiBlue-800 rounded-lg shadow-lg p-4 z-20">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-medium">{selectedArtist.name}</h3>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => {
                setSelectedArtist(null);
                // Also clear any active popup when closing artist sidebar
                if (activePopup.current) {
                  activePopup.current.remove();
                  activePopup.current = null;
                }
              }}>×</Button>
            </div>
            
            <div className="flex items-center text-mirakiGray-500 dark:text-mirakiGray-400 text-sm mb-2">
              <MapIcon size={14} className="mr-1" />
              {selectedArtist.location?.address}
            </div>
            
            <div className="flex items-center mb-3">
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
            
            {selectedArtist.profileImage && (
              <div className="flex mb-3">
                <div className="w-20 h-20 rounded-full overflow-hidden mr-3">
                  <img
                    src={selectedArtist.profileImage}
                    alt={selectedArtist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  {selectedArtist.bio && (
                    <p className="text-sm text-mirakiBlue-700 dark:text-mirakiGray-300 line-clamp-4">
                      {selectedArtist.bio}
                    </p>
                  )}
                </div>
              </div>
            )}
            
            <Button 
              onClick={() => window.location.href = `/artists?name=${encodeURIComponent(selectedArtist.name)}`}
              className="w-full bg-mirakiGold hover:bg-mirakiGold-600 text-mirakiBlue-900"
            >
              <User size={16} className="mr-2
