
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Artwork } from '@/types';

// Define the cart item structure
interface CartItem {
  id: string;
  title: string;
  artist: string;
  price: number;
  image: string;
  quantity: number;
}

// Define the shape of user data
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
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
  removeFromCart: (artworkId: string) => void;
  clearCart: () => void;
  cartTotal: number;
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
  removeFromCart: () => {},
  clearCart: () => {},
  cartTotal: 0,
});

// Mock user data for demo
const MOCK_USER: User = {
  id: 'user-123',
  name: 'Demo User',
  email: 'demo@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

// Create the provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      // In a real app, we would validate the token with the backend
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      
      // Restore cart from localStorage
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Update localStorage when cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Add to cart function
  const addToCart = (artwork: Artwork) => {
    if (!artwork.price) {
      toast({
        title: "Cannot add to cart",
        description: "This artwork is not for sale.",
        variant: "destructive",
      });
      return;
    }

    setCart(currentCart => {
      // Check if item already exists in cart
      const existingItemIndex = currentCart.findIndex(item => item.id === artwork.id);
      
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
          id: artwork.id,
          title: artwork.title,
          artist: artwork.artist,
          price: artwork.price || 0,
          image: artwork.image,
          quantity: 1
        }];
      }
    });

    toast({
      title: "Added to cart",
      description: `${artwork.title} has been added to your cart.`,
    });
  };

  // Remove from cart function
  const removeFromCart = (artworkId: string) => {
    setCart(currentCart => currentCart.filter(item => item.id !== artworkId));
    
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart.",
    });
  };

  // Clear cart function
  const clearCart = () => {
    setCart([]);
    
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would validate credentials with the backend
      // For now, we'll accept any login and use our mock user
      setUser(MOCK_USER);
      localStorage.setItem('user', JSON.stringify(MOCK_USER));
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${MOCK_USER.name}!`,
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "Invalid email or password.",
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would create a new user with the backend
      const newUser: User = {
        ...MOCK_USER,
        name,
        email,
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      toast({
        title: "Registration Successful",
        description: `Welcome, ${name}! Your account has been created.`,
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "Could not create your account. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
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
        removeFromCart,
        clearCart,
        cartTotal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
