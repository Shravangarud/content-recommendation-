# 📚 SmartContent API Documentation

Complete API reference for SmartContent recommendation system.

**Base URL:** `http://localhost:5000/api`

---

## 🔐 Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

### POST /auth/signup
Register a new user account.

**Request Body:**
```json
{
  "username": "string (min: 3)",
  "email": "string (valid email)",
  "password": "string (min: 6)"
}
```

**Response:** `201 Created`
```json
{
  "token": "jwt_token_string",
  "user": {
    "id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Errors:**
- `400` - Validation error or user already exists
- `500` - Server error

---

### POST /auth/login
Authenticate existing user.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:** `200 OK`
```json
{
  "token": "jwt_token_string",
  "user": {
    "id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Errors:**
- `400` - Invalid credentials
- `500` - Server error

---

## 👤 Users

### GET /users/profile
Get current user's profile. **[Protected]**

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "_id": "user_id",
  "username": "john_doe",
  "email": "john@example.com",
  "role": "user",
  "profile": {
    "name": "John Doe",
    "bio": "Tech enthusiast",
    "avatar": "https://example.com/avatar.jpg"
  },
  "preferences": {
    "categories": ["Technology", "Science"],
    "tags": ["AI", "Machine Learning"]
  },
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### PUT /users/profile
Update user profile. **[Protected]**

**Request Body:**
```json
{
  "name": "string (optional)",
  "bio": "string (optional)",
  "avatar": "string (optional, url)"
}
```

**Response:** `200 OK`
```json
{
  "_id": "user_id",
  "profile": {
    "name": "Updated Name",
    "bio": "Updated bio",
    "avatar": "new_avatar_url"
  }
}
```

---

### PUT /users/preferences
Update user preferences. **[Protected]**

**Request Body:**
```json
{
  "categories": ["Technology", "Science", "Business"],
  "tags": ["AI", "Web Dev", "Startups"]
}
```

**Response:** `200 OK`
```json
{
  "preferences": {
    "categories": ["Technology", "Science", "Business"],
    "tags": ["AI", "Web Dev", "Startups"]
  }
}
```

---

## 📝 Content

### GET /content
Get all content with pagination and filters.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 12)
- `type` (string: "article" | "video" | "product")
- `category` (string)
- `search` (string)

**Example:**
```
GET /content?page=1&limit=10&type=article&category=Technology
```

**Response:** `200 OK`
```json
{
  "content": [
    {
      "_id": "content_id",
      "title": "Introduction to AI",
      "description": "Learn AI fundamentals...",
      "type": "article",
      "category": "Technology",
      "tags": ["AI", "Machine Learning"],
      "author": "Jane Smith",
      "imageUrl": "https://example.com/image.jpg",
      "url": "https://example.com/article",
      "price": 0,
      "stats": {
        "views": 1500,
        "likes": 230,
        "averageRating": 4.5,
        "totalRatings": 42
      },
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "totalPages": 5,
  "currentPage": 1,
  "total": 50
}
```

---

### GET /content/:id
Get specific content by ID.

**Response:** `200 OK`
```json
{
  "_id": "content_id",
  "title": "Content Title",
  "description": "Description...",
  "type": "article",
  "category": "Technology",
  "tags": ["tag1", "tag2"],
  "author": "Author Name",
  "imageUrl": "url",
  "stats": { ... },
  "metadata": {
    "duration": "10 min read",
    "source": "Source",
    "publishedDate": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errors:**
- `404` - Content not found

---

### POST /content
Create new content. **[Protected, Admin Only]**

**Request Body:**
```json
{
  "title": "string (required)",
  "description": "string (required)",
  "type": "article | video | product (required)",
  "category": "string (required)",
  "tags": ["string"],
  "author": "string",
  "imageUrl": "string (url)",
  "url": "string (url)",
  "price": 0,
  "metadata": {
    "duration": "string",
    "source": "string",
    "publishedDate": "date"
  }
}
```

**Response:** `201 Created`
```json
{
  "_id": "new_content_id",
  "title": "New Content",
  ...
}
```

**Errors:**
- `401` - Not authenticated
- `403` - Not admin
- `500` - Server error

---

### PUT /content/:id
Update existing content. **[Protected, Admin Only]**

**Request Body:** Same as POST /content

**Response:** `200 OK`

---

### DELETE /content/:id
Delete content. **[Protected, Admin Only]**

**Response:** `200 OK`
```json
{
  "message": "Content deleted successfully"
}
```

---

## 💫 Interactions

### POST /interactions/view
Track content view. **[Protected]**

**Request Body:**
```json
{
  "contentId": "content_id"
}
```

**Response:** `201 Created`
```json
{
  "message": "View tracked"
}
```

---

### POST /interactions/like
Like or unlike content. **[Protected]**

**Request Body:**
```json
{
  "contentId": "content_id"
}
```

**Response:** `200 OK` or `201 Created`
```json
{
  "message": "Liked",
  "liked": true
}
```
OR
```json
{
  "message": "Unliked",
  "liked": false
}
```

---

### POST /interactions/rating
Rate content (1-5 stars). **[Protected]**

**Request Body:**
```json
{
  "contentId": "content_id",
  "rating": 5
}
```

**Response:** `201 Created`
```json
{
  "message": "Rating saved",
  "averageRating": 4.5
}
```

**Errors:**
- `400` - Rating must be between 1 and 5

---

### GET /interactions/user/:userId
Get user's interactions. **[Protected]**

**Response:** `200 OK`
```json
[
  {
    "_id": "interaction_id",
    "userId": "user_id",
    "contentId": {
      "_id": "content_id",
      "title": "Content Title",
      ...
    },
    "type": "like",
    "rating": null,
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
]
```

---

## 🎯 Recommendations

### GET /recommendations/personalized
Get personalized recommendations for logged-in user. **[Protected]**

**Response:** `200 OK`
```json
[
  {
    "_id": "content_id",
    "title": "Recommended Content",
    "description": "...",
    ...
  }
]
```

**Fallback:** Returns popular content if ML API fails.

---

### GET /recommendations/similar/:contentId
Get content similar to specified item.

**Response:** `200 OK`
```json
[
  {
    "_id": "similar_content_id",
    "title": "Similar Content",
    ...
  }
]
```

---

### GET /recommendations/trending
Get trending content based on recent interactions.

**Query Parameters:**
- `limit` (number, default: 10)

**Response:** `200 OK`
```json
[
  {
    "_id": "content_id",
    "title": "Trending Content",
    ...
  }
]
```

---

## 📊 Analytics

### GET /analytics/overview
Get analytics overview. **[Protected, Admin Only]**

**Response:** `200 OK`
```json
{
  "totalContent": 120,
  "totalUsers": 450,
  "totalInteractions": 3200,
  "totalViews": 12500,
  "totalLikes": 2300
}
```

---

### GET /analytics/most-viewed
Get most viewed content.

**Query Parameters:**
- `limit` (number, default: 10)

**Response:** `200 OK`
```json
[
  {
    "_id": "content_id",
    "title": "Most Viewed Content",
    "stats": {
      "views": 5000
    },
    ...
  }
]
```

---

### GET /analytics/most-liked
Get most liked content.

**Query Parameters:**
- `limit` (number, default: 10)

**Response:** Same structure as most-viewed

---

### GET /analytics/top-rated
Get top rated content (min 5 ratings).

**Query Parameters:**
- `limit` (number, default: 10)

**Response:** Same structure as most-viewed

---

### GET /analytics/category-stats
Get statistics grouped by category. **[Protected, Admin Only]**

**Response:** `200 OK`
```json
[
  {
    "_id": "Technology",
    "count": 45,
    "totalViews": 8900,
    "totalLikes": 1200
  },
  {
    "_id": "Science",
    "count": 32,
    "totalViews": 5600,
    "totalLikes": 890
  }
]
```

---

## 🤖 ML API Endpoints

**Base URL:** `http://localhost:5001`

### POST /recommend
Get personalized recommendations using ML.

**Request Body:**
```json
{
  "userId": "user_id",
  "interactions": [
    {
      "userId": "user_id",
      "contentId": "content_id",
      "type": "like",
      "rating": 0,
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  ],
  "allContent": [
    {
      "id": "content_id",
      "title": "Title",
      "description": "Description",
      "category": "Category",
      "tags": ["tag1"],
      "type": "article"
    }
  ],
  "userPreferences": {
    "categories": ["Technology"],
    "tags": ["AI"]
  },
  "topN": 12
}
```

**Response:** `200 OK`
```json
{
  "recommendations": ["content_id_1", "content_id_2", ...]
}
```

---

### POST /similar
Get similar content using content-based filtering.

**Request Body:**
```json
{
  "contentId": "content_id",
  "allContent": [...],
  "topN": 6
}
```

**Response:** `200 OK`
```json
{
  "similar": ["content_id_1", "content_id_2", ...]
}
```

---

## 🔧 Error Response Format

All errors follow this structure:

```json
{
  "message": "Error description",
  "errors": [
    {
      "msg": "Specific error message",
      "param": "field_name",
      "location": "body"
    }
  ]
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized (no token or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error

---

## 📝 Example Usage

### JavaScript (Frontend)

```javascript
// Login
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});
const { token, user } = await response.json();

// Get personalized recommendations
const recs = await fetch('http://localhost:5000/api/recommendations/personalized', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const recommendations = await recs.json();
```

### cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"user123"}'

# Get content (with token)
curl -X GET http://localhost:5000/api/content \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Like content
curl -X POST http://localhost:5000/api/interactions/like \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"contentId":"CONTENT_ID_HERE"}'
```

---

## 🚀 Rate Limiting

Currently no rate limiting implemented. For production:
- Recommended: 100 requests/15 minutes per IP
- Use `express-rate-limit` package

---

**API Documentation Complete! 📚**
