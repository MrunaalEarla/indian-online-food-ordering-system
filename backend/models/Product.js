const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { 
        type: String, 
        required: true,
        enum: ['Biryani', 'Fried Rice', 'Manchurian', 'Cool Drinks', 'Ice Creams']
    },
    image: { type: String, required: true }, // URL or filename
    isAvailable: { type: Boolean, default: true },
    rating: { type: Number, default: 4.5 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
