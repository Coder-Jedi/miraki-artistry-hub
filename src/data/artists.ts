
import { Artist } from '@/types';

// Sample artists data
export const artistsData: Artist[] = [
  {
    id: "artist1",
    name: "Emma Johnson",
    bio: "Emma is a contemporary painter whose work explores the intersection of nature and human emotion through vivid colors and bold strokes.",
    location: {
      lat: 19.0596,
      lng: 72.8295,
      address: "Bandra, Mumbai",
      area: "Bandra"
    },
    profileImage: "/artwork1.jpg",
    socialLinks: {
      website: "https://example.com/emmajohnson",
      instagram: "https://instagram.com/emmajohnsonart"
    },
    popularity: 4.8
  },
  {
    id: "artist2",
    name: "David Chen",
    bio: "David specializes in traditional Chinese brush painting with a modern twist, creating serene landscapes that blend Eastern and Western techniques.",
    location: {
      lat: 18.9281,
      lng: 72.8319,
      address: "Kala Ghoda, Mumbai",
      area: "Kala Ghoda"
    },
    profileImage: "/artwork2.jpg",
    socialLinks: {
      website: "https://example.com/davidchen"
    },
    popularity: 4.2
  },
  {
    id: "artist3",
    name: "Sofia Rodriguez",
    bio: "Sofia's mixed media sculptures combine organic materials with industrial elements, challenging viewers to reconsider their relationship with the environment.",
    location: {
      lat: 19.0178,
      lng: 72.8478,
      address: "Dadar, Mumbai",
      area: "Dadar"
    },
    profileImage: "/artwork3.jpg",
    socialLinks: {
      website: "https://example.com/sofiarodriguez",
      instagram: "https://instagram.com/sofiarodriguezart"
    },
    popularity: 4.5
  },
  {
    id: "artist4",
    name: "Marcus Williams",
    bio: "Marcus creates digital art that blends sci-fi aesthetics with afrofuturism, exploring themes of identity, technology, and cultural heritage.",
    location: {
      lat: 19.1136,
      lng: 72.8697,
      address: "Andheri, Mumbai",
      area: "Andheri"
    },
    profileImage: "/artwork4.jpg",
    socialLinks: {
      website: "https://example.com/marcuswilliams",
      instagram: "https://instagram.com/marcuswilliamsart"
    },
    popularity: 3.9
  },
  {
    id: "artist5",
    name: "Lily Zhang",
    bio: "Lily's ceramic works are inspired by natural forms and traditional Eastern pottery techniques, creating functional art with organic textures and glazes.",
    location: {
      lat: 19.0748,
      lng: 73.0008,
      address: "Vashi, Navi Mumbai",
      area: "Navi Mumbai - Vashi"
    },
    profileImage: "/artwork5.jpg",
    socialLinks: {
      website: "https://example.com/lilyzhang"
    },
    popularity: 4.0
  },
  {
    id: "artist6",
    name: "James Wilson",
    bio: "James is a photographer who captures urban landscapes at twilight, revealing the hidden beauty in everyday city scenes through striking light and composition.",
    location: {
      lat: 19.0237,
      lng: 73.0400,
      address: "Belapur, Navi Mumbai",
      area: "Navi Mumbai - Belapur"
    },
    profileImage: "/artwork6.jpg",
    socialLinks: {
      website: "https://example.com/jameswilson",
      instagram: "https://instagram.com/jameswilsonphoto"
    },
    popularity: 4.7
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
