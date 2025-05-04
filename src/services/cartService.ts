import { apiClient, handleApiError } from './api';

// Types
export interface CartItem {
  _id: string;
  artworkId: string;
  title: string;
  artist: string;
  image: string;
  price: number;
  quantity: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface Cart {
  items: CartItem[];
  summary: CartSummary;
}

// Cart API Services
export const cartService = {
  /**
   * Get the current user's shopping cart
   */
  getCart: async (): Promise<Cart> => {
    try {
      const response = await apiClient.get('/cart');
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Add an artwork to the shopping cart
   */
  addToCart: async (artworkId: string, quantity: number = 1) => {
    try {
      const response = await apiClient.post('/cart/items', { artworkId, quantity });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Update the quantity of a cart item
   */
  updateCartItem: async (itemId: string, quantity: number) => {
    try {
      const response = await apiClient.put(`/cart/items/${itemId}`, { quantity });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Update the quantity of a cart item by artwork ID
   */
  updateCartItemQuantity: async (artworkId: string, quantity: number) => {
    try {
      // First, get the current cart
      const cart = await cartService.getCart();
      
      // Find the cart item with matching artwork ID, checking both artworkId and direct artwork._id
      const item = cart.items.find(item => 
        item.artworkId === artworkId || 
        item.artwork?._id === artworkId ||
        item._id === artworkId
      );
      
      if (!item) {
        // If item doesn't exist and quantity > 0, add it
        if (quantity > 0) {
          await cartService.addToCart(artworkId, quantity);
        }
        return;
      }
      
      if (quantity <= 0) {
        // If quantity is 0 or negative, remove the item
        await cartService.removeFromCart(item._id);
      } else {
        // Otherwise, update the quantity
        await cartService.updateCartItem(item._id, quantity);
      }
      
      return await cartService.getCart();
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Remove an item from the cart
   */
  removeFromCart: async (itemId: string) => {
    try {
      const response = await apiClient.delete(`/cart/items/${itemId}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Clear the entire cart
   */
  clearCart: async () => {
    try {
      const response = await apiClient.delete('/cart');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Sync local cart with server (for guest users when they log in)
   * This is a utility function not directly tied to an API endpoint
   */
  syncLocalCartWithServer: async (localCart: any[]) => {
    try {
      // First, clear the server cart
      await cartService.clearCart();
      
      // Then add each local cart item to the server cart
      for (const item of localCart) {
        await cartService.addToCart(item._id, item.quantity);
      }
      
      // Finally, get the updated cart from server
      return await cartService.getCart();
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
};