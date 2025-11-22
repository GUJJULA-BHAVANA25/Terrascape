const { Router } = require("express");
const { CommunityPostModel, CommentModel } = require("../db");
const { authenticateToken, authorizeRoles } = require("../Middleware/UserMiddleware");

const CommunityRouter = Router();

// Get all community posts - GET /api/community/posts
CommunityRouter.get("/posts", async function (req, res) {
    try {
        const { category, isContest } = req.query;
        const filter = { isApproved: true };

        if (category) filter.category = category;
        if (isContest === 'true') filter.isContest = true;

        const posts = await CommunityPostModel.find(filter)
            .populate('userId', 'firstName lastName')
            .populate('comments')
            .sort({ createdAt: -1 });
        res.json({ posts });
    } catch (error) {
        console.log("Get community posts error:", error);
        res.status(500).json({
            message: "Failed to fetch posts",
            error: error.message
        });
    }
});

// Get post by ID - GET /api/community/posts/:id
CommunityRouter.get("/posts/:id", async function (req, res) {
    try {
        const post = await CommunityPostModel.findById(req.params.id)
            .populate('userId', 'firstName lastName')
            .populate({
                path: 'comments',
                populate: { path: 'userId', select: 'firstName lastName' }
            });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.json({ post });
    } catch (error) {
        console.log("Get post error:", error);
        res.status(500).json({
            message: "Failed to fetch post",
            error: error.message
        });
    }
});

// Create community post - POST /api/community/posts
CommunityRouter.post("/posts", authenticateToken, async function (req, res) {
    try {
        const post = await CommunityPostModel.create({
            ...req.body,
            userId: req.user.userId
        });
        res.status(201).json({
            message: "Post created successfully (pending approval)",
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

// Like/Unlike post - POST /api/community/posts/:id/like
CommunityRouter.post("/posts/:id/like", authenticateToken, async function (req, res) {
    try {
        const post = await CommunityPostModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const userId = req.user.userId;
        const isLiked = post.likes.includes(userId);

        if (isLiked) {
            post.likes = post.likes.filter(id => id.toString() !== userId.toString());
        } else {
            post.likes.push(userId);
        }

        await post.save();
        res.json({
            message: isLiked ? "Post unliked" : "Post liked",
            likes: post.likes.length
        });
    } catch (error) {
        console.log("Like post error:", error);
        res.status(500).json({
            message: "Failed to like post",
            error: error.message
        });
    }
});

// Create comment - POST /api/community/comments
CommunityRouter.post("/comments", authenticateToken, async function (req, res) {
    try {
        const { postId, content } = req.body;

        const comment = await CommentModel.create({
            userId: req.user.userId,
            postId,
            content
        });

        // Add comment to post
        await CommunityPostModel.findByIdAndUpdate(postId, {
            $push: { comments: comment._id }
        });

        res.status(201).json({
            message: "Comment created successfully",
            comment
        });
    } catch (error) {
        console.log("Create comment error:", error);
        res.status(500).json({
            message: "Failed to create comment",
            error: error.message
        });
    }
});

// Approve post (Admin only) - PATCH /api/community/posts/:id/approve
CommunityRouter.patch("/posts/:id/approve", authenticateToken, authorizeRoles('admin'), async function (req, res) {
    try {
        const post = await CommunityPostModel.findByIdAndUpdate(
            req.params.id,
            { isApproved: true },
            { new: true }
        );
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.json({
            message: "Post approved successfully",
            post
        });
    } catch (error) {
        console.log("Approve post error:", error);
        res.status(500).json({
            message: "Failed to approve post",
            error: error.message
        });
    }
});

module.exports = { CommunityRouter };

