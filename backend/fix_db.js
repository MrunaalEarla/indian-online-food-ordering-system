const mongoose = require('mongoose');
require('dotenv').config();

const fixIndexes = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const User = mongoose.connection.collection('users');
        
        // Drop the problematic username index if it exists
        try {
            await User.dropIndex("username_1");
            console.log("✅ Dropped old 'username' index successfully.");
        } catch (e) {
            console.log("ℹ️ No 'username' index found, or already dropped.");
        }

        console.log("🚀 Database is now ready for new registrations!");
        process.exit();
    } catch (error) {
        console.error("❌ Error fixing indexes:", error);
        process.exit(1);
    }
};

fixIndexes();
