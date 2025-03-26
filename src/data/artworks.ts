
import { Artwork, ArtworkCategory } from '@/types';

export const artworkCategories: ArtworkCategory[] = [
  'All',
  'Painting',
  'Sculpture', 
  'Photography',
  'Digital',
  'Mixed Media',
  'Ceramics',
  'Illustration'
];

export const artworksData: Artwork[] = [
  {
    id: '1',
    title: 'Urban Serenity',
    artist: 'Eliza Chen',
    description: 'A contemplative piece exploring the contrast between urban architecture and natural elements. This painting invites viewers to find moments of calm within the chaos of city life.',
    category: 'Painting',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: true,
    location: {
      lat: 34.0522,
      lng: -118.2437,
      address: 'Downtown Art District'
    },
    createdAt: '2023-02-15T14:22:10Z'
  },
  {
    id: '2',
    title: 'Fragmented Memories',
    artist: 'Marcus Rivera',
    description: 'A mixed media piece combining photography, paint, and found objects to create a tapestry of memory and experience. Each element represents a fragment of the artist\'s personal journey.',
    category: 'Mixed Media',
    image: 'https://images.unsplash.com/photo-1569172122301-bc5008bc09c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: true,
    location: {
      lat: 34.0511,
      lng: -118.2468,
      address: 'Echo Park Gallery'
    },
    createdAt: '2023-03-22T09:15:30Z'
  },
  {
    id: '3',
    title: 'Whispers of Light',
    artist: 'Sonia Patel',
    description: 'This delicate sculpture plays with light and shadow, creating an ethereal experience that changes throughout the day as natural light moves across its surface.',
    category: 'Sculpture',
    image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: true,
    location: {
      lat: 34.0505,
      lng: -118.2400,
      address: 'Riverside Sculpture Garden'
    },
    createdAt: '2023-01-10T16:40:22Z'
  },
  {
    id: '4',
    title: 'Digital Dreamscape',
    artist: 'Leo Kim',
    description: 'A vibrant digital artwork exploring the intersection of technology and imagination. Created using AI and traditional digital painting techniques.',
    category: 'Digital',
    image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: false,
    location: {
      lat: 34.0530,
      lng: -118.2436,
      address: 'Tech Arts Center'
    },
    createdAt: '2023-05-05T10:11:12Z'
  },
  {
    id: '5',
    title: 'Moments in Time',
    artist: 'Camila Rodriguez',
    description: 'A series of photographs capturing fleeting moments of human connection in urban environments. The artist spent six months documenting spontaneous interactions between strangers.',
    category: 'Photography',
    image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: true,
    location: {
      lat: 34.0495,
      lng: -118.2475,
      address: 'Street Photography Gallery'
    },
    createdAt: '2023-04-18T14:30:45Z'
  },
  {
    id: '6',
    title: 'Vessels of Memory',
    artist: 'Aiden Taylor',
    description: 'Hand-thrown ceramic vessels inspired by ancient pottery techniques but reimagined with contemporary forms and glazes. Each piece tells a story of cultural heritage.',
    category: 'Ceramics',
    image: 'https://images.unsplash.com/photo-1558879787-48100a7f6a68?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: false,
    location: {
      lat: 34.0535,
      lng: -118.2500,
      address: 'Clay Collective Studio'
    },
    createdAt: '2023-03-01T11:20:33Z'
  },
  {
    id: '7',
    title: 'Botanical Dreams',
    artist: 'Harper Wilson',
    description: 'Detailed illustrations of imaginary plants and flowers that blend scientific precision with fantastical elements. Created using traditional ink and watercolor techniques.',
    category: 'Illustration',
    image: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: false,
    location: {
      lat: 34.0518,
      lng: -118.2426,
      address: 'Illustrated Arts Building'
    },
    createdAt: '2023-06-12T09:45:10Z'
  },
  {
    id: '8',
    title: 'Concrete Poetry',
    artist: 'Gabriel Okafor',
    description: 'A series of sculptural works that incorporate text and typography into concrete forms, exploring the materiality of language and the weight of words.',
    category: 'Sculpture',
    image: 'https://images.unsplash.com/photo-1531913764164-f85c52e6e654?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: false,
    location: {
      lat: 34.0500,
      lng: -118.2450,
      address: 'Urban Sculpture Park'
    },
    createdAt: '2023-02-28T13:15:20Z'
  },
  {
    id: '9',
    title: 'Chromatic Symphony',
    artist: 'Isabella Chen',
    description: 'An immersive painting that uses color theory and abstract forms to create a visual representation of a musical composition. The artist worked with a composer to create this synesthetic experience.',
    category: 'Painting',
    image: 'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: true,
    location: {
      lat: 34.0527,
      lng: -118.2465,
      address: 'Modern Art Museum'
    },
    createdAt: '2023-05-20T15:10:05Z'
  },
  {
    id: '10',
    title: 'Digital Archaeology',
    artist: 'Noah Park',
    description: 'A digital collage series examining the artifacts of internet culture and digital communication. The work preserves ephemeral online moments as archaeological specimens.',
    category: 'Digital',
    image: 'https://images.unsplash.com/photo-1568819317551-31051b37f69f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: false,
    location: {
      lat: 34.0508,
      lng: -118.2427,
      address: 'New Media Gallery'
    },
    createdAt: '2023-04-05T16:22:40Z'
  },
  {
    id: '11',
    title: 'Urban Patterns',
    artist: 'Maya Johnson',
    description: 'Street photography that focuses on repetitive patterns and textures found in urban environments. The artist reveals the hidden geometry of everyday spaces.',
    category: 'Photography',
    image: 'https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: false,
    location: {
      lat: 34.0515,
      lng: -118.2440,
      address: 'Documentary Arts Center'
    },
    createdAt: '2023-01-25T12:34:56Z'
  },
  {
    id: '12',
    title: 'Tactile Memories',
    artist: 'David Nguyen',
    description: 'Mixed media textile work that incorporates fabric, found objects, and embroidery to create touchable narratives about family history and migration.',
    category: 'Mixed Media',
    image: 'https://images.unsplash.com/photo-1576087710799-a7e1df193f18?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: false,
    location: {
      lat: 34.0532,
      lng: -118.2445,
      address: 'Textile Arts Collective'
    },
    createdAt: '2023-03-15T10:30:00Z'
  }
];

// Helper function to get random artworks
export const getRandomArtworks = (count: number): Artwork[] => {
  const shuffled = [...artworksData].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper function to get featured artworks
export const getFeaturedArtworks = (): Artwork[] => {
  return artworksData.filter(artwork => artwork.featured);
};
