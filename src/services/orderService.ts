import { apiClient, handleApiError } from './api';

// Types
export interface OrderItem {
  artwork: {
    id: string;
    title: string;
    artist: string;
    image: string;
  };
  quantity: number;
  price: number;
  subtotal: number;
}

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface ShippingAddress {
  id?: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface PaymentDetails {
  cardToken: string;
  savePaymentMethod: boolean;
}

export interface CreateOrderRequest {
  shippingAddressId: string;
  paymentMethod: 'card' | 'wallet';
  paymentDetails: PaymentDetails;
  notes?: string;
}

export interface Order {
  id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled';
  items: OrderItem[];
  summary: OrderSummary;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentDetails?: any;
  timeline?: {
    status: string;
    timestamp: string;
    note?: string;
  }[];
  trackingInfo?: {
    carrier: string;
    trackingNumber: string;
    expectedDelivery?: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderFilterParams {
  page?: number;
  limit?: number;
  status?: string;
}

// Order API Services
export const orderService = {
  /**
   * Create a new order from cart items
   */
  createOrder: async (orderData: CreateOrderRequest) => {
    try {
      const response = await apiClient.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Get a list of all orders placed by the user
   */
  getUserOrders: async (params: OrderFilterParams = {}) => {
    try {
      const response = await apiClient.get('/orders', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Get details of a specific order
   */
  getOrderById: async (orderId: string) => {
    try {
      const response = await apiClient.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
};