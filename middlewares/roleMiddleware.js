// middlewares/roleMiddleware.js
const isShopOwner = (req, res, next) => {
    if (req.user && req.user.role === 'shopOwner') {
        next();  // User is a shop owner, proceed to the next middleware
    } else {
        res.status(403).json({ message: 'Access denied. Only shop owners can perform this action.' });
    }
};

module.exports = { isShopOwner };
