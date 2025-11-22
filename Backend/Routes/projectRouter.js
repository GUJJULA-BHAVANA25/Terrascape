const { Router } = require("express");
const { ProjectModel, BookingModel } = require("../db");
const { authenticateToken, authorizeRoles } = require("../Middleware/UserMiddleware");

const ProjectRouter = Router();

// Get user's projects - GET /api/projects
ProjectRouter.get("/", authenticateToken, async function (req, res) {
    try {
        const filter = {};
        if (req.user.role !== 'admin') {
            filter.userId = req.user.userId;
        }

        const projects = await ProjectModel.find(filter)
            .populate('bookingId')
            .sort({ createdAt: -1 });
        res.json({ projects });
    } catch (error) {
        console.log("Get projects error:", error);
        res.status(500).json({
            message: "Failed to fetch projects",
            error: error.message
        });
    }
});

// Get project by ID - GET /api/projects/:id
ProjectRouter.get("/:id", authenticateToken, async function (req, res) {
    try {
        const project = await ProjectModel.findById(req.params.id).populate('bookingId');
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (req.user.role !== 'admin' && project.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.json({ project });
    } catch (error) {
        console.log("Get project error:", error);
        res.status(500).json({
            message: "Failed to fetch project",
            error: error.message
        });
    }
});

// Update project status - PATCH /api/projects/:id
ProjectRouter.patch("/:id", authenticateToken, async function (req, res) {
    try {
        const project = await ProjectModel.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Only admin or project owner can update
        if (req.user.role !== 'admin' && project.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Access denied" });
        }

        const { status, timeline, notes, photos } = req.body;
        const updates = { updatedAt: new Date() };

        if (status) updates.status = status;
        if (timeline) updates.timeline = timeline;
        if (notes) {
            updates.$push = {
                notes: {
                    text: notes,
                    addedBy: req.user.role === 'admin' ? 'admin' : 'user'
                }
            };
        }
        if (photos) {
            updates.$push = { photos: { $each: photos } };
        }

        const updatedProject = await ProjectModel.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        );

        res.json({
            message: "Project updated successfully",
            project: updatedProject
        });
    } catch (error) {
        console.log("Update project error:", error);
        res.status(500).json({
            message: "Failed to update project",
            error: error.message
        });
    }
});

module.exports = { ProjectRouter };

