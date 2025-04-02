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
    price: 750,
    forSale: true,
    location: {
      lat: 19.0760,
      lng: 72.8777,
      address: 'Downtown Art District',
      area: 'Kala Ghoda'
    },
    createdAt: '2023-02-15T14:22:10Z',
    medium: 'Oil on Canvas',
    dimensions: '36" x 48"',
    year: 2023
  },
  {
    id: '2',
    title: 'Fragmented Memories',
    artist: 'Marcus Rivera',
    description: 'A mixed media piece combining photography, paint, and found objects to create a tapestry of memory and experience. Each element represents a fragment of the artist\'s personal journey.',
    category: 'Mixed Media',
    image: 'https://images.unsplash.com/photo-1569172122301-bc5008bc09c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: true,
    price: 950,
    forSale: true,
    location: {
      lat: 19.0178,
      lng: 72.8478,
      address: 'Echo Park Gallery',
      area: 'Bandra'
    },
    createdAt: '2023-03-22T09:15:30Z',
    medium: 'Mixed Media',
    dimensions: '24" x 36"',
    year: 2023
  },
  {
    id: '3',
    title: 'Whispers of Light',
    artist: 'Sonia Patel',
    description: 'This delicate sculpture plays with light and shadow, creating an ethereal experience that changes throughout the day as natural light moves across its surface.',
    category: 'Sculpture',
    image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: true,
    price: 1200,
    forSale: true,
    location: {
      lat: 19.0509,
      lng: 72.9309,
      address: 'Riverside Sculpture Garden',
      area: 'Powai'
    },
    createdAt: '2023-01-10T16:40:22Z',
    medium: 'Brass and Glass',
    dimensions: '18" x 12" x 8"',
    year: 2023
  },
  {
    id: '4',
    title: 'Digital Dreamscape',
    artist: 'Leo Kim',
    description: 'A vibrant digital artwork exploring the intersection of technology and imagination. Created using AI and traditional digital painting techniques.',
    category: 'Digital',
    image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: false,
    price: 450,
    forSale: true,
    location: {
      lat: 19.0222,
      lng: 72.8561,
      address: 'Tech Arts Center',
      area: 'Lower Parel'
    },
    createdAt: '2023-05-05T10:11:12Z',
    medium: 'Digital Print',
    dimensions: '24" x 24"',
    year: 2023
  },
  {
    id: '5',
    title: 'Moments in Time',
    artist: 'Camila Rodriguez',
    description: 'A series of photographs capturing fleeting moments of human connection in urban environments. The artist spent six months documenting spontaneous interactions between strangers.',
    category: 'Photography',
    image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: true,
    price: 850,
    forSale: true,
    location: {
      lat: 19.1241,
      lng: 72.9123,
      address: 'Street Photography Gallery',
      area: 'Andheri'
    },
    createdAt: '2023-04-18T14:30:45Z',
    medium: 'Archival Pigment Print',
    dimensions: '20" x 30"',
    year: 2023
  },
  {
    id: '6',
    title: 'Vessels of Memory',
    artist: 'Aiden Taylor',
    description: 'Hand-thrown ceramic vessels inspired by ancient pottery techniques but reimagined with contemporary forms and glazes. Each piece tells a story of cultural heritage.',
    category: 'Ceramics',
    image: 'https://images.unsplash.com/photo-1558879787-48100a7f6a68?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: false,
    price: 550,
    forSale: false,
    location: {
      lat: 19.1267,
      lng: 72.8382,
      address: 'Clay Collective Studio',
      area: 'Juhu'
    },
    createdAt: '2023-03-01T11:20:33Z',
    medium: 'Glazed Stoneware',
    dimensions: 'Various sizes',
    year: 2023
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
      lat: 19.0763,
      lng: 72.8773,
      address: 'Illustrated Arts Building',
      area: 'Fort'
    },
    createdAt: '2023-06-12T09:45:10Z',
    medium: 'Ink and Watercolor on Paper',
    dimensions: '11" x 14"',
    year: 2023
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
      lat: 19.0195,
      lng: 72.8259,
      address: 'Urban Sculpture Park',
      area: 'Worli'
    },
    createdAt: '2023-02-28T13:15:20Z',
    medium: 'Concrete and Metal',
    dimensions: 'Various sizes',
    year: 2022
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
      lat: 19.0098,
      lng: 72.8272,
      address: 'Modern Art Museum',
      area: 'Colaba'
    },
    createdAt: '2023-05-20T15:10:05Z',
    medium: 'Acrylic on Canvas',
    dimensions: '48" x 60"',
    year: 2023
  },
  {
    id: '10',
    title: 'Digital Archaeology',
    artist: 'Noah Park',
    description: 'A digital collage series examining the artifacts of internet culture and digital communication. The work preserves ephemeral online moments as archaeological specimens.',
    category: 'Digital',
    image: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: false,
    location: {
      lat: 19.1236,
      lng: 72.9123,
      address: 'New Media Gallery',
      area: 'Andheri'
    },
    createdAt: '2023-04-05T16:22:40Z',
    medium: 'Digital Print',
    dimensions: '24" x 36"',
    year: 2023
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
      lat: 19.0318,
      lng: 72.8401,
      address: 'Documentary Arts Center',
      area: 'Dadar'
    },
    createdAt: '2023-01-25T12:34:56Z',
    medium: 'Archival Pigment Print',
    dimensions: '16" x 20"',
    year: 2022
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
      lat: 19.0390,
      lng: 72.8619,
      address: 'Textile Arts Collective',
      area: 'Malabar Hill'
    },
    createdAt: '2023-03-15T10:30:00Z',
    medium: 'Textile, Found Objects',
    dimensions: '30" x 40"',
    year: 2023
  },
  {
    id: '13',
    title: 'Tranquil Waters',
    artist: 'Arjun Mehta',
    description: 'A soothing watercolor painting of the Mumbai coastline at dawn, capturing the serene moments before the city awakens.',
    category: 'Painting',
    image: 'https://images.unsplash.com/photo-1552083974-186346191183?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: false,
    price: 380,
    forSale: true,
    location: {
      lat: 19.0231,
      lng: 72.8143,
      address: 'Coastal Gallery',
      area: 'Marine Drive'
    },
    createdAt: '2023-08-02T08:15:00Z',
    medium: 'Watercolor on Paper',
    dimensions: '18" x 24"',
    year: 2023
  },
  {
    id: '14',
    title: 'Mumbai Dreams',
    artist: 'Priya Shah',
    description: 'A vibrant mixed media collage celebrating the diversity and energy of Mumbai, integrating fabric, newspaper clippings, and bold acrylic colors.',
    category: 'Mixed Media',
    image: 'https://images.unsplash.com/photo-1574182245530-967d9b3831af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: false,
    price: 620,
    forSale: true,
    location: {
      lat: 19.0754,
      lng: 72.8271,
      address: 'Contemporary Mumbai Gallery',
      area: 'Fort'
    },
    createdAt: '2023-07-12T10:30:00Z',
    medium: 'Mixed Media on Canvas',
    dimensions: '24" x 36"',
    year: 2023
  },
  {
    id: '15',
    title: 'Architectural Wonders',
    artist: 'Rahul Kapoor',
    description: 'A detailed pencil and ink drawing series showcasing the beautiful architectural heritage of Mumbai, from colonial buildings to modern skyscrapers.',
    category: 'Illustration',
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: true,
    price: 290,
    forSale: true,
    location: {
      lat: 19.0759,
      lng: 72.8776,
      address: 'Heritage Art Space',
      area: 'Kala Ghoda'
    },
    createdAt: '2023-09-20T14:45:00Z',
    medium: 'Pen and Ink on Paper',
    dimensions: '11" x 14"',
    year: 2023
  },
  {
    id: '16',
    title: 'Urban Wildlife',
    artist: 'Neha Desai',
    description: 'A collection of ceramic sculptures depicting the often-overlooked wildlife that exists within Mumbai\'s urban ecosystem.',
    category: 'Ceramics',
    image: 'https://images.unsplash.com/photo-1607448885122-b3d4f0953b33?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: false,
    price: 870,
    forSale: true,
    location: {
      lat: 19.1276,
      lng: 72.8551,
      address: 'Nature Arts Studio',
      area: 'Juhu'
    },
    createdAt: '2023-06-15T09:20:00Z',
    medium: 'Glazed Ceramic',
    dimensions: 'Various Sizes',
    year: 2023
  },
  {
    id: '17',
    title: 'Digital Mumbai',
    artist: 'Vikram Sharma',
    description: 'A series of digital illustrations reimagining Mumbai landmarks in a futuristic cyberpunk aesthetic.',
    category: 'Digital',
    image: 'https://images.unsplash.com/photo-1518136247453-74e7b5265980?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: false,
    price: 340,
    forSale: false,
    location: {
      lat: 19.0431,
      lng: 73.0297,
      address: 'Future Media Hub',
      area: 'Navi Mumbai - Vashi'
    },
    createdAt: '2023-08-15T11:45:00Z',
    medium: 'Digital Print',
    dimensions: '24" x 36"',
    year: 2023
  },
  {
    id: '18',
    title: 'Street Life Chronicles',
    artist: 'Aisha Mohammed',
    description: 'An intimate photographic journey documenting the everyday lives of street vendors and workers across different neighborhoods of Mumbai.',
    category: 'Photography',
    image: 'https://images.unsplash.com/photo-1542038335240-89ec5ba17882?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: false,
    location: {
      lat: 19.0330,
      lng: 72.8305,
      address: 'Street Documentation Project',
      area: 'Dadar'
    },
    createdAt: '2023-04-30T13:20:00Z',
    medium: 'Silver Gelatin Print',
    dimensions: '11" x 14"',
    year: 2022
  },
  {
    id: '19',
    title: 'Recycled Beauty',
    artist: 'Rohan Patil',
    description: 'An innovative sculpture series created entirely from recycled materials collected from Mumbai beaches, bringing awareness to marine pollution.',
    category: 'Sculpture',
    image: 'https://images.unsplash.com/photo-1558021211-6d1403321394?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: true,
    price: 1450,
    forSale: true,
    location: {
      lat: 19.0760,
      lng: 72.8777,
      address: 'Environmental Arts Center',
      area: 'Worli'
    },
    createdAt: '2023-05-15T10:00:00Z',
    medium: 'Recycled Materials',
    dimensions: 'Various Sizes',
    year: 2023
  },
  {
    id: '20',
    title: 'Monsoon Stories',
    artist: 'Leela Nair',
    description: 'A vibrant series of oil paintings capturing the mood and atmosphere of Mumbai during the monsoon season, from dramatic cloudscapes to reflections in puddles.',
    category: 'Painting',
    image: 'https://images.unsplash.com/photo-1580467277825-bb9585e8f8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: false,
    price: 980,
    forSale: true,
    location: {
      lat: 19.0214,
      lng: 73.0299,
      address: 'Seasonal Arts Gallery',
      area: 'Navi Mumbai - Belapur'
    },
    createdAt: '2023-07-10T16:15:00Z',
    medium: 'Oil on Canvas',
    dimensions: '30" x 40"',
    year: 2023
  },
  {
    id: '21',
    title: 'Botanical Sketches',
    artist: 'Sunita Patel',
    description: 'Delicate illustrations of native plant species found in the urban gardens and parks of Mumbai, rendered with botanical precision.',
    category: 'Illustration',
    image: 'https://images.unsplash.com/photo-1579541592725-218f9483e8c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: false,
    price: 320,
    forSale: true,
    location: {
      lat: 19.0330,
      lng: 73.0152,
      address: 'Botanical Arts Center',
      area: 'Navi Mumbai - Nerul'
    },
    createdAt: '2023-03-05T09:30:00Z',
    medium: 'Graphite and Watercolor on Paper',
    dimensions: '8" x 10"',
    year: 2022
  },
  {
    id: '22',
    title: 'Festival of Lights',
    artist: 'Deepak Sharma',
    description: 'A spectacular mixed media installation inspired by Diwali celebrations in Mumbai, incorporating lights, mirrors, and traditional patterns.',
    category: 'Mixed Media',
    image: 'https://images.unsplash.com/photo-1546198632-9ef6368bef12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: true,
    price: 1800,
    forSale: true,
    location: {
      lat: 19.2356,
      lng: 72.9780,
      address: 'Cultural Arts Center',
      area: 'Navi Mumbai - Kharghar'
    },
    createdAt: '2023-10-25T18:30:00Z',
    medium: 'Mixed Media Installation',
    dimensions: 'Room-sized Installation',
    year: 2023
  },
  {
    id: '23',
    title: 'Fishing Village Impressions',
    artist: 'Rajiv Sharma',
    description: 'A nostalgic series of impressionistic paintings depicting the traditional fishing villages that once dominated Mumbai\'s coastline.',
    category: 'Painting',
    image: 'https://images.unsplash.com/photo-1578301978018-3c235f36fdcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: false,
    price: 730,
    forSale: true,
    location: {
      lat: 19.0097,
      lng: 72.8628,
      address: 'Heritage Arts Museum',
      area: 'Colaba'
    },
    createdAt: '2023-02-12T14:30:00Z',
    medium: 'Oil on Canvas',
    dimensions: '24" x 36"',
    year: 2022
  },
  {
    id: '24',
    title: 'Digital Abstractions',
    artist: 'Kiran Joshi',
    description: 'Computer-generated abstract artworks that explore algorithmic patterns inspired by Mumbai\'s urban grid and transportation networks.',
    category: 'Digital',
    image: 'https://images.unsplash.com/photo-1486748719772-dac71e23eaa1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: false,
    price: 490,
    forSale: true,
    location: {
      lat: 19.0212,
      lng: 72.8440,
      address: 'Digital Arts Lab',
      area: 'Lower Parel'
    },
    createdAt: '2023-09-10T15:45:00Z',
    medium: 'Digital Print on Aluminum',
    dimensions: '24" x 24"',
    year: 2023
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
