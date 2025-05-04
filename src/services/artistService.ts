import { apiClient, handleApiError } from './api';
import { Artist } from '@/types';

// Types
export interface ArtistFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  location?: string;
  featured?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Artist API Services
export const artistService = {
  /**
   * Get paginated list of artists with optional filtering
   */
  getArtists: async (params: ArtistFilterParams = {}) => {
    try {
      const response = await apiClient.get('/artists', { params });
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error)
      };
    }
  },

  /**
   * Get detailed information about a specific artist
   */
  getArtistById: async (_id: string) => {
    try {
      const response = await apiClient.get(`/artists/${_id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error)
      };
    }
  },

  /**
   * Get featured artists
   */
  getFeaturedArtists: async (limit: number = 6) => {
    try {
      const response = await apiClient.get(`/artists/featured`, { params: { limit } });
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error)
      };
    }
  },

  /**
   * Get artists grouped by area
   */
  getArtistsByArea: async () => {
    try {
      const response = await apiClient.get('/artists/by-area');
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error)
      };
    }
  },
  
  /**
   * Get all available artist areas
   */
  getAreas: async () => {
    try {
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
   * Map API artist to the application's Artist type
   */
  mapApiArtistToModel: (apiArtist: any): Artist => {
    return {
      _id: apiArtist._id,
      name: apiArtist.name,
      bio: apiArtist.bio || '',
      profileImage: apiArtist.profileImage,
      location: {
        lat: apiArtist.location?.lat,
        lng: apiArtist.location?.lng,
        address: apiArtist.location?.area,
        area: apiArtist.location?.area,
      },
      socialLinks: apiArtist.socialLinks || {},
      popularity: apiArtist.popularity || 0,
      featured: apiArtist.featured || false,
      // If the API returns artworks as part of the artist data, they will be included
      artworks: apiArtist.artworks || [] 
    };
  }
};