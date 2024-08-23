const express = require('express');
const router = express.Router();
const Queue = require('../models/queue');
const { protect } = require('../middlewares/authMiddleware');

// Shop owner creates or updates queue
router.post('/manage', protect, async (req, res) => {
    const { shopId, currentQueue, status } = req.body;

    try {
        // Find the queue for the shop
        let queue = await Queue.findOne({ shop: shopId });

        if (queue) {
            // Update existing queue
            queue.currentQueue = currentQueue;
            queue.status = status;
            await queue.save();
        } else {
            // Create new queue for the shop
            queue = new Queue({
                shop: shopId,
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
        const queue = await Queue.findOne({ shop: req.params.shopId });

        if (!queue) {
            return res.status(404).json({ message: 'Queue not found for this shop' });
        }

        res.status(200).json(queue);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
