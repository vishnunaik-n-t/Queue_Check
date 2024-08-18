// middlewares/validationMiddleware.js

const validateRegister = (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    next(); // Move to the next middleware/route handler
  };
  
  module.exports = { validateRegister };
  