# Terrascape - Terrace Garden Management System

A comprehensive MERN stack application for managing terrace garden services, bookings, e-commerce, community forums, and more.

## Features

### ✅ Implemented Modules

1. **Auth & User Management**
   - User registration and login with JWT
   - Role-based access (user, vendor, admin)
   - User profiles with preferences

2. **Service Packages & Pricing**
   - B2C and B2B packages
   - Package filtering and search
   - Admin CRUD operations

3. **Booking & Consultation**
   - Site inspection bookings
   - Booking status management
   - B2B booking support

4. **Terrace Project Management**
   - Project timeline tracking
   - Status updates (site inspection → design → setup → maintenance)
   - Notes and photos

5. **Educational Content**
   - Blog posts and guides
   - Categories: Organic Farming, Climate-wise Plants, DIY Tutorials, Workshops
   - Garden of the Month stories

6. **Watering & Fertilizer Scheduler**
   - Climate-based recommendations
   - Plant-specific schedules
   - Save user schedules

7. **Community Forum**
   - Discussion threads
   - Likes and comments
   - Contest system (Garden of the Month)
   - Content moderation

8. **E-commerce Store**
   - Product catalog (plants, tools, fertilizers, DIY kits)
   - Shopping cart and orders
   - Product reviews and ratings

9. **Testimonials & Impact Stories**
   - Customer testimonials
   - Before/after galleries
   - Impact metrics (vegetables produced, temperature reduction)

10. **Content Management**
    - Editable landing page content
    - Dynamic content blocks

11. **Admin Panel**
    - Dashboard analytics
    - Booking management
    - Content moderation
    - User management

12. **SDG & Impact Analytics**
    - Total terrace area converted
    - CO₂ avoided calculations
    - Impact metrics dashboard

## Tech Stack

- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Frontend:** HTML, CSS, JavaScript
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcrypt

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "terrace garden/Code"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `Backend` directory:
   ```env
   MONGO_URL=mongodb://localhost:27017/terrascape
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   ```
   
   Or use MongoDB Atlas:
   ```env
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/terrascape
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   ```

4. **Start the server**
   ```bash
   cd Backend
   node index.js
   ```
   
   Or with auto-reload (if nodemon is installed):
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: Open `Frontend/Main-Page.html` in your browser
   - API: `http://localhost:3000/api`

## Project Structure

```
Code/
├── Backend/
│   ├── db.js                    # Database models and schemas
│   ├── index.js                 # Main server file
│   ├── Middleware/
│   │   └── UserMiddleware.js    # Authentication & authorization middleware
│   └── Routes/
│       ├── authRouter.js        # Authentication routes
│       ├── userRouter.js        # User management routes
│       ├── packageRouter.js     # Package routes
│       ├── bookingRouter.js     # Booking routes
│       ├── projectRouter.js     # Project management routes
│       ├── postRouter.js        # Blog/educational content routes
│       ├── schedulerRouter.js   # Watering scheduler routes
│       ├── communityRouter.js   # Community forum routes
│       ├── productRouter.js     # E-commerce product routes
│       ├── orderRouter.js       # Order management routes
│       ├── testimonialRouter.js # Testimonial routes
│       ├── contentRouter.js     # Content management routes
│       └── analyticsRouter.js   # Analytics routes
├── Frontend/
│   ├── Main-Page.html          # Landing page
│   ├── main-page.js            # Landing page JavaScript
│   ├── CSS/
│   │   └── styles.css          # Main stylesheet
│   ├── User-Signup/            # Signup page
│   └── User-Signin/            # Signin page
├── package.json                # Dependencies
└── API_DOCUMENTATION.md        # Complete API documentation
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Packages
- `GET /api/packages` - Get all packages
- `GET /api/packages/:id` - Get package by ID
- `POST /api/packages` - Create package (Admin)
- `PATCH /api/packages/:id` - Update package (Admin)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user's bookings
- `GET /api/bookings/:id` - Get booking by ID
- `PATCH /api/bookings/:id/status` - Update booking status (Admin)

### Projects
- `GET /api/projects` - Get user's projects
- `GET /api/projects/:id` - Get project by ID
- `PATCH /api/projects/:id` - Update project

### Posts (Educational Content)
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get post by ID
- `POST /api/posts` - Create post (Admin/Vendor)

### Scheduler
- `POST /api/scheduler/recommend` - Get watering/fertilizer recommendations
- `POST /api/scheduler/save` - Save user schedule
- `GET /api/scheduler` - Get user's schedules

### Community
- `GET /api/community/posts` - Get community posts
- `POST /api/community/posts` - Create post
- `POST /api/community/posts/:id/like` - Like/unlike post
- `POST /api/community/comments` - Create comment

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `POST /api/products/:id/reviews` - Add review

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID

### Testimonials
- `GET /api/testimonials` - Get all testimonials
- `POST /api/testimonials` - Create testimonial

### Analytics
- `GET /api/analytics/impact` - Get SDG impact metrics
- `GET /api/analytics/dashboard` - Get dashboard analytics (Admin)

For complete API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## Database Collections

- `users` - User accounts and profiles
- `packages` - Service packages
- `bookings` - Booking records
- `projects` - Project management
- `posts` - Educational content
- `plants` - Plant database for scheduler
- `userschedules` - Saved user schedules
- `communityposts` - Forum posts
- `comments` - Forum comments
- `products` - E-commerce products
- `orders` - Order records
- `reviews` - Product reviews
- `testimonials` - Customer testimonials
- `contentblocks` - Editable content
- `impactmetrics` - SDG impact metrics

## User Roles

- **user**: Regular customers
- **vendor**: Service providers
- **admin**: Full system access

## Development

### Adding New Features

1. Create/update model in `Backend/db.js`
2. Create route file in `Backend/Routes/`
3. Add route to `Backend/index.js`
4. Update API documentation

### Testing

Test API endpoints using:
- Postman
- curl
- Browser fetch API
- Frontend integration

## Future Enhancements

- [ ] Google OAuth integration
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Image upload to cloud storage
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Real-time chat support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

ISC

## Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ for sustainable urban living**
