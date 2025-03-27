
import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Artwork } from '@/types';
import { Button } from '@/components/ui/button';
import { MapIcon, Filter, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MapSectionProps {
  artworks: Artwork[];
  onArtworkClick: (artwork: Artwork) => void;
}

const MapSection: React.FC<MapSectionProps> = ({ artworks, onArtworkClick }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [showNames, setShowNames] = useState(true);
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
        center: [-118.2437, 34.0522], // Los Angeles coordinates (from the art data)
        zoom: 10,
      });

      // Add navigation controls
      map.current.addControl(new maplibregl.NavigationControl());
      
      map.current.on('load', () => {
        setMapLoaded(true);
        setMapError(false);
        toast({
          title: "Map loaded successfully",
          description: "The map is now ready to use",
          duration: 3000,
        });
        addArtworkMarkers();
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
      const marker = new maplibregl.Marker(markerEl)
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
      
      const popup = new maplibregl.Popup({ offset: 25 }).setHTML(popupHTML);
      
      // Show popup on marker click
      markerEl.addEventListener('click', () => {
        marker.setPopup(popup).togglePopup();
      });
      
      markers.current.push(marker);
    });
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
  
  // Update markers when artworks change or map loads
  useEffect(() => {
    if (mapLoaded) {
      addArtworkMarkers();
    }
  }, [artworks, mapLoaded, showNames]);

  const toggleNameVisibility = () => {
    setShowNames(!showNames);
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
      
      {/* Map container */}
      <div ref={mapContainer} className="h-full w-full bg-mirakiGray-200 dark:bg-mirakiBlue-900" />
    </div>
  );
};

export default MapSection;
