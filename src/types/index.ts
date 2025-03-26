
export interface Artwork {
  id: string;
  title: string;
  artist: string;
  description: string;
  category: string;
  image: string;
  featured: boolean;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  createdAt: string; // ISO date string
}

export type ArtworkCategory = 
  | 'All'
  | 'Painting'
  | 'Sculpture'
  | 'Photography'
  | 'Digital'
  | 'Mixed Media'
  | 'Ceramics'
  | 'Illustration';

export interface FilterOptions {
  category: ArtworkCategory;
  searchQuery: string;
}
