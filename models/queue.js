const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema({
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true,
    },
    currentQueue: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['Open', 'Closed'],
        default: 'Open',
    },
    estimatedTimePerCustomer: {
        type: Number, // in minutes
        required: true,
        default: 5, // Default to 10 minutes per customer
    }
}, {
    timestamps: true,
});

const Queue = mongoose.model('Queue', queueSchema);

module.exports = Queue;
