const { Router } = require("express");
const { TestimonialModel } = require("../db");
const { authenticateToken, authorizeRoles } = require("../Middleware/UserMiddleware");

const TestimonialRouter = Router();

// Get all testimonials - GET /api/testimonials
TestimonialRouter.get("/", async function (req, res) {
    try {
        const { isFeatured } = req.query;
        const filter = {};
        if (isFeatured === 'true') filter.isFeatured = true;

        const testimonials = await TestimonialModel.find(filter)
            .populate('userId', 'firstName lastName')
            .sort({ createdAt: -1 });
        res.json({ testimonials });
    } catch (error) {
        console.log("Get testimonials error:", error);
        res.status(500).json({
            message: "Failed to fetch testimonials",
            error: error.message
        });
    }
});

// Get testimonial by ID - GET /api/testimonials/:id
TestimonialRouter.get("/:id", async function (req, res) {
    try {
        const testimonial = await TestimonialModel.findById(req.params.id)
            .populate('userId', 'firstName lastName')
            .populate('projectId');
        if (!testimonial) {
            return res.status(404).json({ message: "Testimonial not found" });
        }
        res.json({ testimonial });
    } catch (error) {
        console.log("Get testimonial error:", error);
        res.status(500).json({
            message: "Failed to fetch testimonial",
            error: error.message
        });
    }
});

// Create testimonial - POST /api/testimonials
TestimonialRouter.post("/", authenticateToken, async function (req, res) {
    try {
        const testimonial = await TestimonialModel.create({
            ...req.body,
            userId: req.user.userId
        });
        res.status(201).json({
            message: "Testimonial created successfully",
            testimonial
        });
    } catch (error) {
        console.log("Create testimonial error:", error);
        res.status(500).json({
            message: "Failed to create testimonial",
            error: error.message
        });
    }
});

// Update testimonial (Admin or owner) - PATCH /api/testimonials/:id
TestimonialRouter.patch("/:id", authenticateToken, async function (req, res) {
    try {
        const testimonial = await TestimonialModel.findById(req.params.id);
        if (!testimonial) {
            return res.status(404).json({ message: "Testimonial not found" });
        }

        if (req.user.role !== 'admin' && testimonial.userId?.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Access denied" });
        }

        const updatedTestimonial = await TestimonialModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json({
            message: "Testimonial updated successfully",
            testimonial: updatedTestimonial
        });
    } catch (error) {
        console.log("Update testimonial error:", error);
        res.status(500).json({
            message: "Failed to update testimonial",
            error: error.message
        });
    }
});

module.exports = { TestimonialRouter };

