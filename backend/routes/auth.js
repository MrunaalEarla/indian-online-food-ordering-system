const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Multer Storage for Profile Pictures
const fs = require('fs');
const uploadDir = path.join(__dirname, '../uploads/profiles');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, phone, email, password, address, role } = req.body;
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        let user = await User.findOne({ $or: [{ phone }, { email }] });
        if (user) {
            const message = user.phone === phone ? 'Phone number already registered' : 'Email already registered';
            return res.status(400).json({ message });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ name, phone, email, password: hashedPassword, address, role });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { identifier, password } = req.body; // identifier can be phone or email
        const user = await User.findOne({ 
            $or: [{ phone: identifier }, { email: identifier }] 
        });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Track Last Login
        user.lastLogin = new Date();
        await user.save();

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: { 
                id: user._id, 
                name: user.name, 
                role: user.role, 
                points: user.points,
                profilePic: user.profilePic,
                phone: user.phone,
                email: user.email,
                address: user.address
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Current User Profile
router.get('/profile', auth(), async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update Profile
router.put('/profile', auth(), upload.single('profilePic'), async (req, res) => {
    try {
        console.log("👤 Profile Update Request for User ID:", req.user.id);
        console.log("📦 Request Body:", req.body);
        
        const { name, phone, email, address } = req.body;
        const updateData = { name, phone, email, address };

        if (req.file) {
            console.log("🖼️ New Profile Picture:", req.file.filename);
            updateData.profilePic = `/uploads/profiles/${req.file.filename}`;
        }

        const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true, runValidators: true }).select('-password');
        
        if (!user) {
            console.warn("❌ User not found for ID:", req.user.id);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log("✅ Profile Updated Successfully for:", user.name);
        res.json(user);
    } catch (err) {
        console.error("❌ Profile Update Error:", err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
