// server.js
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors'); // For cross-origin requests
require('dotenv').config();

const app = express();

// Check for essential environment variables on startup
if (!process.env.JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined in .env file.');
    process.exit(1);
}

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false })); // Allows parsing of JSON request bodies
app.use(cors()); // Enable CORS for all origins, you might want to restrict this in production

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/User'));
app.use('/api/logs', require('./routes/logs'));
app.use('/api/content', require('./routes/content'));

// Basic route for testing
app.get('/', (req, res) => {
    res.send('Fitness App API is running');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));