# Miraki Art Gallery - Project Overview

## Project Description
Miraki Art Gallery is a modern e-commerce platform for art enthusiasts to discover, explore, and purchase artwork from talented artists across Mumbai. The platform provides a seamless experience for browsing artworks, managing favorites, and completing purchases. Currently, the frontend uses mock data but is designed to easily integrate with the backend API.

## Core Features

### 1. Art Discovery
   - Browse featured artworks on the homepage
   - Explore full artwork catalog with filtering and sorting options
   - View detailed artwork information including medium, dimensions, and location
   - Interactive map integration for artwork locations
   - View artist profiles and collections
   - Advanced search and filter capabilities by category, price range, location, etc.

### 2. User Features
   - Authentication system (login/register)
   - Personalized user profiles with preferences
   - Favorites management to save artworks for later
   - Purchase history and order tracking
   - Theme preference (light/dark mode)

### 3. E-commerce Features
   - Shopping cart with persistent state
   - Multi-step checkout process (cart, shipping, payment)
   - Multiple payment methods integration
   - Order confirmation and receipt generation
   - "Buy Now" direct purchase flow
   - Quantity controls for artworks

## Technical Architecture

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/              # Shadcn UI components (buttons, inputs, modals, etc.)
│   ├── artwork/         # Artwork-related components (cards, details, filters)
│   ├── auth/            # Authentication components (login, register forms)
│   ├── layout/          # Layout components (header, footer, navigation)
│   ├── cart/            # Shopping cart components
│   └── checkout/        # Checkout flow components
├── hooks/               # Custom React hooks
│   ├── useAuth.ts       # Authentication hook
│   ├── useCart.ts       # Cart management hook
│   ├── useArtworks.ts   # Artwork data hook
│   └── useTheme.ts      # Theme management hook
├── pages/               # Route pages
│   ├── HomePage.tsx     # Landing page
│   ├── Explore.tsx      # Artwork exploration page
│   ├── ArtworkDetail.tsx # Individual artwork page
│   ├── ArtistProfile.tsx # Artist profile page
│   ├── Cart.tsx         # Shopping cart page
│   ├── Checkout.tsx     # Checkout flow page
│   ├── Profile.tsx      # User profile page
│   └── Auth.tsx         # Authentication page
├── contexts/            # React context providers
│   ├── AuthContext.tsx  # Authentication context
│   ├── CartContext.tsx  # Cart management context
│   └── ThemeContext.tsx # Theme management context
├── types/               # TypeScript definitions
│   ├── artwork.ts       # Artwork-related types
│   ├── user.ts          # User-related types
│   └── cart.ts          # Cart-related types
├── utils/               # Utility functions
│   ├── api.ts           # API interaction functions
│   ├── formatting.ts    # Data formatting utilities
│   └── validation.ts    # Form validation utilities
└── data/                # Mock data and constants
    ├── artworks.ts      # Artwork data
    ├── artists.ts       # Artist data
    └── categories.ts    # Category data
```

### Key Components

1. **ArtworkCard.tsx**: Displays artwork information with purchase controls
   - Renders artwork image, title, artist, and price
   - Includes "Add to Cart" and "Buy Now" buttons
   - Shows "Sold" status for unavailable works
   - Features hover effects for enhanced UX

2. **Navigation.tsx**: Main navigation with cart and user menu
   - Responsive design with mobile hamburger menu
   - Theme toggle for light/dark mode
   - User authentication status display
   - Cart indicator with item count
   - Dynamic navigation links based on user role

3. **Checkout.tsx**: Multi-step checkout process
   - Cart review step
   - Shipping information form
   - Payment method selection
   - Order confirmation
   - Progress indicator showing current step

4. **Layout.tsx**: Common layout wrapper
   - Consistent header and footer
   - Container management for responsive design
   - Theme application
   - Navigation integration

5. **ArtworkFilters.tsx**: Controls for filtering the artwork catalog
   - Category selection
   - Price range slider
   - Location filters
   - Sort options (newest, price, popularity)

6. **ArtworkDetail.tsx**: Detailed view of a specific artwork
   - High-resolution image with zoom capability
   - Complete artwork information
   - Artist information with link to profile
   - Related artworks
   - Purchase options

### Data Flow

1. **Data Management**
   - Mock data stored in `src/data/` directory
   - Artwork and artist data linked through relationships (artist ID references)
   - Current implementation uses static data, but structure is prepared for API integration
   - Data objects include comprehensive metadata for artworks (dimensions, medium, location, etc.)

2. **State Management**
   - Authentication state in AuthContext (user info, login status, tokens)
   - Cart management in AuthContext (items, quantities, total price)
   - Theme preferences in ThemeContext (light/dark mode)
   - Filter states for artwork exploration
   - Form states for checkout process
   - UI states for loading indicators and error handling

3. **API Integration (Planned)**
   - Backend API documentation available in `miraki-backend/API_DOC.md`
   - Authentication endpoints for login/register
   - Artwork endpoints for browsing and details
   - Artist information endpoints
   - Cart and checkout endpoints
   - Admin-specific endpoints for content management

### Data Structures

#### Artwork Object
```typescript
interface Artwork {
  id: string;
  title: string;
  artist: string;
  description: string;
  category: string;
  image: string;
  featured: boolean;
  price?: number;
  forSale: boolean;
  location: {
    lat: number;
    lng: number;
    address: string;
    area: string;
  };
  createdAt: string;
  medium: string;
  dimensions: string;
  year: number;
  likes: number;
}
```

#### Artist Object
```typescript
interface Artist {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  location: string;
  specialization: string[];
  featured: boolean;
  contact: {
    email: string;
    phone?: string;
    website?: string;
  };
  social: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
  artworks: string[]; // IDs referencing artwork objects
}
```

#### User Object
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  favorites: string[]; // Artwork IDs
  purchaseHistory: PurchaseRecord[];
  addresses: Address[];
  preferences: UserPreferences;
}
```

#### Cart Item
```typescript
interface CartItem {
  id: string;
  title: string;
  artist: string;
  price: number;
  image: string;
  quantity: number;
}
```

#### Order
```typescript
interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  shippingAddress: Address;
  paymentMethod: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
  updatedAt: string;
}
```

### Pages

1. **HomePage**: Landing page featuring:
   - Hero section with featured artwork spotlight
   - Curated collection highlights
   - Featured artists section
   - Promotional banners for events or sales
   - Newsletter signup

2. **Explore**: Comprehensive artwork browsing experience:
   - Filtering and sorting controls
   - Grid/list view toggle
   - Paginated results
   - Quick view functionality
   - Map view option for location-based exploration

3. **ArtworkDetail**: Detailed view of individual artworks:
   - Image gallery with zoom functionality
   - Complete artwork information
   - Artist details with link to profile
   - Purchase options
   - Related works
   - Sharing functionality

4. **ArtistProfile**: Dedicated artist showcase:
   - Artist bio and photo
   - Portfolio of works
   - Contact information
   - Exhibition history
   - Artist statement

5. **Cart**: Shopping cart management:
   - Item listing with images and details
   - Quantity adjustment controls
   - Price subtotals and grand total
   - Removal functionality
   - Proceed to checkout button

6. **Checkout**: Multi-step purchase process:
   - Cart review
   - Shipping information
   - Payment details
   - Order confirmation

7. **Profile**: User account management:
   - Personal information
   - Order history
   - Saved addresses
   - Favorites gallery
   - Account settings

8. **Auth**: User authentication:
   - Login form
   - Registration form
   - Password recovery
   - Social authentication options

## Technologies Used

- **React + TypeScript**: Core frontend framework with type safety
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Shadcn UI Components**: Pre-built accessible UI components
- **React Router**: Client-side routing
- **React Query**: Data fetching and state management
- **Lucide Icons**: Modern icon library
- **Vite**: Build tool and development server

## State Management

### Authentication State
- User login status
- User profile information
- Authentication tokens
- Login/logout functionality

### Cart State
- Cart items array with quantities
- Add/remove/update cart item functions
- Cart total calculations
- Cart persistence across sessions

### UI State
- Theme mode (light/dark)
- Modal open/close states
- Loading indicators
- Error messages
- Filter selections
- Pagination state

## Backend Integration

The project is designed to integrate with a REST API backend (`miraki-backend`) that provides:

1. **Authentication Endpoints**:
   - Login, register, logout
   - Password reset

2. **Artwork Endpoints**:
   - List artworks with filtering/sorting
   - Get artwork details
   - Search functionality

3. **Artist Endpoints**:
   - List artists
   - Get artist details and portfolios

4. **User Endpoints**:
   - Profile management
   - Favorites management

5. **E-commerce Endpoints**:
   - Cart management
   - Checkout processing
   - Order management

6. **Admin Endpoints**:
   - Content management
   - User management
   - Dashboard metrics

## Future Enhancements

1. **Real Backend Integration**:
   - Replace mock data with API calls
   - Implement proper error handling
   - Add loading states for API requests

2. **Enhanced Search Capabilities**:
   - Full-text search across artwork descriptions
   - Advanced filtering options
   - Visual search capabilities

3. **Artist Dashboard**:
   - Artist-specific login area
   - Portfolio management
   - Sales tracking
   - Commission management

4. **Reviews and Ratings**:
   - User reviews for artworks
   - Rating system
   - Social proof elements

5. **Social Sharing Features**:
   - Share artworks on social platforms
   - Embedded social feeds
   - Community features

6. **Auction Functionality**:
   - Time-limited auctions
   - Bidding system
   - Auction notifications

7. **AR/VR Integration**:
   - View artwork in your space (AR)
   - Virtual gallery experiences
