
// 'mongoose' is an ODM (Object Data Modeling) library for MongoDB and Node.js.
// It helps manage relationships between data, provides schema validation, etc.
const mongoose = require('mongoose');
// Enable Mongoose debug mode to see database operations in the console
mongoose.set('debug', true);
const connectDB = async () => {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      console.error('Error: MONGO_URI is not defined. Please set it in your .env file.');
      process.exit(1);
    }
    try {
        await mongoose.connect(mongoURI, {
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;