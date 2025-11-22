const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../db");
const { authenticateToken } = require("../Middleware/UserMiddleware");

const AuthRouter = Router();

// Register - POST /api/auth/register
AuthRouter.post("/register", async function (req, res) {
    try {
        const { email, password, firstName, lastName, role, address, terraceSize, preferences, phone } = req.body;

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user
        const user = await UserModel.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role: role || 'user',
            address,
            terraceSize,
            preferences,
            phone
        });

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });
    } catch (error) {
        console.log("Registration error:", error);
        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
});

// Login - POST /api/auth/login
AuthRouter.post("/login", async function (req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find user
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                terraceSize: user.terraceSize,
                preferences: user.preferences
            }
        });
    } catch (error) {
        console.log("Login error:", error);
        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
});

// Get current user - GET /api/auth/me
AuthRouter.get("/me", authenticateToken, async function (req, res) {
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

module.exports = { AuthRouter };

