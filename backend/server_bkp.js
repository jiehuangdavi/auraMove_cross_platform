// --- 1. Import Dependencies ---
// 'express' is the web framework for Node.js
const express = require('express');
// 'mongoose' is an ODM (Object Data Modeling) library for MongoDB and Node.js.
// It helps manage relationships between data, provides schema validation, etc.
const mongoose = require('mongoose');
// 'cors' is a middleware to enable Cross-Origin Resource Sharing,
// allowing your React Native app to communicate with this server.
const cors = require('cors');
// 'dotenv' is a module to load environment variables from a .env file
require('dotenv').config();

// --- 2. Initialize Express App ---
const app = express();
// The port the server will run on. Use the environment variable or default to 5000.
const PORT = process.env.PORT || 5001;

// --- 3. Middleware ---
// Enable CORS for all routes
app.use(cors());
// Enable Express to parse JSON bodies in incoming requests
app.use(express.json());

// --- 4. MongoDB Connection ---
// Get the MongoDB connection string from environment variables.
// It's crucial to keep this secret and not hard-code it.
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error('Error: MONGO_URI is not defined. Please set it in your .env file.');
  process.exit(1);
}

// Enable Mongoose debug mode to see database operations in the console
mongoose.set('debug', true);
//const uri = "mongodb+srv://jiehuang239:Hj369182@auramove.itlpksr.mongodb.net/?retryWrites=true&w=majority&appName=AuraMove";
mongoose.connect(mongoURI)
  .then(() => {
    console.log(`Successfully connected to MongoDB Atlas! Database: "${mongoose.connection.name}"`);
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit if DB connection fails
  });


// --- 5. Define the Mongoose Schema and Model ---
// The schema defines the structure of the documents within a collection.
const exerciseSchema = new mongoose.Schema({
  exercise: {
    type: String,
    required: true, // This field must be provided
    trim: true,     // Removes whitespace from both ends
  },
  reps: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the creation date
  },
});

// The model is a constructor compiled from the schema definition.
// An instance of a model is a document.
// 'Exercise' is the model name. By default, Mongoose would look for an 'exercises' collection.
// We provide 'sets' as the third argument to explicitly map this model to your 'sets' collection.
const Exercise = mongoose.model('Exercise', exerciseSchema, 'sets');


// --- 6. Define API Routes (Endpoints) ---

/**
 * @route   POST /exercises
 * @desc    Create a new exercise entry
 * @access  Public
 */
app.post('/exercises', async (req, res) => {
  // The request body should contain the exercise data from your React Native app
  const { exercise, reps, weight } = req.body;

  // Log the received data to the terminal for debugging
  console.log(`Received request to add exercise:`, { exercise, reps, weight });

  // Basic validation on the server-side as well
  // Use `== null` to check for both undefined and null, while allowing 0 as a valid value.
  if (!exercise || reps == null || weight == null) {
    // Return a 400 Bad Request status if data is missing
    return res.status(400).json({ message: 'Please provide exercise, reps, and weight.' });
  }

  try {
    // Create a new document using the Exercise model and the request body
    const newExercise = new Exercise({
      exercise,
      reps,
      weight,
    });

    // Save the new document to the MongoDB database
    const savedExercise = await newExercise.save();

    // Send a 201 Created status and the saved document back to the client
    res.status(201).json({
        message: 'Exercise saved successfully!',
        data: savedExercise
    });

  } catch (error) {
    // If an error occurs during the save operation
    console.error('Error saving exercise:', error);
    // Send a 500 Internal Server Error status
    res.status(500).json({ message: 'Server error while saving exercise.' });
  }
});

/**
 * @route   GET /exercises
 * @desc    Get all exercise entries
 * @access  Public
 */
app.get('/exercises', async (req, res) => {
  try {
    // Find all documents in the 'exercises' collection
    console.log('Received request to fetch all exercises.');
    const exercises = await Exercise.find().sort({ createdAt: -1 }); // Sort by newest first
    res.status(200).json(exercises);
  } catch (error) {
    console.error('Error fetching exercises:', error);
    res.status(500).json({ message: 'Server error while fetching exercises.' });
  }
});

/**
 * @route   GET /
 * @desc    Root endpoint for health check or welcome message
 * @access  Public
 */
app.get('/', (req, res) => {
  console.log("Received request for root path '/'");
  res.send('Hello from the backend!\n');
});
// --- 7. Start the Server ---
const server = app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`FATAL ERROR: Port ${PORT} is already in use. Please choose a different port or stop the other service.`);
  } else {
    console.error('FATAL ERROR: An error occurred starting the server:', err);
  }
  process.exit(1);
});
