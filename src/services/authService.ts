import { apiClient, handleApiError } from './api';

// Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Auth API Services
export const authService = {
  /**
   * Authenticate user and get token
   */
  login: async (data: LoginRequest) => {
    try {
      const response = await apiClient.post('/auth/login', data);
      // Store the token and user data
      if (response.data.success && response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Register a new user
   */
  register: async (data: RegisterRequest) => {
    try {
      // Remove confirmPassword from the request as the API doesn't expect it
      const { confirmPassword, ...requestData } = data;
      
      const response = await apiClient.post('/auth/register', requestData);
      // Store the token and user data if registration includes auto-login
      if (response.data.success && response.data.data?.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Logout the current user
   */
  logout: async () => {
    try {
      // Call the logout endpoint if the API requires it
      await apiClient.post('/auth/logout');
      // Always clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('cart');
      return { success: true, message: 'Successfully logged out' };
    } catch (error) {
      // Even if the API call fails, clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('cart');
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Request a password reset
   */
  requestPasswordReset: async (data: PasswordResetRequest) => {
    try {
      const response = await apiClient.post('/auth/reset-password', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Complete password reset with token
   */
  confirmPasswordReset: async (data: PasswordResetConfirmRequest) => {
    try {
      const response = await apiClient.post('/auth/reset-password/confirm', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Change password for authenticated user
   */
  changePassword: async (data: PasswordChangeRequest) => {
    try {
      const response = await apiClient.post('/auth/change-password', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  /**
   * Get the current user
   */
  getCurrentUser: () => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      return JSON.parse(userJson);
    }
    return null;
  }
};