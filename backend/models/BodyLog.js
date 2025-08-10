// models/BodyLog.js
const mongoose = require('mongoose');

const bodyLogSchema = new mongoose.Schema({
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
    measurements: {
        weight: { type: Number, min: 0 },
        body_fat: { type: Number, min: 0, max: 100 }, // Percentage
        arm_size: { type: Number, min: 0 },
        leg_size: { type: Number, min: 0 },
        chest_size: { type: Number, min: 0 },
        dick_length: { type: Number, min: 0 }, // Optional, no 'required: true'
        girth: { type: Number, min: 0 } // Optional, no 'required: true'
    }
}, { timestamps: true });

bodyLogSchema.index({ user_id: 1, date: -1 });

module.exports = mongoose.model('BodyLog', bodyLogSchema);