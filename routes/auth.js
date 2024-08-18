const express = require('express');
const router = express.Router();
const { validateRegister } = require('../middlewares/validationMiddleware');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// const testPassword = '12345'; // Example plaintext password
// const testHash = '$2a$10$XQ69nQvNa2nG47WQDuUZ2OUldKirpS.5xcyKgOgAhAtzAObrI8WM.'; // Example hash
// const isMatch =  bcrypt.compare(testPassword, testHash);
// console.log(isMatch); // Should print `true`


// Register route
router.post('/register', validateRegister, async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password before saving the user
        const salt = await bcrypt.genSalt(10); // Generate salt for hashing
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

        // Create a new user with the hashed password
        const user = new User({ 
            username, 
            password: hashedPassword // Store the hashed password
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found');
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch);
        if (!isMatch) {
            console.log('Password does not match');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
