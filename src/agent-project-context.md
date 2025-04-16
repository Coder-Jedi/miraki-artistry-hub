
# Miraki Art Gallery - Project Overview

## Project Description
Miraki Art Gallery is a modern e-commerce platform for art enthusiasts to discover, explore, and purchase artwork from talented artists across Mumbai. The platform provides a seamless experience for browsing artworks, managing favorites, and completing purchases.

## Core Features
1. Art Discovery
   - Browse featured artworks
   - Explore full artwork catalog
   - View artist profiles and collections
   - Search and filter capabilities

2. User Features
   - Authentication (login/register)
   - User profiles
   - Favorites management
   - Purchase history

3. E-commerce
   - Shopping cart
   - Checkout process
   - Multiple payment methods
   - Order confirmation

## Technical Architecture

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn UI components
│   └── [feature]/      # Feature-specific components
├── hooks/              # Custom React hooks
├── pages/             # Route pages
├── types/             # TypeScript definitions
├── utils/             # Utility functions
└── data/              # Mock data and constants
```

### Key Components
1. `ArtworkCard.tsx`: Displays artwork information with purchase controls
2. `Navigation.tsx`: Main navigation with cart and user menu
3. `Checkout.tsx`: Multi-step checkout process
4. `Layout.tsx`: Common layout wrapper

### Data Flow
1. Data Management
   - Mock data stored in `src/data/`
   - Artwork and artist data linked through relationships
   - Cart state managed in AuthContext

2. State Management
   - Authentication state in AuthContext
   - Cart management in AuthContext
   - Theme preferences in ThemeContext

### Data Structures

#### Artwork Object
```typescript
interface Artwork {
  id: string;
  title: string;
  artist: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  forSale: boolean;
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
  artworks: Artwork[];
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

## Technologies Used
- React + TypeScript
- Tailwind CSS
- Shadcn UI Components
- React Router
- React Query
- Lucide Icons

## Future Enhancements
1. Real backend integration
2. Enhanced search capabilities
3. Artist dashboard
4. Reviews and ratings
5. Social sharing features
