# Miraki Artistry Hub - API Documentation

This document outlines the API endpoints and data structures for the Miraki Artistry Hub platform, a marketplace connecting artists with art enthusiasts in Mumbai.

## Table of Contents

1. [API Overview](#api-overview)
2. [Authentication Endpoints](#authentication-endpoints)
3. [Artwork Endpoints](#artwork-endpoints)
4. [Artist Endpoints](#artist-endpoints)
5. [User Endpoints](#user-endpoints)
6. [E-commerce Endpoints](#e-commerce-endpoints)
7. [Admin Endpoints](#admin-endpoints)
8. [Data Structures](#data-structures)

## API Overview

- Base URL: `https://api.miraki-art.com/v1`
- Authentication: JWT-based authentication using Bearer tokens
- Response Format: JSON
- Error Handling: Standard HTTP status codes with JSON error objects

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {} // Additional error details when available
  }
}
```

## Authentication Endpoints

### Register User

- **URL**: `/auth/register`
- **Method**: `POST`
- **Description**: Register a new user account
- **Request Body**:
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "securepassword",
  "confirmPassword": "securepassword"
}
```
- **Response**: 
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user123",
      "name": "User Name",
      "email": "user@example.com",
      "createdAt": "2023-09-15T10:30:00Z"
    },
    "token": "jwt-token-string"
  }
}
```

### Login

- **URL**: `/auth/login`
- **Method**: `POST`
- **Description**: Authenticate an existing user
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user123",
      "name": "User Name",
      "email": "user@example.com"
    },
    "token": "jwt-token-string"
  }
}
```

### Logout

- **URL**: `/auth/logout`
- **Method**: `POST`
- **Description**: Log out the current user
- **Authentication**: Required
- **Response**:
```json
{
  "success": true,
  "message": "Successfully logged out"
}
```

### Password Reset Request

- **URL**: `/auth/reset-password`
- **Method**: `POST`
- **Description**: Request a password reset link
- **Request Body**:
```json
{
  "email": "user@example.com"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Password reset link sent to email"
}
```

### Password Reset Confirmation

- **URL**: `/auth/reset-password/confirm`
- **Method**: `POST`
- **Description**: Complete the password reset process
- **Request Body**:
```json
{
  "token": "reset-token-from-email",
  "newPassword": "newsecurepassword",
  "confirmPassword": "newsecurepassword"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Password successfully changed"
}
```

## Artwork Endpoints

### List Artworks

- **URL**: `/artworks`
- **Method**: `GET`
- **Description**: Get a paginated list of artworks with optional filtering
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 20)
  - `category`: Filter by artwork category
  - `minPrice`: Minimum price
  - `maxPrice`: Maximum price
  - `location`: Filter by location area
  - `featured`: Filter featured artworks (true/false)
  - `forSale`: Filter artworks for sale (true/false)
  - `search`: Search term for title, artist, or description
  - `sortBy`: Sort field (default: 'createdAt')
  - `sortOrder`: Sort direction ('asc' or 'desc', default: 'desc')
- **Response**:
```json
{
  "success": true,
  "data": {
    "artworks": [
      {
        "id": "artwork123",
        "title": "Urban Serenity",
        "artist": "Eliza Chen",
        "year": 2023,
        "medium": "Oil on Canvas",
        "image": "https://storage.miraki-art.com/artworks/urban-serenity.jpg",
        "location": {
          "lat": 19.0760,
          "lng": 72.8777,
          "address": "Downtown Art District",
          "area": "Kala Ghoda"
        },
        "price": 750,
        "category": "Painting",
        "description": "A contemplative piece exploring the contrast between urban architecture and natural elements.",
        "likes": 124,
        "featured": true,
        "forSale": true
      }
    ],
    "pagination": {
      "total": 245,
      "page": 1,
      "limit": 20,
      "pages": 13
    }
  }
}
```

### Get Artwork Details

- **URL**: `/artworks/:id`
- **Method**: `GET`
- **Description**: Get detailed information about a specific artwork
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "artwork123",
    "title": "Urban Serenity",
    "artist": "Eliza Chen",
    "artistId": "artist456",
    "year": 2023,
    "medium": "Oil on Canvas",
    "dimensions": "36\" x 48\"",
    "image": "https://storage.miraki-art.com/artworks/urban-serenity.jpg",
    "additionalImages": [
      "https://storage.miraki-art.com/artworks/urban-serenity-detail1.jpg",
      "https://storage.miraki-art.com/artworks/urban-serenity-detail2.jpg"
    ],
    "location": {
      "lat": 19.0760,
      "lng": 72.8777,
      "address": "Downtown Art District",
      "area": "Kala Ghoda"
    },
    "price": 750,
    "category": "Painting",
    "description": "A contemplative piece exploring the contrast between urban architecture and natural elements. This painting invites viewers to find moments of calm within the chaos of city life.",
    "likes": 124,
    "featured": true,
    "forSale": true,
    "createdAt": "2023-02-15T14:22:10Z",
    "relatedArtworks": ["artwork789", "artwork101"]
  }
}
```

### Featured Artworks

- **URL**: `/artworks/featured`
- **Method**: `GET`
- **Description**: Get a list of featured artworks
- **Query Parameters**:
  - `limit`: Number of featured artworks to return (default: 6)
- **Response**:
```json
{
  "success": true,
  "data": {
    "artworks": [
      // Array of artwork objects as shown above
    ]
  }
}
```

### Toggle Artwork Like

- **URL**: `/artworks/:id/like`
- **Method**: `POST`
- **Description**: Toggle like status for an artwork
- **Authentication**: Required
- **Response**:
```json
{
  "success": true,
  "data": {
    "liked": true,
    "likesCount": 125
  }
}
```

### Artwork Categories

- **URL**: `/artworks/categories`
- **Method**: `GET`
- **Description**: Get a list of all artwork categories
- **Response**:
```json
{
  "success": true,
  "data": {
    "categories": [
      "Painting",
      "Sculpture",
      "Photography",
      "Digital",
      "Digital Art",
      "Mixed Media",
      "Ceramics",
      "Illustration",
      "Other"
    ]
  }
}
```

## Artist Endpoints

### List Artists

- **URL**: `/artists`
- **Method**: `GET`
- **Description**: Get a paginated list of artists with optional filtering
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 20)
  - `search`: Search term for artist name or bio
  - `location`: Filter by location area
  - `sortBy`: Sort field (default: 'popularity')
  - `sortOrder`: Sort direction ('asc' or 'desc', default: 'desc')
- **Response**:
```json
{
  "success": true,
  "data": {
    "artists": [
      {
        "id": "artist123",
        "name": "Eliza Chen",
        "bio": "Eliza is a contemporary painter whose work explores the intersection of nature and human emotion through vivid colors and bold strokes.",
        "profileImage": "https://storage.miraki-art.com/artists/eliza-chen.jpg",
        "location": {
          "lat": 19.0596,
          "lng": 72.8295,
          "address": "Bandra, Mumbai",
          "area": "Bandra"
        },
        "popularity": 4.8
      }
    ],
    "pagination": {
      "total": 65,
      "page": 1,
      "limit": 20,
      "pages": 4
    }
  }
}
```

### Get Artist Details

- **URL**: `/artists/:id`
- **Method**: `GET`
- **Description**: Get detailed information about a specific artist and their artworks
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "artist123",
    "name": "Eliza Chen",
    "bio": "Eliza is a contemporary painter whose work explores the intersection of nature and human emotion through vivid colors and bold strokes.",
    "profileImage": "https://storage.miraki-art.com/artists/eliza-chen.jpg",
    "location": {
      "lat": 19.0596,
      "lng": 72.8295,
      "address": "Bandra, Mumbai",
      "area": "Bandra"
    },
    "socialLinks": {
      "website": "https://example.com/elizachen",
      "instagram": "https://instagram.com/elizachenart",
      "twitter": null,
      "facebook": null
    },
    "popularity": 4.8,
    "artworks": [
      // Array of artwork objects by this artist
    ]
  }
}
```

### Featured Artists

- **URL**: `/artists/featured`
- **Method**: `GET`
- **Description**: Get a list of featured artists
- **Query Parameters**:
  - `limit`: Number of featured artists to return (default: 6)
- **Response**:
```json
{
  "success": true,
  "data": {
    "artists": [
      // Array of artist objects as shown above
    ]
  }
}
```

### Artists by Area

- **URL**: `/artists/by-area`
- **Method**: `GET`
- **Description**: Get a count of artists grouped by area
- **Response**:
```json
{
  "success": true,
  "data": {
    "areas": [
      {
        "name": "Bandra",
        "count": 12,
        "location": {
          "lat": 19.0596,
          "lng": 72.8295
        }
      },
      {
        "name": "Kala Ghoda",
        "count": 8,
        "location": {
          "lat": 18.9281,
          "lng": 72.8319
        }
      }
      // Additional areas
    ]
  }
}
```

## User Endpoints

### Get User Profile

- **URL**: `/users/me`
- **Method**: `GET`
- **Description**: Get the current user's profile
- **Authentication**: Required
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "user123",
    "name": "User Name",
    "email": "user@example.com",
    "profileImage": "https://storage.miraki-art.com/users/user123.jpg",
    "createdAt": "2023-01-15T10:30:00Z"
  }
}
```

### Update User Profile

- **URL**: `/users/me`
- **Method**: `PUT`
- **Description**: Update the current user's profile information
- **Authentication**: Required
- **Request Body**:
```json
{
  "name": "Updated Name",
  "profileImage": "base64-encoded-image-data"
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "user123",
    "name": "Updated Name",
    "email": "user@example.com",
    "profileImage": "https://storage.miraki-art.com/users/user123.jpg",
    "updatedAt": "2023-09-15T14:22:10Z"
  }
}
```

### Get User Favorites

- **URL**: `/users/me/favorites`
- **Method**: `GET`
- **Description**: Get the current user's favorite artworks
- **Authentication**: Required
- **Response**:
```json
{
  "success": true,
  "data": {
    "favorites": [
      // Array of artwork objects the user has favorited
    ],
    "count": 12
  }
}
```

### Add to Favorites

- **URL**: `/users/me/favorites/:artworkId`
- **Method**: `POST`
- **Description**: Add an artwork to user's favorites
- **Authentication**: Required
- **Response**:
```json
{
  "success": true,
  "message": "Artwork added to favorites"
}
```

### Remove from Favorites

- **URL**: `/users/me/favorites/:artworkId`
- **Method**: `DELETE`
- **Description**: Remove an artwork from user's favorites
- **Authentication**: Required
- **Response**:
```json
{
  "success": true,
  "message": "Artwork removed from favorites"
}
```

### User Addresses

- **URL**: `/users/me/addresses`
- **Method**: `GET`
- **Description**: Get the current user's saved addresses
- **Authentication**: Required
- **Response**:
```json
{
  "success": true,
  "data": {
    "addresses": [
      {
        "id": "addr123",
        "type": "home",
        "name": "Home Address",
        "line1": "123 Main St",
        "line2": "Apt 4B",
        "city": "Mumbai",
        "state": "Maharashtra",
        "postalCode": "400001",
        "country": "India",
        "phone": "+919876543210",
        "isDefault": true
      }
    ]
  }
}
```

### Add User Address

- **URL**: `/users/me/addresses`
- **Method**: `POST`
- **Description**: Add a new address for the user
- **Authentication**: Required
- **Request Body**:
```json
{
  "type": "office",
  "name": "Office Address",
  "line1": "456 Work Blvd",
  "line2": "Floor 3",
  "city": "Mumbai",
  "state": "Maharashtra",
  "postalCode": "400002",
  "country": "India",
  "phone": "+919876543211",
  "isDefault": false
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "addr124",
    "type": "office",
    "name": "Office Address",
    // Other address fields...
    "createdAt": "2023-09-15T15:30:00Z"
  }
}
```

### Update User Address

- **URL**: `/users/me/addresses/:addressId`
- **Method**: `PUT`
- **Authentication**: Required
- **Request Body**: Updated address fields
- **Response**: Updated address object

### Delete User Address

- **URL**: `/users/me/addresses/:addressId`
- **Method**: `DELETE`
- **Authentication**: Required
- **Response**: Success confirmation message

## E-commerce Endpoints

### Get Cart

- **URL**: `/cart`
- **Method**: `GET`
- **Description**: Get the current user's shopping cart
- **Authentication**: Required
- **Response**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "cartitem123",
        "artwork": {
          "id": "artwork123",
          "title": "Urban Serenity",
          "artist": "Eliza Chen",
          "image": "https://storage.miraki-art.com/artworks/urban-serenity.jpg",
          "price": 750
        },
        "quantity": 1,
        "addedAt": "2023-09-15T10:30:00Z"
      }
    ],
    "summary": {
      "subtotal": 750,
      "shipping": 50,
      "tax": 80,
      "total": 880
    }
  }
}
```

### Add to Cart

- **URL**: `/cart/items`
- **Method**: `POST`
- **Description**: Add an artwork to the shopping cart
- **Authentication**: Required
- **Request Body**:
```json
{
  "artworkId": "artwork123",
  "quantity": 1
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "item": {
      "id": "cartitem123",
      "artwork": {
        "id": "artwork123",
        "title": "Urban Serenity",
        "artist": "Eliza Chen",
        "image": "https://storage.miraki-art.com/artworks/urban-serenity.jpg",
        "price": 750
      },
      "quantity": 1,
      "addedAt": "2023-09-15T10:30:00Z"
    },
    "cart": {
      "summary": {
        "subtotal": 750,
        "shipping": 50,
        "tax": 80,
        "total": 880
      }
    }
  }
}
```

### Update Cart Item

- **URL**: `/cart/items/:itemId`
- **Method**: `PUT`
- **Description**: Update the quantity of a cart item
- **Authentication**: Required
- **Request Body**:
```json
{
  "quantity": 2
}
```
- **Response**: Updated cart with summary information

### Remove from Cart

- **URL**: `/cart/items/:itemId`
- **Method**: `DELETE`
- **Description**: Remove an item from the cart
- **Authentication**: Required
- **Response**: Updated cart with summary information

### Clear Cart

- **URL**: `/cart`
- **Method**: `DELETE`
- **Description**: Remove all items from the cart
- **Authentication**: Required
- **Response**: Empty cart confirmation

### Create Order

- **URL**: `/orders`
- **Method**: `POST`
- **Description**: Create a new order from cart items
- **Authentication**: Required
- **Request Body**:
```json
{
  "shippingAddressId": "addr123",
  "paymentMethod": "card",
  "paymentDetails": {
    "cardToken": "payment-gateway-token",
    "savePaymentMethod": false
  },
  "notes": "Please deliver on weekday mornings"
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "order123",
      "items": [
        {
          "artwork": {
            "id": "artwork123",
            "title": "Urban Serenity",
            "artist": "Eliza Chen",
            "image": "https://storage.miraki-art.com/artworks/urban-serenity.jpg"
          },
          "quantity": 1,
          "price": 750
        }
      ],
      "shippingAddress": {
        "id": "addr123",
        "name": "Home Address",
        // Address details...
      },
      "paymentMethod": "card",
      "status": "processing",
      "paymentStatus": "paid",
      "summary": {
        "subtotal": 750,
        "shipping": 50,
        "tax": 80,
        "total": 880
      },
      "createdAt": "2023-09-15T16:45:30Z"
    }
  }
}
```

### Get Order Details

- **URL**: `/orders/:id`
- **Method**: `GET`
- **Description**: Get details of a specific order
- **Authentication**: Required
- **Response**: Order object with details

### List User Orders

- **URL**: `/orders`
- **Method**: `GET`
- **Description**: Get a list of all orders placed by the user
- **Authentication**: Required
- **Query Parameters**:
  - `page`: Page number
  - `limit`: Items per page
  - `status`: Filter by order status
- **Response**: Paginated list of order objects

## Admin Endpoints

### Dashboard Statistics

- **URL**: `/admin/dashboard`
- **Method**: `GET`
- **Description**: Get statistics for the admin dashboard
- **Authentication**: Required (Admin role)
- **Response**:
```json
{
  "success": true,
  "data": {
    "totalSales": 12500,
    "totalOrders": 45,
    "totalArtworks": 340,
    "totalArtists": 28,
    "recentOrders": [
      // List of recent orders with basic information
    ],
    "salesByCategory": [
      {
        "category": "Painting",
        "sales": 6500,
        "count": 23
      },
      // Other categories
    ],
    "salesByMonth": [
      {
        "month": "Jan",
        "sales": 1200
      },
      // Other months
    ]
  }
}
```

### Artwork Management (CRUD)

- **List**: `GET /admin/artworks` - Paginated list with filters
- **Create**: `POST /admin/artworks` - Create new artwork
- **Get**: `GET /admin/artworks/:id` - Get artwork details
- **Update**: `PUT /admin/artworks/:id` - Update artwork
- **Delete**: `DELETE /admin/artworks/:id` - Delete artwork
- **Toggle Featured**: `PUT /admin/artworks/:id/toggle-featured` - Toggle featured status

#### Create Artwork (Example)

- **URL**: `/admin/artworks`
- **Method**: `POST`
- **Description**: Create a new artwork
- **Authentication**: Required (Admin role)
- **Request Body** (multipart/form-data):
```json
{
  "title": "New Artwork Title",
  "artistId": "artist123",
  "year": 2023,
  "medium": "Oil on Canvas",
  "dimensions": "30\" x 40\"",
  "price": 950,
  "category": "Painting",
  "description": "Detailed artwork description...",
  "location": {
    "lat": 19.0760,
    "lng": 72.8777,
    "address": "Gallery Address",
    "area": "Kala Ghoda"
  },
  "forSale": true,
  "featuredartwork": "primary-artwork-image.jpg", // Image file or URL
  "additionalImages": ["image1.jpg", "image2.jpg"] // Additional image files
}
```
- **Response**: Created artwork object

### Artist Management (CRUD)

- **List**: `GET /admin/artists` - Paginated list with filters
- **Create**: `POST /admin/artists` - Create new artist
- **Get**: `GET /admin/artists/:id` - Get artist details
- **Update**: `PUT /admin/artists/:id` - Update artist
- **Delete**: `DELETE /admin/artists/:id` - Delete artist

#### Create Artist (Example)

- **URL**: `/admin/artists`
- **Method**: `POST`
- **Description**: Create a new artist
- **Authentication**: Required (Admin role)
- **Request Body** (multipart/form-data):
```json
{
  "name": "New Artist Name",
  "bio": "Artist biography text...",
  "location": {
    "lat": 19.0596,
    "lng": 72.8295,
    "address": "Bandra, Mumbai",
    "area": "Bandra"
  },
  "socialLinks": {
    "website": "https://artistwebsite.com",
    "instagram": "https://instagram.com/artistname"
  },
  "profileImage": "artist-profile.jpg" // Image file
}
```
- **Response**: Created artist object

### Order Management

- **List**: `GET /admin/orders` - Paginated list with filters
- **Get**: `GET /admin/orders/:id` - Get order details
- **Update Status**: `PUT /admin/orders/:id/status` - Update order status
- **Update Payment Status**: `PUT /admin/orders/:id/payment` - Update payment status
- **Delete**: `DELETE /admin/orders/:id` - Delete order (soft delete)

### User Management

- **List**: `GET /admin/users` - Paginated list with filters
- **Get**: `GET /admin/users/:id` - Get user details
- **Update**: `PUT /admin/users/:id` - Update user information
- **Delete**: `DELETE /admin/users/:id` - Delete user (soft delete)
- **Reset Password**: `POST /admin/users/:id/reset-password` - Force password reset

### Content Management

- **Banners**: `GET/POST/PUT/DELETE /admin/content/banners` - Manage homepage banners
- **Featured Collections**: `GET/POST/PUT/DELETE /admin/content/collections` - Manage curated collections
- **Site Settings**: `GET/PUT /admin/content/settings` - Manage site settings
- **Navigation Links**: `GET/POST/PUT/DELETE /admin/content/navigation` - Manage navigation items

### Bulk Operations

- **Bulk Delete Artworks**: `DELETE /admin/artworks/bulk` - Delete multiple artworks
- **Bulk Update Featured**: `PUT /admin/artworks/bulk/featured` - Update featured status for multiple artworks
- **Bulk Import Artworks**: `POST /admin/artworks/import` - Import artworks from CSV/Excel

## Data Structures

### Artwork

```typescript
interface Artwork {
  id: string;
  title: string;
  artist: string;  // Artist's name
  artistId: string;  // Reference to Artist object
  year: number;
  medium: string;
  image: string;  // Main image URL
  additionalImages?: string[];  // Additional image URLs
  location: {
    lat: number;
    lng: number;
    address: string;
    area?: string;
  };
  price?: number;
  category: ArtworkCategory;
  description: string;
  likes: number;
  featured?: boolean;
  forSale?: boolean;
  createdAt?: string;
  dimensions?: string;
}

type ArtworkCategory = 
  | "All" 
  | "Painting" 
  | "Sculpture" 
  | "Photography" 
  | "Digital" 
  | "Digital Art"
  | "Mixed Media" 
  | "Ceramics" 
  | "Illustration" 
  | "Other";
```

### Artist

```typescript
interface Artist {
  id: string;
  name: string;
  bio?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
    area?: string;
  };
  profileImage?: string;
  socialLinks?: {
    website?: string;
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
  popularity?: number;
  artworks?: Artwork[];
}
```

### User

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  role: "user" | "admin" | "artist";
  createdAt: string;
  lastLogin?: string;
  favorites?: string[];  // Array of artwork IDs
  addresses?: Address[];
}

interface Address {
  id: string;
  type: "home" | "office" | "other";
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}
```

### Cart & Orders

```typescript
interface CartItem {
  id: string;
  artworkId: string;
  artwork: {
    id: string;
    title: string;
    artist: string;
    image: string;
    price: number;
  };
  quantity: number;
  addedAt: string;
}

interface Cart {
  userId: string;
  items: CartItem[];
  summary: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
}

interface Order {
  id: string;
  userId: string;
  items: {
    artwork: {
      id: string;
      title: string;
      artist: string;
      image: string;
    };
    quantity: number;
    price: number;
  }[];
  shippingAddress: Address;
  paymentMethod: "card" | "netbanking" | "upi" | "cod";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  trackingInfo?: {
    carrier: string;
    trackingNumber: string;
    trackingUrl?: string;
  };
  summary: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Admin Content

```typescript
interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  active: boolean;
  priority: number;  // For ordering
  startDate?: string;  // For scheduled banners
  endDate?: string;
  createdAt: string;
}

interface Collection {
  id: string;
  title: string;
  description?: string;
  coverImage: string;
  artworks: string[];  // Array of artwork IDs
  featured: boolean;
  priority: number;
  createdAt: string;
}

interface SiteSettings {
  siteName: string;
  logo: string;
  contactEmail: string;
  contactPhone?: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  footerText: string;
  metaDescription: string;
  termsUrl?: string;
  privacyUrl?: string;
  shippingInfo?: string;
  returnPolicy?: string;
}
```

## File Upload Endpoints

### Upload Artwork Image

- **URL**: `/admin/upload/artwork`
- **Method**: `POST`
- **Description**: Upload an artwork image
- **Authentication**: Required (Admin role)
- **Request Body** (multipart/form-data):
  - `image`: Image file (JPEG/PNG/WebP)
  - `artworkId`: Optional artwork ID to associate with
- **Response**:
```json
{
  "success": true,
  "data": {
    "url": "https://storage.miraki-art.com/artworks/filename.jpg",
    "key": "artworks/filename.jpg"
  }
}
```

### Upload Artist Image

- **URL**: `/admin/upload/artist`
- **Method**: `POST`
- **Description**: Upload an artist profile image
- **Authentication**: Required (Admin role)
- **Request Body** (multipart/form-data):
  - `image`: Image file
  - `artistId`: Optional artist ID to associate with
- **Response**: URL and key of uploaded image

### Upload Banner Image

- **URL**: `/admin/upload/banner`
- **Method**: `POST`
- **Description**: Upload a banner image
- **Authentication**: Required (Admin role)
- **Request Body** (multipart/form-data):
  - `image`: Image file
- **Response**: URL and key of uploaded image

## Rate Limiting

API rate limiting is implemented to prevent abuse:

- Unauthenticated requests: 60 requests per minute
- Authenticated user requests: 120 requests per minute
- Admin requests: 300 requests per minute

Rate limit headers are included in API responses:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 58
X-RateLimit-Reset: 1631234567
```

## Error Codes

Common error codes returned by the API:

- `AUTH_REQUIRED`: Authentication required
- `INVALID_CREDENTIALS`: Invalid login credentials
- `ACCESS_DENIED`: User doesn't have permission
- `RESOURCE_NOT_FOUND`: Requested resource not found
- `VALIDATION_ERROR`: Invalid input data
- `DUPLICATE_ENTRY`: Resource already exists
- `PAYMENT_FAILED`: Payment processing failed
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Internal server error

## Versioning

The API version is included in the URL path (e.g., `/v1/artworks`). When breaking changes are introduced, a new API version will be released (e.g., `/v2/artworks`) while maintaining the previous version for backward compatibility.
