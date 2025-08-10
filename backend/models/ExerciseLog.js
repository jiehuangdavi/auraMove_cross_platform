// models/ExerciseLog.js
const mongoose = require('mongoose');

const exerciseLogSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now // Default to current date if not provided
    },
    exercises: [{ // Array of exercise objects for that day
        name: { type: String, required: true, trim: true },
        weight: { type: Number, min: 0 }, // Weight used (e.g., in kg or lbs)
        reps: { type: Number, min: 0 },
        sets: { type: Number, min: 0 }
    }]
}, { timestamps: true });

// Add an index for faster querying by user and date
exerciseLogSchema.index({ user_id: 1, date: -1 });

module.exports = mongoose.model('ExerciseLog', exerciseLogSchema);