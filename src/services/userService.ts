import { apiClient, handleApiError } from './api';

// User API Services
export const userService = {
  /**
   * Get the current user's profile
   */
  getUserProfile: async () => {
    try {
      const response = await apiClient.get('/users/me');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Update the current user's profile
   */
  updateUserProfile: async (data: { name?: string; profileImage?: string }) => {
    try {
      const response = await apiClient.put('/users/me', data);
      // Update stored user data
      if (response.data.success) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          localStorage.setItem('user', JSON.stringify({
            ...user,
            name: data.name || user.name,
            profileImage: data.profileImage || user.profileImage
          }));
        }
      }
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Get the current user's favorite artworks
   */
  getUserFavorites: async () => {
    try {
      const response = await apiClient.get('/users/me/favorites');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Add an artwork to user's favorites
   */
  addToFavorites: async (artworkId: string) => {
    try {
      const response = await apiClient.post(`/users/me/favorites/${artworkId}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Remove an artwork from user's favorites
   */
  removeFromFavorites: async (artworkId: string) => {
    try {
      const response = await apiClient.delete(`/users/me/favorites/${artworkId}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Get the current user's addresses
   */
  getUserAddresses: async () => {
    try {
      const response = await apiClient.get('/users/me/addresses');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Add a new address for the user
   */
  addUserAddress: async (addressData: any) => {
    try {
      const response = await apiClient.post('/users/me/addresses', addressData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Update an address for the user
   */
  updateUserAddress: async (addressId: string, addressData: any) => {
    try {
      const response = await apiClient.put(`/users/me/addresses/${addressId}`, addressData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Delete an address
   */
  deleteUserAddress: async (addressId: string) => {
    try {
      const response = await apiClient.delete(`/users/me/addresses/${addressId}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
};