
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Artwork } from '@/types';
import { Button } from '@/components/ui/button';
import { MapIcon, Filter, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// We'll use a default token but encourage users to use their own
const MAPBOX_TOKEN = '';

interface MapSectionProps {
  artworks: Artwork[];
  onArtworkClick: (artwork: Artwork) => void;
}

const MapSection: React.FC<MapSectionProps> = ({ artworks, onArtworkClick }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [userToken, setUserToken] = useState(() => {
    // Try to load from localStorage first
    return localStorage.getItem('mapbox_token') || MAPBOX_TOKEN;
  });
  const [showTokenInput, setShowTokenInput] = useState(!userToken);
  const [showNames, setShowNames] = useState(true);
  const { toast } = useToast();

  const initializeMap = () => {
    if (!mapContainer.current || !userToken) {
      setShowTokenInput(true);
      return;
    }
    
    try {
      // Remove existing markers
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      
      // Initialize map
      if (map.current) map.current.remove();
      
      mapboxgl.accessToken = userToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-118.2437, 34.0522], // Los Angeles coordinates (from the art data)
        zoom: 10,
      });

      // Properly initialize NavigationControl without type arguments
      map.current.addControl(new mapboxgl.NavigationControl());
      
      map.current.on('load', () => {
        setMapLoaded(true);
        setMapError(false);
        toast({
          title: "Map loaded successfully",
          description: "The map is now ready to use",
          duration: 3000,
        });
        // Save token to localStorage if valid
        if (userToken) {
          localStorage.setItem('mapbox_token', userToken);
        }
        addArtworkMarkers();
      });
      
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setMapError(true);
        toast({
          title: "Map Error",
          description: "There was an issue with your Mapbox token. Please try a different one.",
          variant: "destructive",
        });
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError(true);
      toast({
        title: "Map Error",
        description: "Failed to initialize the map. Please check your Mapbox token.",
        variant: "destructive",
      });
    }
  };

  const addArtworkMarkers = () => {
    if (!map.current || !mapLoaded) return;
    
    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    
    // Group artworks by artist to avoid duplicate locations
    const artistLocations = new Map<string, { artist: string, location: Artwork['location'], artworks: Artwork[] }>();
    
    artworks.forEach(artwork => {
      if (!artwork.location) return;
      
      if (!artistLocations.has(artwork.artist)) {
        artistLocations.set(artwork.artist, {
          artist: artwork.artist,
          location: artwork.location,
          artworks: [artwork]
        });
      } else {
        const artistData = artistLocations.get(artwork.artist);
        if (artistData) {
          artistData.artworks.push(artwork);
        }
      }
    });
    
    // Create markers for each artist
    artistLocations.forEach(({ artist, location, artworks }) => {
      if (!location || !map.current) return;
      
      // Create marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'flex flex-col items-center';
      
      // Marker icon
      const markerIcon = document.createElement('div');
      markerIcon.className = 'w-10 h-10 rounded-full bg-mirakiGold flex items-center justify-center text-mirakiBlue-900 font-bold border-2 border-white shadow-lg cursor-pointer transition-all hover:scale-110';
      markerIcon.innerHTML = artist.charAt(0).toUpperCase();
      markerEl.appendChild(markerIcon);
      
      // Artist name label (conditionally visible)
      const nameLabel = document.createElement('div');
      nameLabel.className = `mt-1 px-2 py-1 bg-white dark:bg-mirakiBlue-800 text-mirakiBlue-900 dark:text-white text-xs font-medium rounded shadow-md whitespace-nowrap ${showNames ? 'block' : 'hidden'}`;
      nameLabel.textContent = artist;
      markerEl.appendChild(nameLabel);
      
      // Create and add the marker
      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([location.lng, location.lat])
        .addTo(map.current);
      
      // Create popup with artworks
      const popupHTML = `
        <div class="p-3 max-w-[250px]">
          <h3 class="font-bold text-mirakiBlue-900 mb-2">${artist}</h3>
          <p class="text-sm text-mirakiBlue-700 mb-2">${location.address}</p>
          <p class="text-sm text-mirakiBlue-600 mb-2">${artworks.length} artwork${artworks.length !== 1 ? 's' : ''}</p>
          <div class="mt-2 flex justify-center">
            <a href="/artists?name=${encodeURIComponent(artist)}" 
              class="inline-block px-3 py-1 bg-mirakiGold text-mirakiBlue-900 text-sm font-medium rounded hover:bg-mirakiGold-600 transition-colors">
              View Profile
            </a>
          </div>
        </div>
      `;
      
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupHTML);
      
      // Show popup on marker click
      markerEl.addEventListener('click', () => {
        marker.setPopup(popup).togglePopup();
      });
      
      markers.current.push(marker);
    });
  };

  // Initialize map on component mount
  useEffect(() => {
    if (userToken) {
      initializeMap();
    } else {
      setShowTokenInput(true);
    }
    
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [userToken]);
  
  // Update markers when artworks change or map loads
  useEffect(() => {
    if (mapLoaded) {
      addArtworkMarkers();
    }
  }, [artworks, mapLoaded, showNames]);

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userToken || userToken.trim() === '') {
      toast({
        title: "Token Required",
        description: "Please enter a valid Mapbox token",
        variant: "destructive",
      });
      return;
    }
    
    initializeMap();
    setShowTokenInput(false);
  };

  const toggleNameVisibility = () => {
    setShowNames(!showNames);
  };

  if (mapError || !userToken) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-mirakiGray-100 dark:bg-mirakiBlue-900 rounded-xl">
        <MapIcon size={48} className="text-mirakiGray-400 mb-4" />
        <h3 className="text-xl font-medium text-mirakiBlue-800 dark:text-mirakiGray-200 mb-2">
          {mapError ? "Map could not be loaded" : "Enter your Mapbox token"}
        </h3>
        <p className="text-mirakiBlue-600 dark:text-mirakiGray-400 text-center mb-6">
          {mapError 
            ? "There was an error loading the map. Please check your Mapbox token."
            : "To display the artists map, you need to enter your Mapbox access token."}
        </p>
        <Button 
          onClick={() => setShowTokenInput(true)}
          className="bg-mirakiBlue-700 hover:bg-mirakiBlue-800 text-white dark:bg-mirakiGold dark:hover:bg-mirakiGold-600 dark:text-mirakiBlue-900"
        >
          {mapError ? "Update Mapbox Token" : "Enter Mapbox Token"}
        </Button>
        <p className="mt-6 text-sm text-mirakiBlue-600 dark:text-mirakiGray-400 max-w-md text-center">
          To get a free Mapbox token, create an account at{' '}
          <a 
            href="https://account.mapbox.com/auth/signup/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-mirakiBlue-700 dark:text-mirakiGold underline"
          >
            mapbox.com
          </a>
          {' '}and copy your default public token.
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      {/* Map controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <Button 
          size="sm"
          variant="outline"
          className="bg-white/90 hover:bg-white border border-mirakiGray-200 text-mirakiBlue-800"
          onClick={toggleNameVisibility}
        >
          <Filter size={16} className="mr-2" />
          {showNames ? 'Hide' : 'Show'} Artist Names
        </Button>
      </div>
      
      {/* Mapbox token input */}
      {showTokenInput && (
        <div className="absolute inset-0 z-20 bg-white/90 dark:bg-mirakiBlue-900/90 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-mirakiBlue-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium text-mirakiBlue-900 dark:text-white mb-4">Enter your Mapbox Token</h3>
            <form onSubmit={handleTokenSubmit}>
              <input
                type="text"
                value={userToken}
                onChange={(e) => setUserToken(e.target.value)}
                className="w-full px-4 py-2 border border-mirakiGray-300 dark:border-mirakiBlue-600 rounded mb-4 bg-white dark:bg-mirakiBlue-700 text-mirakiBlue-900 dark:text-white"
                placeholder="pk.eyJ1Ijoi..."
              />
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowTokenInput(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Update Token</Button>
              </div>
            </form>
            <p className="mt-4 text-sm text-mirakiBlue-600 dark:text-mirakiGray-300">
              You can get a Mapbox token by signing up at{' '}
              <a 
                href="https://account.mapbox.com/auth/signup/"
                target="_blank" 
                rel="noopener noreferrer"
                className="text-mirakiBlue-700 dark:text-mirakiGold underline"
              >
                mapbox.com
              </a>
            </p>
          </div>
        </div>
      )}
      
      {/* Map container */}
      <div ref={mapContainer} className="h-full w-full bg-mirakiGray-200 dark:bg-mirakiBlue-900" />
      
      {/* Watermark/token info (small and discreet) */}
      <div className="absolute bottom-2 right-2 z-10">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs text-mirakiBlue-600/70 dark:text-mirakiGray-400/70 hover:text-mirakiBlue-700 dark:hover:text-mirakiGray-300"
          onClick={() => setShowTokenInput(true)}
        >
          Update Token
        </Button>
      </div>
    </div>
  );
};

export default MapSection;
