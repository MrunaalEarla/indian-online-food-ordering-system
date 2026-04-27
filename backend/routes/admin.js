const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');
const router = express.Router();

// Get Admin Stats
router.get('/stats', auth(['admin']), async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'customer' });
        const totalOrders = await Order.countDocuments();
        const activeUsers = await User.countDocuments({ 
            lastLogin: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } 
        });
        
        const revenueData = await Order.aggregate([
            { $match: { status: 'Delivered' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueData[0]?.total || 0;

        const dailyOrders = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 },
                    revenue: { $sum: "$totalAmount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const mostOrdered = await Order.aggregate([
            { $unwind: "$items" },
            { $group: { _id: "$items.name", count: { $sum: "$items.quantity" } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        const userGrowth = await User.aggregate([
            {
                $match: { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            totalUsers,
            totalOrders,
            activeUsers,
            totalRevenue,
            dailyOrders,
            mostOrdered,
            userGrowth
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Settings Management
router.get('/settings', auth(['admin']), async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings();
            await settings.save();
        }
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/settings';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `payment_qr_${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });

router.post('/settings', auth(['admin']), upload.single('qrCode'), async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) settings = new Settings();
        
        console.log("⚙️ Settings Update Request. Body keys:", Object.keys(req.body));
        if (req.file) console.log("🖼️ Settings QR Uploaded:", req.file.filename);

        // Parse JSON if data is sent as FormData string
        let rewards = req.body.rewards;
        let payments = req.body.payments;

        if (typeof rewards === 'string') {
            try { rewards = JSON.parse(rewards); } catch (e) { console.error("Error parsing rewards:", e); }
        }
        if (typeof payments === 'string') {
            try { payments = JSON.parse(payments); } catch (e) { console.error("Error parsing payments:", e); }
        }

        if (rewards) settings.rewards = rewards;
        if (payments) {
            // Merge payments to preserve qrCode if not uploading new one
            settings.payments = { ...settings.payments.toObject(), ...payments };
        }
        
        if (req.file) {
            settings.payments.qrCode = `/uploads/settings/${req.file.filename}`;
        }
        
        await settings.save();
        console.log("✅ Settings Updated Successfully");
        res.json(settings);
    } catch (err) {
        console.error("Settings Update Error:", err);
        res.status(500).json({ message: err.message });
    }
});

// Get User Tracking
router.get('/users/tracking', auth(['admin']), async (req, res) => {
    try {
        const users = await User.aggregate([
            { $match: { role: 'customer' } },
            {
                $lookup: {
                    from: 'orders',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'orders'
                }
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    phone: 1,
                    points: 1,
                    lastLogin: 1,
                    totalOrders: { $size: "$orders" },
                    totalSpent: { $sum: "$orders.totalAmount" }
                }
            }
        ]);
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
