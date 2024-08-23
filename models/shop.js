// models/Shop.js
const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
    shopOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    shopName: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Open', 'Closed'],
        default: 'Open'
    },
    estimatedTimePerCustomer: {
        type: Number, // in minutes
        default: 5, // Default to 10 minutes per customer
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Shop', ShopSchema);
