const { Router } = require("express");
const { ContentBlockModel } = require("../db");
const { authenticateToken, authorizeRoles } = require("../Middleware/UserMiddleware");

const ContentRouter = Router();

// Get content blocks - GET /api/content
ContentRouter.get("/", async function (req, res) {
    try {
        const { page, section } = req.query;
        const filter = { isActive: true };

        if (page) filter.page = page;
        if (section) filter.section = section;

        const contentBlocks = await ContentBlockModel.find(filter).sort({ order: 1 });
        res.json({ contentBlocks });
    } catch (error) {
        console.log("Get content blocks error:", error);
        res.status(500).json({
            message: "Failed to fetch content blocks",
            error: error.message
        });
    }
});

// Create/Update content block (Admin only) - POST /api/content
ContentRouter.post("/", authenticateToken, authorizeRoles('admin'), async function (req, res) {
    try {
        const { page, section } = req.body;
        
        // Check if block exists
        let contentBlock = await ContentBlockModel.findOne({ page, section });
        
        if (contentBlock) {
            // Update existing
            contentBlock = await ContentBlockModel.findByIdAndUpdate(
                contentBlock._id,
                { ...req.body, updatedAt: new Date() },
                { new: true }
            );
            res.json({
                message: "Content block updated successfully",
                contentBlock
            });
        } else {
            // Create new
            contentBlock = await ContentBlockModel.create(req.body);
            res.status(201).json({
                message: "Content block created successfully",
                contentBlock
            });
        }
    } catch (error) {
        console.log("Create content block error:", error);
        res.status(500).json({
            message: "Failed to create content block",
            error: error.message
        });
    }
});

module.exports = { ContentRouter };

