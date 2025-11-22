const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
require('dotenv').config();
const path = require("path");
const cors = require("cors");

// CORS middleware
app.use(cors());

// Body parsing middleware
app.use(express.urlencoded({ extended: true }));

// Serve static files
const staticPath = path.resolve(__dirname, "../Frontend");
app.use(express.static(staticPath));

// Import Routes
const { AuthRouter } = require("./Routes/authRouter");
const { UserRouter } = require("./Routes/userRouter");
const { PackageRouter } = require("./Routes/packageRouter");
const { BookingRouter } = require("./Routes/bookingRouter");
const { ProjectRouter } = require("./Routes/projectRouter");
const { PostRouter } = require("./Routes/postRouter");
const { SchedulerRouter } = require("./Routes/schedulerRouter");
const { CommunityRouter } = require("./Routes/communityRouter");
const { ProductRouter } = require("./Routes/productRouter");
const { OrderRouter } = require("./Routes/orderRouter");
const { TestimonialRouter } = require("./Routes/testimonialRouter");
const { ContentRouter } = require("./Routes/contentRouter");
const { AnalyticsRouter } = require("./Routes/analyticsRouter");

// API Routes
app.use("/api/auth", AuthRouter);
app.use("/api/users", UserRouter);
app.use("/api/packages", PackageRouter);
app.use("/api/bookings", BookingRouter);
app.use("/api/projects", ProjectRouter);
app.use("/api/posts", PostRouter);
app.use("/api/scheduler", SchedulerRouter);
app.use("/api/community", CommunityRouter);
app.use("/api/products", ProductRouter);
app.use("/api/orders", OrderRouter);
app.use("/api/testimonials", TestimonialRouter);
app.use("/api/content", ContentRouter);
app.use("/api/analytics", AnalyticsRouter);

// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "OK", message: "Terrascape API is running" });
});

// Connect to MongoDB and start server
async function main() {
    try {
        console.log("🔄 Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URL);
        console.log("✅ Connected to MongoDB");
        
        app.listen(3000, () => {
            console.log("🚀 Server running on http://localhost:3000");
            console.log("📚 API Documentation:");
            console.log("   - Auth: /api/auth/register, /api/auth/login, /api/auth/me");
            console.log("   - Users: /api/users/me, /api/users/:id");
            console.log("   - Packages: /api/packages");
            console.log("   - Bookings: /api/bookings");
            console.log("   - Projects: /api/projects");
            console.log("   - Posts: /api/posts");
            console.log("   - Scheduler: /api/scheduler");
            console.log("   - Community: /api/community/posts");
            console.log("   - Products: /api/products");
            console.log("   - Orders: /api/orders");
            console.log("   - Testimonials: /api/testimonials");
            console.log("   - Content: /api/content");
            console.log("   - Analytics: /api/analytics/impact, /api/analytics/dashboard");
        });
    } catch (error) {
        console.error("❌ Error starting server:", error);
        process.exit(1);
    }
}

main();
