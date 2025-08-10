// routes/content.js
const express = require('express');
const router = express.Router();
const PreDesignedWorkout = require('../models/PreDesignedWorkout');
const MealPlan = require('../models/MealPlan');
// No 'auth' middleware here if you want these to be publicly accessible,
// or add it if only logged-in users can view content.

// --- Pre-designed Workouts ---

// @route   GET /api/content/workouts
// @desc    Get all pre-designed workout programs
// @access  Public (or Private if using auth middleware)
router.get('/workouts', async (req, res) => {
    try {
        const workouts = await PreDesignedWorkout.find({});
        res.json(workouts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/content/workouts/:id
// @desc    Get a specific pre-designed workout program by ID
// @access  Public (or Private)
router.get('/workouts/:id', async (req, res) => {
    try {
        const workout = await PreDesignedWorkout.findById(req.params.id);
        if (!workout) {
            return res.status(404).json({ msg: 'Workout program not found' });
        }
        res.json(workout);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/content/workouts (for admin to add new programs)
// @desc    Add a new pre-designed workout program
// @access  Private (Admin only - for testing, but in production, restrict heavily)
router.post('/workouts', async (req, res) => {
    // In a real app, this route should be protected by an admin-level auth middleware
    try {
        const newWorkout = new PreDesignedWorkout(req.body);
        const workout = await newWorkout.save();
        res.status(201).json(workout);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// --- Meal Plans ---

// @route   GET /api/content/meal-plans
// @desc    Get all pre-designed meal plans
// @access  Public (or Private)
router.get('/meal-plans', async (req, res) => {
    try {
        const mealPlans = await MealPlan.find({});
        res.json(mealPlans);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/content/meal-plans/:id
// @desc    Get a specific meal plan by ID
// @access  Public (or Private)
router.get('/meal-plans/:id', async (req, res) => {
    try {
        const mealPlan = await MealPlan.findById(req.params.id);
        if (!mealPlan) {
            return res.status(404).json({ msg: 'Meal plan not found' });
        }
        res.json(mealPlan);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/content/meal-plans (for admin to add new plans)
// @desc    Add a new pre-designed meal plan
// @access  Private (Admin only)
router.post('/meal-plans', async (req, res) => {
    // In a real app, this route should be protected by an admin-level auth middleware
    try {
        const newMealPlan = new MealPlan(req.body);
        const mealPlan = await newMealPlan.save();
        res.status(201).json(mealPlan);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;