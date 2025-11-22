# Terrascape API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require authentication via JWT token. Include the token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 1. Auth & User Management

### Register User
- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user", // optional: "user" | "vendor" | "admin"
    "address": { // optional
      "street": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "zipCode": "400001"
    },
    "terraceSize": 500, // optional: in sq.ft
    "preferences": { // optional
      "organic": true,
      "decor": false,
      "verticalGarden": true,
      "kitchenGarden": false
    },
    "phone": "+91-1234567890" // optional
  }
  ```
- **Response:** Returns token and user object

### Login
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:** Returns token and user object

### Get Current User
- **GET** `/api/auth/me`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Current user profile

### Get User Profile
- **GET** `/api/users/me`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** User profile

### Get User by ID
- **GET** `/api/users/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** User profile

### Update User Profile
- **PATCH** `/api/users/me`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** Any user fields to update (except password, email, role)

---

## 2. Service Packages & Pricing

### Get All Packages
- **GET** `/api/packages`
- **Query Params:**
  - `type`: "B2C" | "B2B"
  - `category`: "Starter" | "Pro" | "Organic Kitchen Garden" | "Vertical Garden" | "DIY Kit" | "B2B Setup"
  - `minPrice`: number
  - `maxPrice`: number
  - `minSize`: number (minimum terrace size)
- **Response:** Array of packages

### Get Package by ID
- **GET** `/api/packages/:id`
- **Response:** Package details

### Create Package (Admin only)
- **POST** `/api/packages`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Body:**
  ```json
  {
    "name": "Starter Package",
    "description": "Perfect for beginners",
    "type": "B2C",
    "price": 5000,
    "duration": "2 weeks",
    "features": ["Site inspection", "Basic setup", "5 plants"],
    "images": ["url1", "url2"],
    "spaceSize": 200,
    "category": "Starter",
    "isActive": true
  }
  ```

### Update Package (Admin only)
- **PATCH** `/api/packages/:id`
- **Headers:** `Authorization: Bearer <admin_token>`

### Delete Package (Admin only)
- **DELETE** `/api/packages/:id`
- **Headers:** `Authorization: Bearer <admin_token>`

---

## 3. Booking & Consultation

### Create Booking
- **POST** `/api/bookings`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "packageId": "package_id",
    "date": "2024-12-25",
    "time": "10:00 AM",
    "terraceSize": 500,
    "city": "Mumbai",
    "organizationName": "ABC School", // optional, for B2B
    "organizationType": "school", // optional: "school" | "office" | "cafe" | "restaurant" | "hotel" | "other"
    "address": { // optional
      "street": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "zipCode": "400001"
    },
    "notes": "Additional requirements" // optional
  }
  ```

### Get User's Bookings
- **GET** `/api/bookings?userId=<user_id>` (optional, admin can filter)
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Array of bookings

### Get Booking by ID
- **GET** `/api/bookings/:id`
- **Headers:** `Authorization: Bearer <token>`

### Update Booking Status (Admin only)
- **PATCH** `/api/bookings/:id/status`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Body:**
  ```json
  {
    "status": "confirmed" // "pending" | "confirmed" | "completed" | "cancelled"
  }
  ```

---

## 4. Terrace Project Management

### Get Projects
- **GET** `/api/projects`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Array of projects (user's own, or all if admin)

### Get Project by ID
- **GET** `/api/projects/:id`
- **Headers:** `Authorization: Bearer <token>`

### Update Project
- **PATCH** `/api/projects/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "status": "design", // "site_inspection" | "design" | "setup" | "maintenance" | "completed"
    "timeline": [...], // optional
    "notes": "Project update notes", // optional
    "photos": ["url1", "url2"] // optional
  }
  ```

---

## 5. Educational Content (Blogs, Guides)

### Get All Posts
- **GET** `/api/posts`
- **Query Params:**
  - `type`: "blog" | "guide" | "story" | "workshop"
  - `category`: "Organic Farming" | "Climate-wise Plants" | "DIY Tutorial" | "Workshop" | "Garden of the Month" | "Other"
  - `isPublished`: true | false
- **Response:** Array of posts

### Get Post by ID
- **GET** `/api/posts/:id`
- **Response:** Post details (increments view count)

### Create Post (Admin/Vendor only)
- **POST** `/api/posts`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "title": "How to Start Organic Farming",
    "content": "Full article content...",
    "type": "blog",
    "category": "Organic Farming",
    "images": ["url1"],
    "tags": ["organic", "farming"],
    "isPublished": true
  }
  ```

### Update Post
- **PATCH** `/api/posts/:id`
- **Headers:** `Authorization: Bearer <token>` (author or admin)

### Delete Post
- **DELETE** `/api/posts/:id`
- **Headers:** `Authorization: Bearer <token>` (author or admin)

---

## 6. Watering & Fertilizer Scheduler

### Get Schedule Recommendations
- **POST** `/api/scheduler/recommend`
- **Body:**
  ```json
  {
    "city": "Mumbai",
    "climate": "tropical",
    "plantTypes": ["leafy_greens", "herbs"],
    "potSize": 10 // in liters
  }
  ```
- **Response:** Recommended watering and fertilizer schedules

### Save User Schedule
- **POST** `/api/scheduler/save`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "city": "Mumbai",
    "climate": "tropical",
    "plants": [
      {
        "plantId": "plant_id",
        "plantName": "Basil",
        "potSize": 10,
        "wateringSchedule": {...},
        "fertilizerSchedule": {...}
      }
    ]
  }
  ```

### Get User's Saved Schedules
- **GET** `/api/scheduler`
- **Headers:** `Authorization: Bearer <token>`

### Get All Plants
- **GET** `/api/scheduler/plants`
- **Response:** Array of plants with watering/fertilizer info

---

## 7. Community Forum

### Get Community Posts
- **GET** `/api/community/posts`
- **Query Params:**
  - `category`: "pest_issues" | "planting_tips" | "harvesting" | "general" | "contest"
  - `isContest`: true | false
- **Response:** Array of approved posts

### Get Post by ID
- **GET** `/api/community/posts/:id`

### Create Community Post
- **POST** `/api/community/posts`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "title": "Pest problem in my garden",
    "content": "I'm facing issues with...",
    "category": "pest_issues",
    "images": ["url1"],
    "isContest": false
  }
  ```

### Like/Unlike Post
- **POST** `/api/community/posts/:id/like`
- **Headers:** `Authorization: Bearer <token>`

### Create Comment
- **POST** `/api/community/comments`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "postId": "post_id",
    "content": "Great post! Here's my suggestion..."
  }
  ```

### Approve Post (Admin only)
- **PATCH** `/api/community/posts/:id/approve`
- **Headers:** `Authorization: Bearer <admin_token>`

---

## 8. E-commerce Store

### Get All Products
- **GET** `/api/products`
- **Query Params:**
  - `category`: "plants" | "tools" | "fertilizers" | "diy_kits" | "accessories"
  - `isOrganic`: true | false
  - `minPrice`: number
  - `maxPrice`: number
- **Response:** Array of products

### Get Product by ID
- **GET** `/api/products/:id`

### Create Product (Admin only)
- **POST** `/api/products`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Body:**
  ```json
  {
    "name": "Organic Compost",
    "description": "High-quality organic compost",
    "category": "fertilizers",
    "price": 500,
    "stock": 100,
    "images": ["url1"],
    "isOrganic": true
  }
  ```

### Add Product Review
- **POST** `/api/products/:id/reviews`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "rating": 5, // 1-5
    "comment": "Great product!"
  }
  ```

---

## 9. Orders

### Create Order
- **POST** `/api/orders`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "items": [
      {
        "productId": "product_id",
        "quantity": 2
      }
    ],
    "shippingAddress": {
      "street": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "zipCode": "400001"
    }
  }
  ```

### Get User's Orders
- **GET** `/api/orders`
- **Headers:** `Authorization: Bearer <token>`

### Get Order by ID
- **GET** `/api/orders/:id`
- **Headers:** `Authorization: Bearer <token>`

### Update Order Status (Admin only)
- **PATCH** `/api/orders/:id/status`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Body:**
  ```json
  {
    "status": "confirmed" // "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  }
  ```

---

## 10. Testimonials

### Get All Testimonials
- **GET** `/api/testimonials`
- **Query Params:**
  - `isFeatured`: true | false
- **Response:** Array of testimonials

### Get Testimonial by ID
- **GET** `/api/testimonials/:id`

### Create Testimonial
- **POST** `/api/testimonials`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "role": "Homeowner",
    "content": "Amazing service!",
    "images": ["before.jpg", "after.jpg"],
    "metrics": {
      "vegetablesPerMonth": 20,
      "temperatureReduction": 3,
      "areaConverted": 500
    },
    "projectId": "project_id"
  }
  ```

---

## 11. Content Management

### Get Content Blocks
- **GET** `/api/content`
- **Query Params:**
  - `page`: "home" | "about" | "contact"
  - `section`: section name
- **Response:** Array of content blocks

### Create/Update Content Block (Admin only)
- **POST** `/api/content`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Body:**
  ```json
  {
    "page": "home",
    "section": "hero",
    "title": "Transform Your Terrace",
    "content": "Content here...",
    "images": ["url1"],
    "order": 1,
    "isActive": true
  }
  ```

---

## 12. Analytics & Impact

### Get Impact Analytics
- **GET** `/api/analytics/impact`
- **Response:** SDG impact metrics (total area, CO2 avoided, etc.)

### Get Dashboard Analytics (Admin only)
- **GET** `/api/analytics/dashboard`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Response:** Dashboard stats (users, bookings, orders, revenue)

### Create Impact Metrics (Admin only)
- **POST** `/api/analytics/impact`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Body:**
  ```json
  {
    "projectId": "project_id",
    "bookingId": "booking_id",
    "terraceArea": 500,
    "co2Avoided": 100,
    "vegetablesProduced": 20,
    "temperatureReduction": 3,
    "waterSaved": 500
  }
  ```

---

## Environment Variables

Create a `.env` file in the Backend directory:

```
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

---

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env`

3. Start the server:
```bash
cd Backend
node index.js
```

Or with nodemon:
```bash
npm run dev
```

---

## Error Responses

All errors follow this format:
```json
{
  "message": "Error description",
  "error": "Detailed error message (in development)"
}
```

Common HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

