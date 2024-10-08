const express = require('express');
const router = express.Router();
const Queue = require('../models/queue');
const Shop = require('../models/shop');
const { protect } = require('../middlewares/authMiddleware');

// Shop owner creates or updates queue
router.post('/manage', protect, async (req, res) => {
    const { shopName, currentQueue, status } = req.body;

    try {
        // Find the shop by its name
        const shop = await Shop.findOne({ shopName });

        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        // Find the queue for the shop
        let queue = await Queue.findOne({ shop: shop._id });

        if (queue) {
            // Update existing queue
            queue.currentQueue = currentQueue;
            queue.status = status;
            await queue.save();
        } else {
            // Create new queue for the shop
            queue = new Queue({
                shop: shop._id,
                currentQueue,
                status,
            });
            await queue.save();
        }

        res.status(200).json(queue);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});


// Get queue details for a shop
router.get('/:shopId', async (req, res) => {
    try {
        const queue = await Queue.findOne({ shop: req.params.shopId }).populate('shop');

        if (!queue) {
            return res.status(404).json({ message: 'Queue not found for this shop' });
        }

        const estimatedWaitTime = queue.currentQueue * queue.estimatedTimePerCustomer;

        res.status(200).json({
            shopName: queue.shop.shopName,
            currentQueue: queue.currentQueue,
            estimatedTimePerCustomer: queue.estimatedTimePerCustomer,
            estimatedWaitTime, // in minutes
            status: queue.status,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
