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
        default:3,
    }
}, {
    timestamps: true,
});

const Queue = mongoose.model('Queue', queueSchema);

module.exports = Queue;
