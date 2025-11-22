const { Router } = require("express");
const { ImpactMetricsModel, BookingModel, ProjectModel, UserModel, OrderModel } = require("../db");
const { authenticateToken, authorizeRoles } = require("../Middleware/UserMiddleware");

const AnalyticsRouter = Router();

// Get SDG & Impact Analytics - GET /api/analytics/impact
AnalyticsRouter.get("/impact", async function (req, res) {
    try {
        const metrics = await ImpactMetricsModel.find();
        
        const totalArea = metrics.reduce((sum, m) => sum + (m.terraceArea || 0), 0);
        const totalCO2 = metrics.reduce((sum, m) => sum + (m.co2Avoided || 0), 0);
        const totalVegetables = metrics.reduce((sum, m) => sum + (m.vegetablesProduced || 0), 0);
        const avgTempReduction = metrics.length > 0 
            ? metrics.reduce((sum, m) => sum + (m.temperatureReduction || 0), 0) / metrics.length 
            : 0;

        const projects = await ProjectModel.countDocuments();
        const bookings = await BookingModel.countDocuments({ status: { $ne: 'cancelled' } });

        res.json({
            totalTerraceArea: totalArea, // sq.ft
            totalCO2Avoided: totalCO2, // kg
            totalVegetablesProduced: totalVegetables, // kg per month
            averageTemperatureReduction: avgTempReduction, // °C
            totalProjects: projects,
            totalBookings: bookings,
            metrics
        });
    } catch (error) {
        console.log("Get impact analytics error:", error);
        res.status(500).json({
            message: "Failed to fetch impact analytics",
            error: error.message
        });
    }
});

// Get admin dashboard analytics - GET /api/analytics/dashboard
AnalyticsRouter.get("/dashboard", authenticateToken, authorizeRoles('admin'), async function (req, res) {
    try {
        const totalUsers = await UserModel.countDocuments();
        const totalBookings = await BookingModel.countDocuments();
        const pendingBookings = await BookingModel.countDocuments({ status: 'pending' });
        const completedBookings = await BookingModel.countDocuments({ status: 'completed' });
        const totalOrders = await OrderModel.countDocuments();
        const totalRevenue = await OrderModel.aggregate([
            { $match: { paymentStatus: 'completed' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        const recentBookings = await BookingModel.find()
            .populate('userId', 'firstName lastName email')
            .populate('packageId', 'name')
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({
            users: {
                total: totalUsers
            },
            bookings: {
                total: totalBookings,
                pending: pendingBookings,
                completed: completedBookings
            },
            orders: {
                total: totalOrders,
                revenue: totalRevenue[0]?.total || 0
            },
            recentBookings
        });
    } catch (error) {
        console.log("Get dashboard analytics error:", error);
        res.status(500).json({
            message: "Failed to fetch dashboard analytics",
            error: error.message
        });
    }
});

// Create impact metrics - POST /api/analytics/impact
AnalyticsRouter.post("/impact", authenticateToken, authorizeRoles('admin'), async function (req, res) {
    try {
        const metrics = await ImpactMetricsModel.create(req.body);
        res.status(201).json({
            message: "Impact metrics created successfully",
            metrics
        });
    } catch (error) {
        console.log("Create impact metrics error:", error);
        res.status(500).json({
            message: "Failed to create impact metrics",
            error: error.message
        });
    }
});

module.exports = { AnalyticsRouter };

