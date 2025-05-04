# Miraki Artistry Hub - E-commerce and Administrative API Documentation

This document outlines the e-commerce and administrative API endpoints for the Miraki Artistry Hub platform, a marketplace connecting artists with art enthusiasts in Mumbai.

## Table of Contents

1. [API Overview](#api-overview)
2. [Authentication Endpoints](#authentication-endpoints)
3. [Artwork Endpoints](#artwork-endpoints)
4. [Artist Endpoints](#artist-endpoints)
5. [User Endpoints](#user-endpoints)
6. [E-commerce Endpoints](#e-commerce-endpoints)
7. [Admin Endpoints](#admin-endpoints)
8. [Data Structures](#data-structures)
9. [File Upload Endpoints](#file-upload-endpoints)
10. [Rate Limiting](#rate-limiting)
11. [Error Codes](#error-codes)
12. [Versioning](#versioning)

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
    "items": [
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
  - `featured`: Filter featured artists (true/false)
  - `sortBy`: Sort field (default: 'popularity')
  - `sortOrder`: Sort direction ('asc' or 'desc', default: 'desc')
- **Response**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "artist123",
        "name": "Eliza Chen",
        "bio": "Eliza is a contemporary painter whose work explores the intersection of nature and human emotion through vivid colors and bold strokes.",
        "profileImage": "https://storage.miraki-art.com/artists/eliza-chen.jpg",
        "location": {
          "lat": 19.0596,
          "lng": 72.8295,
          "area": "Bandra"
        },
        "popularity": 4.8,
        "featured": true
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
      "area": "Bandra"
    },
    "socialLinks": {
      "website": "https://example.com/elizachen",
      "instagram": "https://instagram.com/elizachenart",
      "twitter": null,
      "facebook": null
    },
    "popularity": 4.8,
    "featured": true,
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
          "medium": "Oil on Canvas",
          "dimensions": "36\" x 48\""
        },
        "price": 750,
        "quantity": 1,
        "subtotal": 750,
        "addedAt": "2023-09-15T10:30:00Z"
      }
    ],
    "summary": {
      "subtotal": 750,
      "shipping": 100,
      "tax": 30,
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
        "title": "Urban Serenity"
      },
      "quantity": 1,
      "price": 750,
      "subtotal": 750,
      "addedAt": "2023-09-15T10:30:00Z"
    },
    "cart": {
      "summary": {
        "subtotal": 750,
        "shipping": 100,
        "tax": 30,
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
      "status": "pending",
      "total": 880,
      "items": [
        {
          "artwork": {
            "id": "artwork123",
            "title": "Urban Serenity"
          },
          "quantity": 1,
          "price": 750
        }
      ],
      "shippingAddress": {
        "name": "Home Address",
        "line1": "123 Main St",
        "city": "Mumbai"
      },
      "paymentMethod": "card",
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
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "order123",
    "status": "processing",
    "items": [
      {
        "artwork": {
          "id": "artwork123",
          "title": "Urban Serenity",
          "artist": "Eliza Chen",
          "image": "https://storage.miraki-art.com/artworks/urban-serenity.jpg"
        },
        "quantity": 1,
        "price": 750,
        "subtotal": 750
      }
    ],
    "summary": {
      "subtotal": 750,
      "shipping": 100,
      "tax": 30,
      "total": 880
    },
    "shippingAddress": {
      "name": "Home Address",
      "line1": "123 Main St",
      "line2": "Apt 4B",
      "city": "Mumbai",
      "state": "Maharashtra",
      "postalCode": "400001",
      "country": "India",
      "phone": "+919876543210"
    },
    "paymentMethod": "card",
    "paymentDetails": {
      "cardLast4": "4242",
      "cardBrand": "Visa"
    },
    "timeline": [
      {
        "status": "pending",
        "timestamp": "2023-09-15T16:45:30Z",
        "note": "Order placed"
      },
      {
        "status": "processing",
        "timestamp": "2023-09-15T17:05:12Z",
        "note": "Payment confirmed"
      }
    ],
    "notes": "Please deliver on weekday mornings",
    "createdAt": "2023-09-15T16:45:30Z",
    "updatedAt": "2023-09-15T17:05:12Z"
  }
}
```

### List User Orders

- **URL**: `/orders`
- **Method**: `GET`
- **Description**: Get a list of all orders placed by the user
- **Authentication**: Required
- **Query Parameters**:
  - `page`: Page number
  - `limit`: Items per page
  - `status`: Filter by order status
- **Response**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "order123",
        "status": "processing",
        "total": 880,
        "items": [
          {
            "artwork": {
              "title": "Urban Serenity"
            },
            "quantity": 1
          }
        ],
        "createdAt": "2023-09-15T16:45:30Z"
      },
      {
        "id": "order122",
        "status": "delivered",
        "total": 1200,
        "items": [
          {
            "artwork": {
              "title": "Moonlit Waves"
            },
            "quantity": 1
          }
        ],
        "createdAt": "2023-08-22T13:10:05Z"
      }
    ],
    "pagination": {
      "total": 5,
      "pages": 1
    }
  }
}
```

### Order Status Webhook

- **URL**: `/orders/webhook`
- **Method**: `POST`
- **Description**: Receive order status updates from payment provider
- **Authentication**: API key (in header)
- **Request Body**: Webhook payload from payment processor
- **Response**: Acknowledgement of receipt

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
      {
        "id": "order123",
        "customer": "User Name",
        "total": 880,
        "status": "processing",
        "createdAt": "2023-09-15T16:45:30Z"
      }
    ],
    "salesByCategory": [
      {
        "category": "Painting",
        "amount": 8700
      },
      {
        "category": "Photography",
        "amount": 2300
      }
      // Other categories
    ],
    "salesByMonth": [
      {
        "month": "Jan 2023",
        "amount": 1200
      },
      {
        "month": "Feb 2023",
        "amount": 1800
      }
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
    "area": "Kala Ghoda"
  },
  "forSale": true,
  "featuredImage": "primary-artwork-image.jpg", // Image file or URL
  "additionalImages": ["image1.jpg", "image2.jpg"] // Additional image files
}
```
- **Response**: 
```json
{
  "success": true,
  "data": {
    "id": "artwork789",
    "title": "New Artwork Title",
    "artist": "Artist Name",
    "artistId": "artist123",
    "year": 2023,
    "medium": "Oil on Canvas",
    "dimensions": "30\" x 40\"",
    "image": "https://storage.miraki-art.com/artworks/new-artwork-title.jpg",
    "additionalImages": [
      "https://storage.miraki-art.com/artworks/image1.jpg",
      "https://storage.miraki-art.com/artworks/image2.jpg"
    ],
    "location": {
      "lat": 19.0760,
      "lng": 72.8777,
      "area": "Kala Ghoda"
    },
    "price": 950,
    "category": "Painting",
    "description": "Detailed artwork description...",
    "likes": 0,
    "featured": false,
    "forSale": true,
    "createdAt": "2025-04-28T10:30:00Z",
    "updatedAt": "2025-04-28T10:30:00Z"
  }
}
```

### Artist Management (CRUD)

- **List**: `GET /admin/artists` - Paginated list with filters
- **Create**: `POST /admin/artists` - Create new artist
- **Get**: `GET /admin/artists/:id` - Get artist details
- **Update**: `PUT /admin/artists/:id` - Update artist
- **Delete**: `DELETE /admin/artists/:id` - Delete artist

#### Create Artist

- **URL**: `/admin/artists`
- **Method**: `POST`
- **Description**: Create a new artist profile
- **Authentication**: Required (Admin role)
- **Request Body** (multipart/form-data):
```json
{
  "name": "New Artist Name",
  "bio": "Artist biography text...",
  "location": {
    "lat": 19.0596,
    "lng": 72.8295,
    "area": "Bandra"
  },
  "profileImage": "[file]", // Image file upload
  "socialLinks": {
    "website": "https://artistwebsite.com",
    "instagram": "https://instagram.com/artistname",
    "twitter": "https://twitter.com/artistname",
    "facebook": "https://facebook.com/artistname"
  },
  "popularity": 0, // Optional: Value between 0-5, defaults to 0
  "featured": false // Optional: defaults to false
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "artist123",
    "name": "New Artist Name",
    "bio": "Artist biography text...",
    "profileImage": "https://storage.miraki-art.com/artists/artist-profile.jpg",
    "location": {
      "lat": 19.0596,
      "lng": 72.8295,
      "area": "Bandra"
    },
    "socialLinks": {
      "website": "https://artistwebsite.com",
      "instagram": "https://instagram.com/artistname",
      "twitter": "https://twitter.com/artistname",
      "facebook": "https://facebook.com/artistname"
    },
    "popularity": 0,
    "featured": false,
    "createdAt": "2025-04-28T10:30:00Z",
    "updatedAt": "2025-04-28T10:30:00Z"
  }
}
```

#### Update Artist

- **URL**: `/admin/artists/:id`
- **Method**: `PUT`
- **Description**: Update an existing artist profile
- **Authentication**: Required (Admin role)
- **Request Body** (multipart/form-data):
```json
{
  "name": "Updated Artist Name",
  "bio": "Updated artist biography...",
  "location": {
    "lat": 19.0742,
    "lng": 72.8858,
    "area": "Kala Ghoda"
  },
  "socialLinks": {
    "website": "https://updatedwebsite.com",
    "instagram": "https://instagram.com/updatedname"
  },
  "profileImage": "[file]" // Optional: new image file upload
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "artist123",
    "name": "Updated Artist Name",
    "bio": "Updated artist biography...",
    "profileImage": "https://storage.miraki-art.com/artists/updated-profile.jpg",
    "location": {
      "lat": 19.0742,
      "lng": 72.8858,
      "area": "Kala Ghoda"
    },
    "socialLinks": {
      "website": "https://updatedwebsite.com",
      "instagram": "https://instagram.com/updatedname",
      "twitter": null,
      "facebook": null
    },
    "popularity": 42,
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-04-28T14:22:10Z"
  }
}
```

#### Get Artist Details (Admin)

- **URL**: `/admin/artists/:id`
- **Method**: `GET`
- **Description**: Get detailed information about a specific artist (admin version with additional fields)
- **Authentication**: Required (Admin role)
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "artist123",
    "name": "Artist Name",
    "bio": "Artist biography...",
    "profileImage": "https://storage.miraki-art.com/artists/artist-profile.jpg",
    "location": {
      "lat": 19.0596,
      "lng": 72.8295,
      "area": "Bandra"
    },
    "socialLinks": {
      "website": "https://artistwebsite.com",
      "instagram": "https://instagram.com/artistname",
      "twitter": "https://twitter.com/artistname",
      "facebook": "https://facebook.com/artistname"
    },
    "popularity": 42,
    "artworks": [
      {
        "id": "artwork123",
        "title": "Urban Serenity",
        "image": "https://storage.miraki-art.com/artworks/urban-serenity.jpg",
        "price": 750,
        "forSale": true,
        "featured": true,
        "likes": 124,
        "createdAt": "2023-02-15T14:22:10Z"
      }
    ],
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-04-20T16:45:12Z",
    "stats": {
      "totalArtworks": 12,
      "totalSales": 8,
      "averageRating": 4.8,
      "totalRevenue": 8500
    }
  }
}
```

#### Delete Artist

- **URL**: `/admin/artists/:id`
- **Method**: `DELETE`
- **Description**: Delete an artist profile (this will not delete associated artworks)
- **Authentication**: Required (Admin role)
- **Response**:
```json
{
  "success": true,
  "message": "Artist successfully deleted"
}
```

### Order Management (Admin)

- **List**: `GET /admin/orders` - Paginated list with filters
- **Get**: `GET /admin/orders/:id` - Get order details
- **Update**: `PUT /admin/orders/:id` - Update order status
- **Delete**: `DELETE /admin/orders/:id` - Cancel/refund order

#### Update Order (Example)

- **URL**: `/admin/orders/:id`
- **Method**: `PUT`
- **Description**: Update an order's status
- **Authentication**: Required (Admin role)
- **Request Body**:
```json
{
  "status": "shipped",
  "trackingInfo": {
    "carrier": "FedEx",
    "trackingNumber": "123456789012",
    "expectedDelivery": "2023-09-20"
  },
  "notifyCustomer": true,
  "notes": "Shipped with additional protective packaging"
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "order123",
    "status": "shipped",
    "trackingInfo": {
      "carrier": "FedEx",
      "trackingNumber": "123456789012",
      "expectedDelivery": "2023-09-20"
    },
    "timeline": [
      {
        "status": "pending",
        "timestamp": "2023-09-15T16:45:30Z",
        "note": "Order placed"
      },
      {
        "status": "processing",
        "timestamp": "2023-09-15T17:05:12Z",
        "note": "Payment confirmed"
      },
      {
        "status": "shipped",
        "timestamp": "2023-09-17T11:20:45Z",
        "note": "Shipped with additional protective packaging"
      }
    ],
    "updatedAt": "2023-09-17T11:20:45Z"
  }
}
```

### User Management (Admin)

- **List**: `GET /admin/users` - Paginated list with filters
- **Get**: `GET /admin/users/:id` - Get user details
- **Update**: `PUT /admin/users/:id` - Update user roles/permissions
- **Delete**: `DELETE /admin/users/:id` - Deactivate/delete user

#### Update User Roles (Example)

- **URL**: `/admin/users/:id/roles`
- **Method**: `PUT`
- **Description**: Update a user's roles
- **Authentication**: Required (Admin role)
- **Request Body**:
```json
{
  "roles": ["user", "artist"]
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "user123",
    "email": "user@example.com",
    "roles": ["user", "artist"],
    "updatedAt": "2025-04-28T14:22:10Z"
  }
}
```

## Data Structures

### User

```json
{
  "id": "user123",
  "name": "User Name",
  "email": "user@example.com",
  "profileImage": "https://storage.miraki-art.com/users/user123.jpg",
  "roles": ["user"],
  "createdAt": "2023-01-15T10:30:00Z",
  "updatedAt": "2023-09-15T14:22:10Z"
}
```

### Artist

```json
{
  "id": "artist123",
  "name": "Artist Name",
  "bio": "Artist biography...",
  "profileImage": "https://storage.miraki-art.com/artists/artist-profile.jpg",
  "location": {
    "lat": 19.0596,
    "lng": 72.8295,
    "area": "Bandra"
  },
  "socialLinks": {
    "website": "https://storage.miraki-art.com/artists/artist-profile.jpg",
    "instagram": "https://storage.miraki-art.com/artists/artist-profile.jpg",
    "twitter": "https://storage.miraki-art.com/artists/artist-profile.jpg",
    "facebook": "https://storage.miraki-art.com/artists/artist-profile.jpg"
  },
  "popularity": 42,
  "featured": true,
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-04-20T16:45:12Z"
}
```

### Artwork

```json
{
  "id": "artwork123",
  "title": "Urban Serenity",
  "artist": "Artist Name",
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
    "area": "Kala Ghoda"
  },
  "price": 750,
  "category": "Painting",
  "description": "A contemplative piece exploring the contrast between urban architecture and natural elements. This painting invites viewers to find moments of calm within the chaos of city life.",
  "likes": 124,
  "featured": true,
  "forSale": true,
  "createdAt": "2023-02-15T14:22:10Z",
  "updatedAt": "2023-02-15T14:22:10Z"
}
```

### Order

```json
{
  "id": "order123",
  "customer": {
    "id": "user123",
    "name": "User Name",
    "email": "user@example.com"
  },
  "status": "processing",
  "items": [
    {
      "artwork": {
        "id": "artwork123",
        "title": "Urban Serenity",
        "artist": "Artist Name",
        "image": "https://storage.miraki-art.com/artworks/urban-serenity.jpg"
      },
      "quantity": 1,
      "price": 750,
      "subtotal": 750
    }
  ],
  "summary": {
    "subtotal": 750,
    "shipping": 100,
    "tax": 30,
    "total": 880
  },
  "shippingAddress": {
    "name": "Home Address",
    "line1": "123 Main St",
    "line2": "Apt 4B",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400001",
    "country": "India",
    "phone": "+919876543210"
  },
  "paymentMethod": "card",
  "paymentDetails": {
    "cardLast4": "4242",
    "cardBrand": "Visa",
    "paymentId": "pi_123456789"
  },
  "timeline": [
    {
      "status": "pending",
      "timestamp": "2023-09-15T16:45:30Z",
      "note": "Order placed"
    },
    {
      "status": "processing",
      "timestamp": "2023-09-15T17:05:12Z",
      "note": "Payment confirmed"
    }
  ],
  "trackingInfo": null,
  "notes": "Please deliver on weekday mornings",
  "createdAt": "2023-09-15T16:45:30Z",
  "updatedAt": "2023-09-15T17:05:12Z"
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

Current API version: v1
Deprecation policy: Previous API versions will be maintained for at least 6 months after a new version is released, with deprecation notices provided at least 3 months in advance.