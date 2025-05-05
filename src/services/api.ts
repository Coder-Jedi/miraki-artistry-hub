import axios from 'axios';

// API configuration
export const API_HOST = 'http://localhost:3000/api/v1'; // As specified in requirements
export const API_HOST_PROD = 'https://apis.algoampify.com/api/v1'; // Production URL
const API_BASE_URL = `${API_HOST_PROD}/`;

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 Unauthorized and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Could add token refresh logic here if needed
      
      // Clear user data on auth error
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login page if needed
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// API error handling helper
export const handleApiError = (error: any) => {
  let errorMessage = 'An unexpected error occurred';
  
  if (error.response) {
    // Server responded with error
    const serverError = error.response.data;
    if (serverError.error?.message) {
      errorMessage = serverError.error.message;
    } else {
      errorMessage = `Error ${error.response.status}: ${error.response.statusText}`;
    }
  } else if (error.request) {
    // Request made but no response received
    errorMessage = 'No response received from server. Please check your connection.';
  }
  
  return errorMessage;
};