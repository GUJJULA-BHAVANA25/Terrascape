const { Router } = require("express");
const { ProductModel, ReviewModel } = require("../db");
const { authenticateToken, authorizeRoles } = require("../Middleware/UserMiddleware");

const ProductRouter = Router();

// Get all products - GET /api/products
ProductRouter.get("/", async function (req, res) {
    try {
        const { category, isOrganic, minPrice, maxPrice } = req.query;
        const filter = { isActive: true };

        if (category) filter.category = category;
        if (isOrganic === 'true') filter.isOrganic = true;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        const products = await ProductModel.find(filter).populate('reviews');
        res.json({ products });
    } catch (error) {
        console.log("Get products error:", error);
        res.status(500).json({
            message: "Failed to fetch products",
            error: error.message
        });
    }
});

// Get product by ID - GET /api/products/:id
ProductRouter.get("/:id", async function (req, res) {
    try {
        const product = await ProductModel.findById(req.params.id)
            .populate({
                path: 'reviews',
                populate: { path: 'userId', select: 'firstName lastName' }
            });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({ product });
    } catch (error) {
        console.log("Get product error:", error);
        res.status(500).json({
            message: "Failed to fetch product",
            error: error.message
        });
    }
});

// Create product (Admin only) - POST /api/products
ProductRouter.post("/", authenticateToken, authorizeRoles('admin'), async function (req, res) {
    try {
        const product = await ProductModel.create(req.body);
        res.status(201).json({
            message: "Product created successfully",
            product
        });
    } catch (error) {
        console.log("Create product error:", error);
        res.status(500).json({
            message: "Failed to create product",
            error: error.message
        });
    }
});

// Update product (Admin only) - PATCH /api/products/:id
ProductRouter.patch("/:id", authenticateToken, authorizeRoles('admin'), async function (req, res) {
    try {
        const product = await ProductModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({
            message: "Product updated successfully",
            product
        });
    } catch (error) {
        console.log("Update product error:", error);
        res.status(500).json({
            message: "Failed to update product",
            error: error.message
        });
    }
});

// Add review - POST /api/products/:id/reviews
ProductRouter.post("/:id/reviews", authenticateToken, async function (req, res) {
    try {
        const { rating, comment } = req.body;

        const review = await ReviewModel.create({
            userId: req.user.userId,
            productId: req.params.id,
            rating,
            comment
        });

        // Update product rating
        const product = await ProductModel.findById(req.params.id);
        const reviews = await ReviewModel.find({ productId: req.params.id });
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        product.rating = avgRating;
        product.reviews.push(review._id);
        await product.save();

        res.status(201).json({
            message: "Review added successfully",
            review
        });
    } catch (error) {
        console.log("Add review error:", error);
        res.status(500).json({
            message: "Failed to add review",
            error: error.message
        });
    }
});

module.exports = { ProductRouter };

