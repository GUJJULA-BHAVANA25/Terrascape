const jwt = require("jsonwebtoken");
const { UserModel } = require("../db");

// Authentication middleware - verifies JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: "Access token required" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }
        req.user = user;
        next();
    });
}

// Role-based authorization middleware
function authorizeRoles(...roles) {
    return async (req, res, next) => {
        try {
            const user = await UserModel.findById(req.user.userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            if (!roles.includes(user.role)) {
                return res.status(403).json({ message: "Access denied. Insufficient permissions." });
            }
            req.userRole = user.role;
            next();
        } catch (error) {
            res.status(500).json({ message: "Authorization error", error: error.message });
        }
    };
}

// Optional: Middleware to check if user owns resource or is admin
async function checkOwnershipOrAdmin(model, idParam = 'id') {
    return async (req, res, next) => {
        try {
            const resource = await model.findById(req.params[idParam]);
            if (!resource) {
                return res.status(404).json({ message: "Resource not found" });
            }
            
            const user = await UserModel.findById(req.user.userId);
            if (user.role === 'admin' || resource.userId?.toString() === req.user.userId) {
                next();
            } else {
                res.status(403).json({ message: "Access denied" });
            }
        } catch (error) {
            res.status(500).json({ message: "Authorization error", error: error.message });
        }
    };
}

module.exports = {
    authenticateToken,
    authorizeRoles,
    checkOwnershipOrAdmin
};
