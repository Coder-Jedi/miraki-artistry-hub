
export interface Artwork {
  _id: string;
  title: string;
  artist: string;
  artistId: string;
  year: number;
  medium: string;
  image: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    area?: string;
  };
  price?: number;
  category: ArtworkCategory;
  description: string;
  likes: number;
  featured?: boolean;
  forSale?: boolean;
  createdAt?: string;
  dimensions?: string;
}

export type ArtworkCategory = 
  | "All" 
  | "Painting" 
  | "Sculpture" 
  | "Photography" 
  | "Digital" 
  | "Digital Art"
  | "Mixed Media" 
  | "Ceramics" 
  | "Illustration" 
  | "Other";

export interface FilterOptions {
  category: ArtworkCategory;
  searchQuery: string;
  location: string;
}

export interface Artist {
  _id: string;
  name: string;
  bio?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
    area?: string;
  };
  profileImage?: string;
  socialLinks?: {
    website?: string;
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
  popularity?: number;
  artworks?: Artwork[];
  featured?: boolean;
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
