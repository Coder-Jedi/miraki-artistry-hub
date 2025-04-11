export interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: number;
  medium: string;
  image: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  price: number;
  category: ArtworkCategory;
  description: string;
  likes: number;
}

export type ArtworkCategory = "All" | "Painting" | "Sculpture" | "Photography" | "Digital Art" | "Other";

export interface FilterOptions {
  category: ArtworkCategory;
  searchQuery: string;
  location: string;
}

export interface Artist {
  id: string;
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
}
