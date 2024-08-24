// routes/shopRoutes.js
const express = require('express');
const router = express.Router();
const Shop = require('../models/shop');
const Queue = require('../models/queue');
const { protect } = require('../middlewares/authMiddleware');
const { isShopOwner } = require('../middlewares/roleMiddleware');

// Create or Update Shop
router.post('/manage', protect, isShopOwner, async (req, res) => {
    const { shopName, location, status, estimatedTimePerCustomer } = req.body;

    try {
        let shop = await Shop.findOne({ shopOwner: req.user._id });

        if (shop) {
            // Update existing shop
            shop.shopName = shopName;
            shop.location = location;
            shop.status = status;
            shop.updatedAt = Date.now();
            let queue = await Queue.findOne({ shop: shop._id });
            if (queue) {
                shop.estimatedTimePerCustomer = estimatedTimePerCustomer;
                queue.estimatedTimePerCustomer = estimatedTimePerCustomer;
                queue.status = status;
                await queue.save();
            }else {
                // Create a new queue entry if it does not exist
                queue = new Queue({
                    shop: shop._id,
                    estimatedTimePerCustomer,
                });
                await queue.save();
            }
            await shop.save();
            res.status(200).json({ message: 'Shop updated successfully', shop });
        } else {
            // Create new shop
            shop = new Shop({
                shopOwner: req.user._id,
                shopName,
                location,
                status
            });

            const queue = new Queue({
                shop: shop._id,
                estimatedTimePerCustomer,
            });
            await shop.save();
            await queue.save();
            res.status(201).json({ message: 'Shop created successfully', shop });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/search', async (req, res) => {
    const { location } = req.query;

    try {
        // Find shops that match the location
        const shops = await Shop.find({ location: new RegExp(location, 'i') }); // Case-insensitive search

        if (!shops.length) {
            return res.status(404).json({ message: 'No shops found in this location' });
        }

        res.status(200).json(shops);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

 
router.get('/my-shop', protect, isShopOwner, async (req, res) => {
    try {
        const shop = await Shop.findOne({ shopOwner: req.user._id });

        if (!shop) {
            return res.status(404).json({ message: 'No shop found for this owner' });
        }

        res.status(200).json(shop);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// routes/shopRoutes.js
router.delete('/delete', protect, isShopOwner, async (req, res) => {
    try {
        const shop = await Shop.findOneAndDelete({ shopOwner: req.user._id });

        if (!shop) {
            return res.status(404).json({ message: 'No shop found for this owner' });
        }

        res.status(200).json({ message: 'Shop deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


module.exports = router;

