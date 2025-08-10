// routes/logs.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ExerciseLog = require('../models/ExerciseLog');
const FoodLog = require('../models/FoodLog');
const BodyLog = require('../models/BodyLog');
// The endpoints in this log are all private, they require an authentication token to be accessed. 
// --- Exercise Logs ---

// @route   POST /api/logs/exercises
// @desc    Add a new exercise log for the current user
// @access  Private
router.post('/exercises', auth, async (req, res) => {
    const { date, exercises } = req.body;
    try {
        const newLog = new ExerciseLog({
            user_id: req.user.id,
            date: date ? new Date(date) : new Date(), // Use provided date or current
            exercises
        });
        const log = await newLog.save();
        res.status(201).json(log);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/logs/exercises
// @desc    Get exercise logs for the current user, optionally by date range
// @access  Private
router.get('/exercises', auth, async (req, res) => {
    try {
        const { startDate, endDate } = req.query; // Query params: /api/logs/exercises?startDate=2024-01-01&endDate=2024-01-31
        let query = { user_id: req.user.id };

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const logs = await ExerciseLog.find(query).sort({ date: -1 }); // Sort by most recent first
        res.json(logs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/logs/exercises/:id
// @desc    Update a specific exercise log
// @access  Private
router.put('/exercises/:id', auth, async (req, res) => {
    const { date, exercises } = req.body;

    // Build the update object dynamically based on what was provided
    const updateFields = {};
    if (date) updateFields.date = new Date(date);
    if (exercises) updateFields.exercises = exercises;

    try {
        // Find the log by its ID and ensure it belongs to the current user, then update it.
        // This is an atomic operation.
        const log = await ExerciseLog.findOneAndUpdate(
            { _id: req.params.id, user_id: req.user.id }, // Condition to find the doc
            { $set: updateFields }, // The update to apply
            { new: true, runValidators: true } // Options: return the new doc, run schema validators
        );

        if (!log) {
            // This will be null if the log doesn't exist OR if the user_id doesn't match.
            return res.status(404).json({ msg: 'Log not found or user not authorized' });
        }

        res.json(log);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Log not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/logs/exercises/:id
// @desc    Delete a specific exercise log
// @access  Private
router.delete('/exercises/:id', auth, async (req, res) => {
    try {
        const log = await ExerciseLog.findById(req.params.id);

        if (!log) return res.status(404).json({ msg: 'Exercise log not found' });
        if (log.user_id.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await ExerciseLog.deleteOne({ _id: req.params.id }); // Use deleteOne
        res.json({ msg: 'Exercise log removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- Food Logs ---

// @route   POST /api/logs/foods
// @desc    Add a new food log for the current user
// @access  Private
router.post('/foods', auth, async (req, res) => {
    const { date, meal_type, foods } = req.body;
    try {
        const newLog = new FoodLog({
            user_id: req.user.id,
            date: date ? new Date(date) : new Date(),
            meal_type,
            foods
        });
        const log = await newLog.save();
        res.status(201).json(log);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/logs/foods
// @desc    Get food logs for the current user, optionally by date range and meal type
// @access  Private
router.get('/foods', auth, async (req, res) => {
    try {
        const { startDate, endDate, mealType } = req.query;
        let query = { user_id: req.user.id };

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }
        if (mealType) {
            query.meal_type = mealType.toLowerCase();
        }

        const logs = await FoodLog.find(query).sort({ date: -1, meal_type: 1 });
        res.json(logs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- Body Logs ---

// @route   POST /api/logs/body
// @desc    Add a new body measurement log for the current user
// @access  Private
router.post('/body', auth, async (req, res) => {
    const { date, measurements } = req.body;
    try {
        const newLog = new BodyLog({
            user_id: req.user.id,
            date: date ? new Date(date) : new Date(),
            measurements
        });
        const log = await newLog.save();
        res.status(201).json(log);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/logs/body
// @desc    Get body measurement logs for the current user, optionally by date range
// @access  Private
router.get('/body', auth, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let query = { user_id: req.user.id };

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const logs = await BodyLog.find(query).sort({ date: -1 });
        res.json(logs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;