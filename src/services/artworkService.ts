import { apiClient, handleApiError } from './api';
import { Artwork, ArtworkCategory } from '@/types';

// Types
export interface ArtworkFilterParams {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  featured?: boolean;
  forSale?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Artwork API Services
export const artworkService = {
  /**
   * Get paginated list of artworks with optional filtering
   */
  getArtworks: async (params: ArtworkFilterParams = {}) => {
    try {
      const response = await apiClient.get('/artworks', { params });
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error)
      };
    }
  },

  /**
   * Get detailed information about a specific artwork
   */
  getArtworkById: async (_id: string) => {
    try {
      const response = await apiClient.get(`/artworks/${_id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error)
      };
    }
  },

  /**
   * Get artworks by a specific artist
   */
  getArtworksByArtist: async (artistId: string, params: ArtworkFilterParams = {}) => {
    try {
      const response = await apiClient.get(`/artworks/artist/${artistId}`, { params });
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error)
      };
    }
  },

  /**
   * Get featured artworks
   */
  getFeaturedArtworks: async (limit: number = 6) => {
    try {
      const response = await apiClient.get(`/artworks/featured`, { params: { limit } });
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error)
      };
    }
  },

  /**
   * Get all available artwork categories
   */
  getCategories: async () => {
    try {
      const response = await apiClient.get('/artworks/categories');
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error)
      };
    }
  },

  /**
   * Get all available artwork areas
   */
  getAreas: async () => {
    try {
      // This endpoint doesn't exist in the API docs, so we might need to derive areas from artworks
      // or use the artists/by-area endpoint as a substitute
      const response = await apiClient.get('/artists/by-area');
      return {
        success: true,
        data: {
          areas: response.data.data.areas.map((area: any) => area.name)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error)
      };
    }
  },

  /**
   * Toggle like status for an artwork (requires authentication)
   */
  toggleLike: async (artworkId: string) => {
    try {
      const response = await apiClient.post(`/artworks/${artworkId}/like`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error)
      };
    }
  },

  /**
   * Map API artwork to the application's Artwork type
   */
  mapApiArtworkToModel: (apiArtwork: any): Artwork => {
    return {
      _id: apiArtwork._id,
      title: apiArtwork.title,
      artist: apiArtwork.artist,
      artistId: apiArtwork.artistId,
      description: apiArtwork.description,
      category: apiArtwork.category as ArtworkCategory,
      image: apiArtwork.image,
      additionalImages: apiArtwork.additionalImages || [],
      featured: apiArtwork.featured || false,
      price: apiArtwork.price,
      forSale: apiArtwork.forSale || false,
      location: {
        lat: apiArtwork.location?.lat,
        lng: apiArtwork.location?.lng,
        address: apiArtwork.location?.area,
        area: apiArtwork.location?.area,
      },
      createdAt: apiArtwork.createdAt,
      medium: apiArtwork.medium,
      dimensions: apiArtwork.dimensions,
      year: apiArtwork.year,
      likes: apiArtwork.likes || 0
    };
  }
};