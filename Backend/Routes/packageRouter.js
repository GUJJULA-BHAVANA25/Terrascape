const { Router } = require("express");
const { PackageModel } = require("../db");
const { authenticateToken, authorizeRoles } = require("../Middleware/UserMiddleware");

const PackageRouter = Router();

// Get all packages - GET /api/packages
PackageRouter.get("/", async function (req, res) {
    try {
        const { type, category, minPrice, maxPrice, minSize } = req.query;
        const filter = { isActive: true };

        if (type) filter.type = type;
        if (category) filter.category = category;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (minSize) filter.spaceSize = { $lte: Number(minSize) };

        const packages = await PackageModel.find(filter);
        res.json({ packages });
    } catch (error) {
        console.log("Get packages error:", error);
        res.status(500).json({
            message: "Failed to fetch packages",
            error: error.message
        });
    }
});

// Get package by ID - GET /api/packages/:id
PackageRouter.get("/:id", async function (req, res) {
    try {
        const package = await PackageModel.findById(req.params.id);
        if (!package) {
            return res.status(404).json({ message: "Package not found" });
        }
        res.json({ package });
    } catch (error) {
        console.log("Get package error:", error);
        res.status(500).json({
            message: "Failed to fetch package",
            error: error.message
        });
    }
});

// Create package (Admin only) - POST /api/packages
PackageRouter.post("/", authenticateToken, authorizeRoles('admin'), async function (req, res) {
    try {
        const package = await PackageModel.create(req.body);
        res.status(201).json({
            message: "Package created successfully",
            package
        });
    } catch (error) {
        console.log("Create package error:", error);
        res.status(500).json({
            message: "Failed to create package",
            error: error.message
        });
    }
});

// Update package (Admin only) - PATCH /api/packages/:id
PackageRouter.patch("/:id", authenticateToken, authorizeRoles('admin'), async function (req, res) {
    try {
        const package = await PackageModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!package) {
            return res.status(404).json({ message: "Package not found" });
        }
        res.json({
            message: "Package updated successfully",
            package
        });
    } catch (error) {
        console.log("Update package error:", error);
        res.status(500).json({
            message: "Failed to update package",
            error: error.message
        });
    }
});

// Delete package (Admin only) - DELETE /api/packages/:id
PackageRouter.delete("/:id", authenticateToken, authorizeRoles('admin'), async function (req, res) {
    try {
        const package = await PackageModel.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );
        if (!package) {
            return res.status(404).json({ message: "Package not found" });
        }
        res.json({ message: "Package deleted successfully" });
    } catch (error) {
        console.log("Delete package error:", error);
        res.status(500).json({
            message: "Failed to delete package",
            error: error.message
        });
    }
});

module.exports = { PackageRouter };

