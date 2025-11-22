const { Router } = require("express");
const { UserModel } = require("../db");
const { authenticateToken, authorizeRoles } = require("../Middleware/UserMiddleware");

const UserRouter = Router();

// Get user profile - GET /api/users/me
UserRouter.get("/me", authenticateToken, async function (req, res) {
    try {
        const user = await UserModel.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ user });
    } catch (error) {
        console.log("Get user error:", error);
        res.status(500).json({
            message: "Failed to fetch user",
            error: error.message
        });
    }
});

// Get user by ID - GET /api/users/:id
UserRouter.get("/:id", authenticateToken, async function (req, res) {
    try {
        const user = await UserModel.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ user });
    } catch (error) {
        console.log("Get user error:", error);
        res.status(500).json({
            message: "Failed to fetch user",
            error: error.message
        });
    }
});

// Update user profile - PATCH /api/users/me
UserRouter.patch("/me", authenticateToken, async function (req, res) {
    try {
        const updates = req.body;
        delete updates.password; // Don't allow password update through this route
        delete updates.email; // Don't allow email update
        delete updates.role; // Don't allow role update

        const user = await UserModel.findByIdAndUpdate(
            req.user.userId,
            { ...updates, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "Profile updated successfully",
            user
        });
    } catch (error) {
        console.log("Update user error:", error);
        res.status(500).json({
            message: "Failed to update profile",
            error: error.message
        });
    }
});

// Get all users (Admin only) - GET /api/users
UserRouter.get("/", authenticateToken, authorizeRoles('admin'), async function (req, res) {
    try {
        const users = await UserModel.find().select('-password');
        res.json({ users });
    } catch (error) {
        console.log("Get users error:", error);
        res.status(500).json({
            message: "Failed to fetch users",
            error: error.message
        });
    }
});

module.exports = { UserRouter };
