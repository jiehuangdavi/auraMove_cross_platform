// models/FoodLog.js
const mongoose = require('mongoose');

const foodLogSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    meal_type: { // e.g., "Breakfast", "Lunch", "Dinner", "Snack"
        type: String,
        enum: ['breakfast', 'lunch', 'dinner', 'snack', 'other'],
        lowercase: true,
        required: true
    },
    foods: [{ // Array of food items for that meal
        name: { type: String, required: true, trim: true },
        calories: { type: Number, min: 0 },
        protein: { type: Number, min: 0 },
        fiber: { type: Number, min: 0 },
        vitamins: String // High-level description for now
    }]
}, { timestamps: true });

foodLogSchema.index({ user_id: 1, date: -1 });

module.exports = mongoose.model('FoodLog', foodLogSchema);