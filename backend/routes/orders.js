const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User');
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const fs = require('fs');

// Ensure upload directory exists
const uploadDir = 'uploads/payments';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Setup for Payment Screenshots
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Create Order
router.post('/', auth(['customer']), upload.single('paymentScreenshot'), async (req, res) => {
    try {
        console.log("📦 Incoming Order Data:", req.body);
        if (req.file) console.log("🖼️ File Uploaded:", req.file.filename);

        const { items, totalAmount, pointsRedeemed, address, paymentMethod } = req.body;
        const userId = req.user.id;

        // Convert strings to Numbers
        const numTotalAmount = Number(totalAmount);
        const numPointsRedeemed = Number(pointsRedeemed || 0);

        // JSON parse items if they come as string from FormData
        const parsedItems = typeof items === 'string' ? JSON.parse(items) : items;

        let settings = await Settings.findOne();
        if (!settings) settings = new Settings();

        let pointsEarned = 0;
        if (settings.rewards.enabled) {
            pointsEarned = Math.floor(numTotalAmount * (settings.rewards.pointsPerOrder / 100));
        }

        const orderData = {
            userId,
            items: parsedItems,
            totalAmount: numTotalAmount,
            pointsEarned,
            pointsRedeemed: numPointsRedeemed,
            address,
            paymentMethod,
            paymentStatus: paymentMethod === 'Online' ? 'Awaiting Verification' : 'Pending'
        };

        if (req.file) {
            orderData.paymentScreenshot = req.file.filename;
        }

        const order = new Order(orderData);
        await order.save();

        // Update User's reward points
        const user = await User.findById(userId);
        if (user) {
            user.points = (user.points - numPointsRedeemed) + pointsEarned;
            await user.save();
        }

        res.status(201).json(order);
    } catch (err) {
        console.error("Order Creation Error:", err);
        res.status(400).json({ message: err.message });
    }
});

// Get My Orders
router.get('/myorders', auth(['customer', 'admin']), async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get All Orders (Admin)
router.get('/all', auth(['admin', 'delivery']), async (req, res) => {
    try {
        const orders = await Order.find().populate('userId', 'name phone').sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update Order Status
router.patch('/:id/status', auth(['admin', 'delivery']), async (req, res) => {
    try {
        const { status, paymentStatus } = req.body;
        const updateData = {};
        if (status) updateData.status = status;
        if (paymentStatus) updateData.paymentStatus = paymentStatus;

        const order = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(order);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
