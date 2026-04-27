const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    rewards: {
        enabled: { type: Boolean, default: true },
        pointsPerOrder: { type: Number, default: 10 }, // per 100 rupees
        pointsExpiryDays: { type: Number, default: 365 }
    },
    payments: {
        onlineEnabled: { type: Boolean, default: true },
        onlineExpiryDate: { type: Date },
        upiId: { type: String, default: "yourname@upi" },
        qrCode: { type: String, default: "" }
    }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
