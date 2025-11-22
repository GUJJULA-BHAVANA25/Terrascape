const { Router } = require("express");
const { PlantModel, UserScheduleModel } = require("../db");
const { authenticateToken } = require("../Middleware/UserMiddleware");

const SchedulerRouter = Router();

// Get watering/fertilizer schedule - POST /api/scheduler/recommend
SchedulerRouter.post("/recommend", async function (req, res) {
    try {
        const { city, climate, plantTypes, potSize } = req.body;

        // Find matching plants
        const plants = await PlantModel.find({
            type: { $in: plantTypes },
            $or: [
                { climate: { $in: [city, climate] } },
                { climate: [] } // Plants that work in all climates
            ],
            $or: [
                { 'potSize.min': { $lte: potSize } },
                { 'potSize.max': { $gte: potSize } }
            ]
        });

        // Generate schedule based on current season (simplified - you can enhance with actual date logic)
        const currentMonth = new Date().getMonth();
        let season = 'winter';
        if (currentMonth >= 2 && currentMonth <= 4) season = 'summer';
        else if (currentMonth >= 5 && currentMonth <= 8) season = 'monsoon';

        const recommendations = plants.map(plant => {
            const watering = plant.wateringFrequency[season] || plant.wateringFrequency.summer;
            return {
                plantId: plant._id,
                plantName: plant.name,
                plantType: plant.type,
                wateringSchedule: {
                    frequency: watering.frequency,
                    time: watering.time,
                    nextWatering: new Date() // Calculate based on frequency
                },
                fertilizerSchedule: {
                    frequency: plant.fertilizerSchedule.frequency,
                    fertilizerType: plant.fertilizerSchedule.fertilizerType,
                    nextFertilizing: new Date() // Calculate based on frequency
                }
            };
        });

        res.json({
            city,
            climate,
            season,
            recommendations
        });
    } catch (error) {
        console.log("Get schedule error:", error);
        res.status(500).json({
            message: "Failed to generate schedule",
            error: error.message
        });
    }
});

// Save user schedule - POST /api/scheduler/save
SchedulerRouter.post("/save", authenticateToken, async function (req, res) {
    try {
        const { city, climate, plants } = req.body;

        const schedule = await UserScheduleModel.create({
            userId: req.user.userId,
            city,
            climate,
            plants
        });

        res.status(201).json({
            message: "Schedule saved successfully",
            schedule
        });
    } catch (error) {
        console.log("Save schedule error:", error);
        res.status(500).json({
            message: "Failed to save schedule",
            error: error.message
        });
    }
});

// Get user's saved schedules - GET /api/scheduler
SchedulerRouter.get("/", authenticateToken, async function (req, res) {
    try {
        const schedules = await UserScheduleModel.find({ userId: req.user.userId })
            .populate('plants.plantId')
            .sort({ createdAt: -1 });
        res.json({ schedules });
    } catch (error) {
        console.log("Get schedules error:", error);
        res.status(500).json({
            message: "Failed to fetch schedules",
            error: error.message
        });
    }
});

// Get all plants - GET /api/scheduler/plants
SchedulerRouter.get("/plants", async function (req, res) {
    try {
        const plants = await PlantModel.find();
        res.json({ plants });
    } catch (error) {
        console.log("Get plants error:", error);
        res.status(500).json({
            message: "Failed to fetch plants",
            error: error.message
        });
    }
});

module.exports = { SchedulerRouter };

