// routes/user.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
//loads the mongoose model into a constant called "User"
//This User object is the primary tool for interacting with the users collection in MongoDB
// we can use it to perform creating, reading, updating and deleting user documents.
const User = require('../models/User'); 
// @route   GET /api/user/profile
// @desc    Get current user's profile and goals
// @access  Private
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/user/profile
// @desc    Update user's profile details (age, gender, goal)
// @access  Private
router.put('/profile', auth, async (req, res) => {
    const { age, gender, goal } = req.body;

    const profileFields = {};
    if (age !== undefined) profileFields['profile.age'] = age;
    if (gender !== undefined) profileFields['profile.gender'] = gender;
    if (goal !== undefined) profileFields['profile.goal'] = goal;

    try {
        let user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: profileFields },
            { new: true, runValidators: true } // Return the updated document and run schema validators
        ).select('-password');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/user/goals
// @desc    Update user's nutritional goals
// @access  Private
router.put('/goals', auth, async (req, res) => {
    const { calories, protein, fiber, vitamins } = req.body;

    const goalsFields = {};
    if (calories !== undefined) goalsFields['goals.calories'] = calories;
    if (protein !== undefined) goalsFields['goals.protein'] = protein;
    if (fiber !== undefined) goalsFields['goals.fiber'] = fiber;
    if (vitamins !== undefined) goalsFields['goals.vitamins'] = vitamins;

    try {
        let user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: goalsFields },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/user/integrations/:type
// @desc    Update status of third-party integrations (e.g., Apple Health, Google Fit)
// @access  Private
router.put('/integrations/:type', auth, async (req, res) => {
    const { type } = req.params; // 'apple_health' or 'google_fit'
    const { status } = req.body; // 'connected' or 'disconnected'

    if (!['apple_health', 'google_fit'].includes(type)) {
        return res.status(400).json({ msg: 'Invalid integration type' });
    }
    if (!['connected', 'disconnected'].includes(status)) {
        return res.status(400).json({ msg: 'Invalid status' });
    }

    try {
        const updateField = `integrations.${type}_status`;
        let user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { [updateField]: status } },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(user.integrations); // Return only the integrations object
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/user
// @desc    Delete current user's account and all associated data
// @access  Private
router.delete('/', auth, async (req, res) => {
    try {
        // Find user by the ID from the token and delete it.
        // The 'pre' hook on the User model will handle deleting associated logs.
        const user = await User.findByIdAndDelete(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json({ msg: 'User account deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;