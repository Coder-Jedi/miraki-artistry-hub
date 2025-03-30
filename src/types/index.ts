
export interface Artwork {
  id: string;
  title: string;
  artist: string;
  description: string;
  category: string;
  image: string;
  featured: boolean;
  price?: number;
  forSale?: boolean;
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

// Additional types for new features

export interface Artist {
  id: string;
  name: string;
  bio: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  profileImage?: string;
  socialLinks?: {
    website?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  favorites?: string[]; // Array of artwork IDs
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CartItem {
  id: string;
  title: string;
  artist: string;
  price: number;
  image: string;
  quantity: number;
}
