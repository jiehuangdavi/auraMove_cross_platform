// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import User model
const auth = require('../middleware/auth'); // Import auth middleware (for get user by token)
const { generateToken } = require('../utils/jwtHelper');

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
    const { email, password, age, gender, goal } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            email,
            password, // Password will be hashed before saving
            profile: { age, gender, goal },
            // Set default goals and integrations upon registration
            goals: { calories: 2000, protein: 150, fiber: 30, vitamins: 'Balanced' },
            integrations: { apple_health_status: 'disconnected', google_fit_status: 'disconnected' }
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const token = generateToken(user);
        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const token = generateToken(user);
        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/auth
// @desc    Get user by token (useful for client-side re-authentication)
// @access  Private
/*
This block is in a protected route, cannot access directly and need to prove who you are by providing a valid JSON Web Toekn (JWT)
The auth middleware runs first, verifies the JWT from the request header, and attaches the user's ID to req.user.id. This line then uses that ID to fetch the full user document from the database.

*/
router.get('/', auth, async (req, res) => {
    try {
        // req.user.id is populated from the auth middleware
        const user = await User.findById(req.user.id).select('-password'); // Don't return password
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/auth/social
// @desc    Login/Register user with social provider (conceptual)
// @access  Public
router.post('/social', async (req, res) => {
    const { provider, provider_id, email, displayName } = req.body; // Data from client
    try {
        let user = await User.findOne({ 'auth_providers.provider_id': provider_id });

        if (!user) {
            // User doesn't exist, create new one
            user = new User({
                email: email || `${provider_id}@${provider}.com`, // Use a placeholder if no email from provider
                auth_providers: [{ provider, provider_id }],
                // You might ask for age/gender/goal after social login
                profile: { age: null, gender: null, goal: null },
                goals: { calories: 2000, protein: 150, fiber: 30, vitamins: 'Balanced' },
            });
            await user.save();
        }

        // Return JWT for existing or new social user
        const token = generateToken(user);
        res.json({ token, newUser: !user.password }); // Indicate if it's a new user (no password set)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;