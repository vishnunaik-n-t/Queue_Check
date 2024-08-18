const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');

router.post('/add', verifyToken, (req, res) => {
  // This route will only be accessible if the user is authenticated
  // Handle shop creation logic here
});

module.exports = router;
