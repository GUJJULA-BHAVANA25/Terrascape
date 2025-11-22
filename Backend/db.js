const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

// 1. User Schema - Enhanced with role, profile, preferences
const UserSchema = new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { type: String, enum: ['user', 'vendor', 'admin'], default: 'user' },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String
    },
    terraceSize: { type: Number }, // in sq.ft
    preferences: {
        organic: { type: Boolean, default: false },
        decor: { type: Boolean, default: false },
        verticalGarden: { type: Boolean, default: false },
        kitchenGarden: { type: Boolean, default: false }
    },
    phone: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// 2. Package Schema - Service packages
const PackageSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['B2C', 'B2B'], required: true },
    price: { type: Number, required: true },
    duration: { type: String }, // e.g., "2 weeks", "1 month"
    features: [String],
    images: [String],
    spaceSize: { type: Number }, // minimum terrace size in sq.ft
    category: { type: String, enum: ['Starter', 'Pro', 'Organic Kitchen Garden', 'Vertical Garden', 'DIY Kit', 'B2B Setup'], required: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

// 3. Booking Schema - Enhanced booking system
const BookingSchema = new Schema({
    userId: { type: ObjectId, ref: 'user', required: true },
    packageId: { type: ObjectId, ref: 'Package', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    terraceSize: { type: Number, required: true },
    city: { type: String, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
    // B2B specific fields
    organizationName: String,
    organizationType: { type: String, enum: ['school', 'office', 'cafe', 'restaurant', 'hotel', 'other'] },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String
    },
    notes: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// 4. Project Schema - Terrace project management
const ProjectSchema = new Schema({
    bookingId: { type: ObjectId, ref: 'Booking', required: true },
    userId: { type: ObjectId, ref: 'user', required: true },
    status: { type: String, enum: ['site_inspection', 'design', 'setup', 'maintenance', 'completed'], default: 'site_inspection' },
    timeline: [{
        stage: { type: String, enum: ['site_inspection', 'design', 'setup', 'maintenance'] },
        status: { type: String, enum: ['pending', 'in_progress', 'completed'] },
        date: Date,
        notes: String,
        photos: [String]
    }],
    notes: [{
        text: String,
        date: { type: Date, default: Date.now },
        addedBy: { type: String, enum: ['user', 'admin', 'vendor'] }
    }],
    photos: [String],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// 5. Post Schema - Educational content (blogs, guides, resources)
const PostSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ['blog', 'guide', 'story', 'workshop'], required: true },
    category: { type: String, enum: ['Organic Farming', 'Climate-wise Plants', 'DIY Tutorial', 'Workshop', 'Garden of the Month', 'Other'] },
    author: { type: ObjectId, ref: 'user' },
    images: [String],
    tags: [String],
    isPublished: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// 6. Plant Schema - For watering scheduler
const PlantSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['leafy_greens', 'flowering', 'herbs', 'vegetables', 'fruits', 'other'], required: true },
    climate: [String], // cities/climates where it grows well
    wateringFrequency: {
        summer: { frequency: String, time: String }, // e.g., "daily", "morning"
        winter: { frequency: String, time: String },
        monsoon: { frequency: String, time: String }
    },
    fertilizerSchedule: {
        type: String, // e.g., "compost every 15 days"
        frequency: Number, // days
        fertilizerType: String
    },
    potSize: {
        min: Number, // in liters
        max: Number
    },
    description: String
});

// 7. User Schedule Schema - Saved watering/fertilizer schedules
const UserScheduleSchema = new Schema({
    userId: { type: ObjectId, ref: 'user', required: true },
    city: { type: String, required: true },
    climate: { type: String, required: true },
    plants: [{
        plantId: { type: ObjectId, ref: 'Plant' },
        plantName: String,
        potSize: Number,
        wateringSchedule: {
            frequency: String,
            time: String,
            nextWatering: Date
        },
        fertilizerSchedule: {
            frequency: Number, // days
            nextFertilizing: Date,
            fertilizerType: String
        }
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// 8. Community Post Schema - Forum posts
const CommunityPostSchema = new Schema({
    userId: { type: ObjectId, ref: 'user', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, enum: ['pest_issues', 'planting_tips', 'harvesting', 'general', 'contest'] },
    images: [String],
    likes: [{ type: ObjectId, ref: 'user' }],
    comments: [{ type: ObjectId, ref: 'Comment' }],
    isContest: { type: Boolean, default: false },
    contestMonth: String, // e.g., "2024-01" for January 2024
    isApproved: { type: Boolean, default: false }, // for moderation
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// 9. Comment Schema - Forum comments
const CommentSchema = new Schema({
    userId: { type: ObjectId, ref: 'user', required: true },
    postId: { type: ObjectId, ref: 'CommunityPost', required: true },
    content: { type: String, required: true },
    likes: [{ type: ObjectId, ref: 'user' }],
    createdAt: { type: Date, default: Date.now }
});

// 10. Product Schema - E-commerce
const ProductSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['plants', 'tools', 'fertilizers', 'diy_kits', 'accessories'], required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    images: [String],
    isOrganic: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    reviews: [{ type: ObjectId, ref: 'Review' }],
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

// 11. Order Schema - E-commerce orders
const OrderSchema = new Schema({
    userId: { type: ObjectId, ref: 'user', required: true },
    items: [{
        productId: { type: ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String
    },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// 12. Review Schema - Product reviews
const ReviewSchema = new Schema({
    userId: { type: ObjectId, ref: 'user', required: true },
    productId: { type: ObjectId, ref: 'Product', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String,
    createdAt: { type: Date, default: Date.now }
});

// 13. Testimonial Schema
const TestimonialSchema = new Schema({
    userId: { type: ObjectId, ref: 'user' },
    name: { type: String, required: true },
    role: String, // e.g., "Homeowner", "School Principal"
    content: { type: String, required: true },
    images: [String], // before/after photos
    metrics: {
        vegetablesPerMonth: Number, // kg
        temperatureReduction: Number, // °C
        areaConverted: Number // sq.ft
    },
    projectId: { type: ObjectId, ref: 'Project' },
    isFeatured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

// 14. Content Block Schema - For editable landing page content
const ContentBlockSchema = new Schema({
    page: { type: String, required: true }, // 'home', 'about', 'contact'
    section: { type: String, required: true }, // 'hero', 'problem', 'solution', etc.
    title: String,
    content: String,
    images: [String],
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    updatedAt: { type: Date, default: Date.now }
});

// 15. Impact Metrics Schema - SDG & Impact Analytics
const ImpactMetricsSchema = new Schema({
    projectId: { type: ObjectId, ref: 'Project' },
    bookingId: { type: ObjectId, ref: 'Booking' },
    terraceArea: { type: Number, required: true }, // sq.ft
    co2Avoided: { type: Number }, // approximate kg CO2
    vegetablesProduced: { type: Number }, // kg per month
    temperatureReduction: { type: Number }, // °C
    waterSaved: { type: Number }, // liters
    createdAt: { type: Date, default: Date.now }
});

// Create Models
const UserModel = mongoose.model("user", UserSchema);
const PackageModel = mongoose.model("Package", PackageSchema);
const BookingModel = mongoose.model("Booking", BookingSchema);
const ProjectModel = mongoose.model("Project", ProjectSchema);
const PostModel = mongoose.model("Post", PostSchema);
const PlantModel = mongoose.model("Plant", PlantSchema);
const UserScheduleModel = mongoose.model("UserSchedule", UserScheduleSchema);
const CommunityPostModel = mongoose.model("CommunityPost", CommunityPostSchema);
const CommentModel = mongoose.model("Comment", CommentSchema);
const ProductModel = mongoose.model("Product", ProductSchema);
const OrderModel = mongoose.model("Order", OrderSchema);
const ReviewModel = mongoose.model("Review", ReviewSchema);
const TestimonialModel = mongoose.model("Testimonial", TestimonialSchema);
const ContentBlockModel = mongoose.model("ContentBlock", ContentBlockSchema);
const ImpactMetricsModel = mongoose.model("ImpactMetrics", ImpactMetricsSchema);

module.exports = {
    UserModel,
    PackageModel,
    BookingModel,
    ProjectModel,
    PostModel,
    PlantModel,
    UserScheduleModel,
    CommunityPostModel,
    CommentModel,
    ProductModel,
    OrderModel,
    ReviewModel,
    TestimonialModel,
    ContentBlockModel,
    ImpactMetricsModel
};
