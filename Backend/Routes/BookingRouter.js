const { Router } = require("express");
const { BookingModel, PackageModel, ProjectModel } = require("../db");
const { authenticateToken, authorizeRoles } = require("../Middleware/UserMiddleware");

const BookingRouter = Router();

// Create booking - POST /api/bookings
BookingRouter.post("/", authenticateToken, async function (req, res) {
    try {
        const { packageId, date, time, terraceSize, city, organizationName, organizationType, address, notes } = req.body;

        // Verify package exists
        const package = await PackageModel.findById(packageId);
        if (!package || !package.isActive) {
            return res.status(404).json({ message: "Package not found or inactive" });
        }

        const booking = await BookingModel.create({
            userId: req.user.userId,
            packageId,
            date: new Date(date),
            time,
            terraceSize,
            city,
            organizationName,
            organizationType,
            address,
            notes,
            status: 'pending'
        });

        // Create project for this booking
        await ProjectModel.create({
            bookingId: booking._id,
            userId: req.user.userId,
            status: 'site_inspection',
            timeline: [{
                stage: 'site_inspection',
                status: 'pending',
                date: new Date(date)
            }]
        });

        res.status(201).json({
            message: "Booking created successfully",
            booking
        });
    } catch (error) {
        console.log("Create booking error:", error);
        res.status(500).json({
            message: "Failed to create booking",
            error: error.message
        });
    }
});

// Get user's bookings - GET /api/bookings?userId=
BookingRouter.get("/", authenticateToken, async function (req, res) {
    try {
        const { userId } = req.query;
        const filter = {};

        // If admin, can see all bookings. Otherwise, only own bookings
        if (req.user.role === 'admin') {
            if (userId) filter.userId = userId;
        } else {
            filter.userId = req.user.userId;
        }

        const bookings = await BookingModel.find(filter)
            .populate('packageId')
            .sort({ createdAt: -1 });
        res.json({ bookings });
    } catch (error) {
        console.log("Get bookings error:", error);
        res.status(500).json({
            message: "Failed to fetch bookings",
            error: error.message
        });
    }
});

// Get booking by ID - GET /api/bookings/:id
BookingRouter.get("/:id", authenticateToken, async function (req, res) {
    try {
        const booking = await BookingModel.findById(req.params.id).populate('packageId');
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Check if user owns booking or is admin
        if (req.user.role !== 'admin' && booking.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.json({ booking });
    } catch (error) {
        console.log("Get booking error:", error);
        res.status(500).json({
            message: "Failed to fetch booking",
            error: error.message
        });
    }
});

// Update booking status (Admin only) - PATCH /api/bookings/:id/status
BookingRouter.patch("/:id/status", authenticateToken, authorizeRoles('admin'), async function (req, res) {
    try {
        const { status } = req.body;
        if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const booking = await BookingModel.findByIdAndUpdate(
            req.params.id,
            { status, updatedAt: new Date() },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.json({
            message: "Booking status updated successfully",
            booking
        });
    } catch (error) {
        console.log("Update booking status error:", error);
        res.status(500).json({
            message: "Failed to update booking status",
            error: error.message
        });
    }
});

module.exports = { BookingRouter };

