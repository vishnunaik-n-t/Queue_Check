const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) return res.status(401).json({ message: 'Access Denied. No Token Provided.' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next(); // Move to the next middleware/route handler
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};

module.exports = verifyToken;
