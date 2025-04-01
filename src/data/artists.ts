
import { Artist } from '@/types';

// Sample artists data
export const artistsData: Artist[] = [
  {
    id: "artist1",
    name: "Emma Johnson",
    bio: "Emma is a contemporary painter whose work explores the intersection of nature and human emotion through vivid colors and bold strokes.",
    location: {
      lat: 40.7128,
      lng: -74.0060,
      address: "New York, NY"
    },
    profileImage: "/artwork1.jpg",
    socialLinks: {
      website: "https://example.com/emmajohnson",
      instagram: "https://instagram.com/emmajohnsonart"
    }
  },
  {
    id: "artist2",
    name: "David Chen",
    bio: "David specializes in traditional Chinese brush painting with a modern twist, creating serene landscapes that blend Eastern and Western techniques.",
    location: {
      lat: 37.7749,
      lng: -122.4194,
      address: "San Francisco, CA"
    },
    profileImage: "/artwork2.jpg",
    socialLinks: {
      website: "https://example.com/davidchen"
    }
  },
  {
    id: "artist3",
    name: "Sofia Rodriguez",
    bio: "Sofia's mixed media sculptures combine organic materials with industrial elements, challenging viewers to reconsider their relationship with the environment.",
    location: {
      lat: 25.7617,
      lng: -80.1918,
      address: "Miami, FL"
    },
    profileImage: "/artwork3.jpg",
    socialLinks: {
      website: "https://example.com/sofiarodriguez",
      instagram: "https://instagram.com/sofiarodriguezart"
    }
  },
  {
    id: "artist4",
    name: "Marcus Williams",
    bio: "Marcus creates digital art that blends sci-fi aesthetics with afrofuturism, exploring themes of identity, technology, and cultural heritage.",
    location: {
      lat: 33.7490,
      lng: -84.3880,
      address: "Atlanta, GA"
    },
    profileImage: "/artwork4.jpg",
    socialLinks: {
      website: "https://example.com/marcuswilliams",
      instagram: "https://instagram.com/marcuswilliamsart"
    }
  },
  {
    id: "artist5",
    name: "Lily Zhang",
    bio: "Lily's ceramic works are inspired by natural forms and traditional Eastern pottery techniques, creating functional art with organic textures and glazes.",
    location: {
      lat: 34.0522,
      lng: -118.2437,
      address: "Los Angeles, CA"
    },
    profileImage: "/artwork5.jpg",
    socialLinks: {
      website: "https://example.com/lilyzhang"
    }
  },
  {
    id: "artist6",
    name: "James Wilson",
    bio: "James is a photographer who captures urban landscapes at twilight, revealing the hidden beauty in everyday city scenes through striking light and composition.",
    location: {
      lat: 41.8781,
      lng: -87.6298,
      address: "Chicago, IL"
    },
    profileImage: "/artwork6.jpg",
    socialLinks: {
      website: "https://example.com/jameswilson",
      instagram: "https://instagram.com/jameswilsonphoto"
    }
  }
];

// Get featured artists
export const getFeaturedArtists = (): Artist[] => {
  // In a real app, this would likely use some criteria to select featured artists
  // For this demo, we'll just return all artists
  return artistsData;
};

// Get artist by ID
export const getArtistById = (id: string): Artist | undefined => {
  return artistsData.find(artist => artist.id === id);
};

// Get artist by name
export const getArtistByName = (name: string): Artist | undefined => {
  return artistsData.find(artist => 
    artist.name.toLowerCase() === name.toLowerCase()
  );
};
