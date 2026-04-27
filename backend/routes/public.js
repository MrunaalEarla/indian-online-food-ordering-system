const express = require('express');
const Settings = require('../models/Settings');
const router = express.Router();

router.get('/settings', async (req, res) => {
    try {
        console.log("📡 Public settings requested");
        let settings = await Settings.findOne();
        if (!settings) settings = new Settings();
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
