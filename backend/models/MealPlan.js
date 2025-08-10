// models/MealPlan.js
const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    plan_type: { type: String, enum: ['high_protein', 'low_carb', 'balanced', 'vegetarian', 'vegan'], required: true },
    daily_menus: [{
        day: { type: String, required: true, trim: true }, // e.g., "Monday", "Day 1"
        meals: [{
            meal_type: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'], lowercase: true, required: true },
            food_items: [{
                name: { type: String, required: true, trim: true },
                calories: { type: Number, min: 0 },
                protein: { type: Number, min: 0 },
                fiber: { type: Number, min: 0 },
                vitamins: String // High-level description for now
            }]
        }]
    }]
}, { timestamps: true });

module.exports = mongoose.model('MealPlan', mealPlanSchema);