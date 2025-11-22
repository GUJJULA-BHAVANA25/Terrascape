const { Router } = require("express");
const { PostModel } = require("../db");
const { authenticateToken, authorizeRoles } = require("../Middleware/UserMiddleware");

const PostRouter = Router();

// Get all posts - GET /api/posts
PostRouter.get("/", async function (req, res) {
    try {
        const { type, category, isPublished } = req.query;
        const filter = {};

        if (type) filter.type = type;
        if (category) filter.category = category;
        if (isPublished !== undefined) {
            filter.isPublished = isPublished === 'true';
        } else {
            filter.isPublished = true; // Public endpoint shows only published
        }

        const posts = await PostModel.find(filter)
            .populate('author', 'firstName lastName')
            .sort({ createdAt: -1 });
        res.json({ posts });
    } catch (error) {
        console.log("Get posts error:", error);
        res.status(500).json({
            message: "Failed to fetch posts",
            error: error.message
        });
    }
});

// Get post by ID - GET /api/posts/:id
PostRouter.get("/:id", async function (req, res) {
    try {
        const post = await PostModel.findById(req.params.id).populate('author', 'firstName lastName');
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Increment views
        post.views += 1;
        await post.save();

        res.json({ post });
    } catch (error) {
        console.log("Get post error:", error);
        res.status(500).json({
            message: "Failed to fetch post",
            error: error.message
        });
    }
});

// Create post (Admin/Author) - POST /api/posts
PostRouter.post("/", authenticateToken, authorizeRoles('admin', 'vendor'), async function (req, res) {
    try {
        const post = await PostModel.create({
            ...req.body,
            author: req.user.userId
        });
        res.status(201).json({
            message: "Post created successfully",
            post
        });
    } catch (error) {
        console.log("Create post error:", error);
        res.status(500).json({
            message: "Failed to create post",
            error: error.message
        });
    }
});

// Update post - PATCH /api/posts/:id
PostRouter.patch("/:id", authenticateToken, authorizeRoles('admin', 'vendor'), async function (req, res) {
    try {
        const post = await PostModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if user is author or admin
        if (req.user.role !== 'admin' && post.author.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Access denied" });
        }

        const updatedPost = await PostModel.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: new Date() },
            { new: true }
        );

        res.json({
            message: "Post updated successfully",
            post: updatedPost
        });
    } catch (error) {
        console.log("Update post error:", error);
        res.status(500).json({
            message: "Failed to update post",
            error: error.message
        });
    }
});

// Delete post - DELETE /api/posts/:id
PostRouter.delete("/:id", authenticateToken, authorizeRoles('admin', 'vendor'), async function (req, res) {
    try {
        const post = await PostModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (req.user.role !== 'admin' && post.author.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Access denied" });
        }

        await PostModel.findByIdAndDelete(req.params.id);
        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        console.log("Delete post error:", error);
        res.status(500).json({
            message: "Failed to delete post",
            error: error.message
        });
    }
});

module.exports = { PostRouter };

