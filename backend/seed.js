const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');
const Settings = require('./models/Settings');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const sampleProducts = [
    { name: "Chicken Biryani", price: 250, category: "Biryani", rating: 4.8, isAvailable: true, image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80&w=400" },
    { name: "Veg Fried Rice", price: 150, category: "Fried Rice", rating: 4.2, isAvailable: true, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=400" },
    { name: "Gobi Manchurian", price: 120, category: "Manchurian", rating: 4.5, isAvailable: true, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400" },
    { name: "Egg Manchurian", price: 130, category: "Manchurian", rating: 4.0, isAvailable: false, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=400" },
    { name: "Thums Up (500ml)", price: 40, category: "Cool Drinks", rating: 4.9, isAvailable: true, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400" },
    { name: "Vanilla Ice Cream", price: 80, category: "Ice Creams", rating: 4.6, isAvailable: true, image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&q=80&w=400" }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        // Clear Users and Orders
        console.log("🧹 Cleaning up database...");
        await User.deleteMany({});
        await Order.deleteMany({});
        
        // Products
        await Product.deleteMany({});
        await Product.insertMany(sampleProducts);
        
        // Default Settings
        await Settings.deleteMany({});
        await new Settings().save();

        // New Admin User
        const adminPhone = "8888888888";
        const adminEmail = "admin@indianfood.com";
        const hashedPassword = await bcrypt.hash("admin@2026", 10);
        
        await new User({
            name: "Master Admin",
            phone: adminPhone,
            email: adminEmail,
            password: hashedPassword,
            role: "admin",
            address: "Main Office"
        }).save();

        console.log("✅ Database Reset Successful!");
        console.log("👤 New Admin: admin@indianfood.com / admin@2026");
        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
};

seedDB();
