// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please fill a valid email address']
    },
    password: { // Store hashed password
        type: String,
        required: true
    },
    auth_providers: [{
        provider: { type: String, enum: ['google', 'apple', 'meta'] },
        provider_id: { type: String, required: true },
        // You might store other provider-specific tokens/data here if needed
    }],
    profile: {
        age: { type: Number, min: 1, max: 120 },
        gender: { type: String, enum: ['male', 'female', 'other', 'prefer_not_to_say'] },
        goal: { type: String, enum: ['muscle_gain', 'losing_weight', 'become_muscular', 'maintain_fitness', 'improve_endurance', 'other'] }
    },
    goals: { // Daily nutritional goals
        calories: { type: Number, min: 0 },
        protein: { type: Number, min: 0 },
        fiber: { type: Number, min: 0 },
        vitamins: String // This could be more structured, e.g., an array of objects { name: String, amount: Number }
    },
    integrations: {
        apple_health_status: { type: String, default: 'disconnected', enum: ['connected', 'disconnected'] },
        google_fit_status: { type: String, default: 'disconnected', enum: ['connected', 'disconnected'] }
    }
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

// Mongoose middleware to cascade delete logs when a user is deleted.
// This hook will run before a `findOneAndDelete()`-style query is executed.
// `findByIdAndDelete()` triggers this hook.
userSchema.pre('findOneAndDelete', { document: false, query: true }, async function (next) {
    // `this` is the Mongoose Query object. We get the user document before it's deleted.
    const doc = await this.model.findOne(this.getFilter()).select('_id');
    if (doc) {
        const userId = doc._id;
        // Use mongoose.model() to avoid circular dependency issues with require()
        const ExerciseLog = mongoose.model('ExerciseLog');
        const FoodLog = mongoose.model('FoodLog');
        const BodyLog = mongoose.model('BodyLog');

        // Delete all logs associated with this user in parallel
        await Promise.all([
            ExerciseLog.deleteMany({ user_id: userId }),
            FoodLog.deleteMany({ user_id: userId }),
            BodyLog.deleteMany({ user_id: userId })
        ]);
    }
    next();
});

module.exports = mongoose.model('User', userSchema);