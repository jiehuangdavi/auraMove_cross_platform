// models/PreDesignedWorkout.js
const mongoose = require('mongoose');

const preDesignedWorkoutSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    program_type: { type: String, enum: ['weight_loss', 'muscle_gain', 'improve_endurance', 'general_fitness'], required: true },
    duration_weeks: { type: Number, min: 1 },
    routines: [{ // Array of daily or session-based routines
        day: { type: String, required: true, trim: true }, // e.g., "Monday", "Day 1"
        exercises: [{
            name: { type: String, required: true, trim: true },
            sets: { type: Number, min: 1 },
            reps: { type: Number, min: 1 },
            rest_seconds: { type: Number, min: 0, default: 60 } // Optional: suggested rest time
        }]
    }]
}, { timestamps: true });

module.exports = mongoose.model('PreDesignedWorkout', preDesignedWorkoutSchema);