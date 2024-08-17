const authRoutes = require('./routes/auth');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Middleware
app.use(express.json());

app.use('/api/auth', authRoutes);
// MongoDB connection
mongoose.connect('mongodb://localhost:27017/queue_check', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Sample route
app.get('/', (req, res) => {
    res.send('QueueCheck Backend is Running!');
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


