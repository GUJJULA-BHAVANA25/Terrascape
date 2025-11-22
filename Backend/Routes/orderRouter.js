const { Router } = require("express");
const { OrderModel, ProductModel } = require("../db");
const { authenticateToken, authorizeRoles } = require("../Middleware/UserMiddleware");

const OrderRouter = Router();

// Create order - POST /api/orders
OrderRouter.post("/", authenticateToken, async function (req, res) {
    try {
        const { items, shippingAddress } = req.body;

        // Validate items and calculate total
        let totalAmount = 0;
        for (const item of items) {
            const product = await ProductModel.findById(item.productId);
            if (!product || !product.isActive) {
                return res.status(400).json({ message: `Product ${item.productId} not found or inactive` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
            }
            totalAmount += product.price * item.quantity;
        }

        // Prepare items with prices
        const orderItems = [];
        for (const item of items) {
            const product = await ProductModel.findById(item.productId);
            orderItems.push({
                productId: item.productId,
                quantity: item.quantity,
                price: product.price
            });
        }

        const order = await OrderModel.create({
            userId: req.user.userId,
            items: orderItems,
            totalAmount,
            shippingAddress,
            status: 'pending',
            paymentStatus: 'pending'
        });

        // Update stock
        for (const item of items) {
            await ProductModel.findByIdAndUpdate(item.productId, {
                $inc: { stock: -item.quantity }
            });
        }

        res.status(201).json({
            message: "Order created successfully",
            order
        });
    } catch (error) {
        console.log("Create order error:", error);
        res.status(500).json({
            message: "Failed to create order",
            error: error.message
        });
    }
});

// Get user's orders - GET /api/orders
OrderRouter.get("/", authenticateToken, async function (req, res) {
    try {
        const filter = {};
        if (req.user.role !== 'admin') {
            filter.userId = req.user.userId;
        }

        const orders = await OrderModel.find(filter)
            .populate('items.productId')
            .sort({ createdAt: -1 });
        res.json({ orders });
    } catch (error) {
        console.log("Get orders error:", error);
        res.status(500).json({
            message: "Failed to fetch orders",
            error: error.message
        });
    }
});

// Get order by ID - GET /api/orders/:id
OrderRouter.get("/:id", authenticateToken, async function (req, res) {
    try {
        const order = await OrderModel.findById(req.params.id).populate('items.productId');
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (req.user.role !== 'admin' && order.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.json({ order });
    } catch (error) {
        console.log("Get order error:", error);
        res.status(500).json({
            message: "Failed to fetch order",
            error: error.message
        });
    }
});

// Update order status (Admin only) - PATCH /api/orders/:id/status
OrderRouter.patch("/:id/status", authenticateToken, authorizeRoles('admin'), async function (req, res) {
    try {
        const { status } = req.body;
        if (!['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const order = await OrderModel.findByIdAndUpdate(
            req.params.id,
            { status, updatedAt: new Date() },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json({
            message: "Order status updated successfully",
            order
        });
    } catch (error) {
        console.log("Update order status error:", error);
        res.status(500).json({
            message: "Failed to update order status",
            error: error.message
        });
    }
});

module.exports = { OrderRouter };

