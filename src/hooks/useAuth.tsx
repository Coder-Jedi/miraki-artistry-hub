import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Artwork } from '@/types';
import { authService } from '@/services/authService';
import { cartService } from '@/services/cartService';
import { userService } from '@/services/userService';

// Define the cart item structure
interface CartItem {
  _id: string;
  title: string;
  artist: string;
  artworkId: string;
  price: number;
  image: string;
  quantity: number;
}

// Define the shape of user data
interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
}

// Define the shape of the auth context
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  // Cart functionality
  cart: CartItem[];
  addToCart: (artwork: Artwork) => void;
  updateCartItemQuantity: (artworkId: string, newQuantity: number) => void;
  removeFromCart: (artworkId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  // Favorites functionality
  favorites: Artwork[];
  favoritesLoading: boolean;
  addToFavorites: (artwork: Artwork) => Promise<void>;
  removeFromFavorites: (artworkId: string) => Promise<void>;
  isFavorite: (artworkId: string) => boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  // Cart default values
  cart: [],
  addToCart: () => {},
  updateCartItemQuantity: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  cartTotal: 0,
  // Favorites default values
  favorites: [],
  favoritesLoading: false,
  addToFavorites: async () => {},
  removeFromFavorites: async () => {},
  isFavorite: () => false,
});

// Create the provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<Artwork[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Check if an artwork is in favorites
  const isFavorite = (artworkId: string) => {
    return favorites.some(artwork => artwork._id === artworkId);
  };

  // Fetch user favorites
  const fetchUserFavorites = async () => {
    // Check for authentication token instead of user object
    if (!authService.isAuthenticated()) return;
    
    setFavoritesLoading(true);
    try {
      const response = await userService.getUserFavorites();
      if (response.success && response.data?.favorites) {
        setFavorites(response.data.favorites);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setFavoritesLoading(false);
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      // Check if token exists
      const token = localStorage.getItem('token');
      if (token) {
        // Get user data from local storage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        
        try {
          // Optionally validate token with the server
          // await authService.validateToken();
          
          // If we're using the API for cart, fetch the cart data
          if (authService.isAuthenticated()) {
            try {
              const cartResponse = await cartService.getCart();
              // Map API cart data to our format
              const cartItems = cartResponse.items.map(item => ({
                _id: item._id,
                title: item.title,
                artist: item.artist,
                artworkId: item.artworkId,
                price: item.price,
                image: item.image,
                quantity: item.quantity
              }));
              setCart(cartItems);
              
              // Fetch user's favorites
              await fetchUserFavorites();
            } catch (error) {
              console.error('Error fetching cart:', error);
              // If API fails, use local cart data as fallback
              const storedCart = localStorage.getItem('cart');
              if (storedCart) {
                setCart(JSON.parse(storedCart));
              }
            }
          }
        } catch (error) {
          // Token invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        // Restore cart from localStorage for non-authenticated users
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Update localStorage when cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Add to favorites function
  const addToFavorites = async (artwork: Artwork) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add items to your favorites.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const response = await userService.addToFavorites(artwork._id);
      if (response.success) {
        // Add to local favorites state
        setFavorites(prev => [...prev.filter(item => item._id !== artwork._id), artwork]);
        
        toast({
          title: "Added to Favorites",
          description: `${artwork.title} has been added to your favorites.`,
        });
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast({
        title: "Error",
        description: "Failed to add to favorites. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Remove from favorites function
  const removeFromFavorites = async (artworkId: string) => {
    if (!user) return;
    
    try {
      const response = await userService.removeFromFavorites(artworkId);
      if (response.success) {
        // Remove from local favorites state
        setFavorites(prev => prev.filter(item => item._id !== artworkId));
        
        toast({
          title: "Removed from Favorites",
          description: "Artwork has been removed from your favorites.",
        });
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast({
        title: "Error",
        description: "Failed to remove from favorites. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Add to cart function
  const addToCart = async (artwork: Artwork) => {
    if (!artwork.price) {
      toast({
        title: "Cannot add to cart",
        description: "This artwork is not for sale.",
        variant: "destructive",
      });
      return;
    }

    // Update local cart state
    setCart(currentCart => {
      // Check if item already exists in cart
      const existingItemIndex = currentCart.findIndex(item => item._id === artwork._id);
      
      if (existingItemIndex > -1) {
        // Item exists, update quantity
        const updatedCart = [...currentCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1
        };
        return updatedCart;
      } else {
        // Item doesn't exist, add new item
        return [...currentCart, {
          _id: artwork._id,
          title: artwork.title,
          artist: artwork.artist,
          price: artwork.price || 0,
          image: artwork.image,
          quantity: 1
        }];
      }
    });

    // If authenticated, update server cart
    if (authService.isAuthenticated()) {
      try {
        await cartService.addToCart(artwork._id, 1);
      } catch (error) {
        console.error('Error adding to cart on server:', error);
        // Continue with local cart, don't block the user experience
      }
    }

    toast({
      title: "Added to cart",
      description: `${artwork.title} has been added to your cart.`,
    });
  };

  // Update cart item quantity function
  const updateCartItemQuantity = async (artworkId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      // If quantity is zero or negative, remove the item from cart
      setCart(currentCart => currentCart.filter(item => item._id !== artworkId));
      
      // If authenticated, update server cart
      if (authService.isAuthenticated()) {
        try {
          // Get the cart to find the item ID
          const serverCart = await cartService.getCart();
          const serverItem = serverCart.items.find(item => item.artworkId === artworkId || item.artwork?._id === artworkId);
          if (serverItem) {
            await cartService.removeFromCart(serverItem._id);
          }
        } catch (error) {
          console.error('Error removing from cart on server:', error);
        }
      }
      
      toast({
        title: "Item Removed",
        description: "The item has been removed from your cart.",
      });
    } else {
      // Update local cart
      setCart(currentCart => {
        const existingItemIndex = currentCart.findIndex(item => item._id === artworkId);
        
        if (existingItemIndex > -1) {
          // Item exists, update quantity
          const updatedCart = [...currentCart];
          updatedCart[existingItemIndex] = {
            ...updatedCart[existingItemIndex],
            quantity: newQuantity
          };
          return updatedCart;
        }
        return currentCart;
      });
      
      // If authenticated, update server cart
      if (authService.isAuthenticated()) {
        try {
          await cartService.updateCartItemQuantity(artworkId, newQuantity);
        } catch (error) {
          console.error('Error updating cart item quantity on server:', error);
        }
      }
      
      toast({
        title: "Cart Updated",
        description: "Item quantity has been updated.",
      });
    }
  };

  // Remove from cart function
  const removeFromCart = async (artworkId: string) => {
    // Update local cart
    setCart(currentCart => currentCart.filter(item => item._id !== artworkId));
    
    // If authenticated, update server cart
    if (authService.isAuthenticated()) {
      try {
        // Need to find the cart item ID from the server
        const serverCart = await cartService.getCart();
        const serverItem = serverCart.items.find(item => item.artwork._id === artworkId);
        if (serverItem) {
          await cartService.removeFromCart(serverItem._id);
        }
      } catch (error) {
        console.error('Error removing from cart on server:', error);
        // Continue with local cart, don't block the user experience
      }
    }
    
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart.",
    });
  };

  // Clear cart function
  const clearCart = async () => {
    // Update local cart
    setCart([]);
    
    // If authenticated, update server cart
    if (authService.isAuthenticated()) {
      try {
        await cartService.clearCart();
      } catch (error) {
        console.error('Error clearing cart on server:', error);
      }
    }
    
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const loginResponse = await authService.login({ email, password });
      
      if (loginResponse.success) {
        setUser(loginResponse.data.user);
        
        // If the user had items in their local cart, sync with server
        if (cart.length > 0) {
          try {
            await cartService.syncLocalCartWithServer(cart);
            // Refresh cart from server
            const serverCart = await cartService.getCart();
            const cartItems = serverCart.items.map(item => ({
              _id: item.artwork._id,
              title: item.artwork.title,
              artist: item.artwork.artist,
              price: item.price,
              image: item.artwork.image,
              quantity: item.quantity
            }));
            setCart(cartItems);
          } catch (error) {
            console.error('Error syncing cart with server:', error);
            // Keep using local cart
          }
        } else {
          // Fetch user's server cart
          try {
            const serverCart = await cartService.getCart();
            const cartItems = serverCart.items.map(item => ({
              _id: item.artwork._id,
              title: item.artwork.title,
              artist: item.artwork.artist,
              price: item.price,
              image: item.artwork.image,
              quantity: item.quantity
            }));
            setCart(cartItems);
          } catch (error) {
            console.error('Error fetching cart from server:', error);
            // Keep empty cart
          }
        }
        
        // Fetch user's favorites
        await fetchUserFavorites();
        
        toast({
          title: "Login Successful",
          description: `Welcome back, ${loginResponse.data.user.name}!`,
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const registerResponse = await authService.register({ 
        name, 
        email, 
        password, 
        confirmPassword: password 
      });
      
      if (registerResponse.success) {
        // If the API returns user data and token
        if (registerResponse.data?.user) {
          setUser(registerResponse.data.user);
          
          // If the user had items in their local cart, sync with server
          if (cart.length > 0) {
            try {
              await cartService.syncLocalCartWithServer(cart);
            } catch (error) {
              console.error('Error syncing cart with server:', error);
            }
          }
          
          // Initialize empty favorites
          setFavorites([]);
        }
        
        toast({
          title: "Registration Successful",
          description: `Welcome, ${name}! Your account has been created.`,
        });
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "Could not create your account. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with logout even if API fails
    }
    
    setUser(null);
    setFavorites([]);
    // Keep the cart data for guest users
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        cart,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        favorites,
        favoritesLoading,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
