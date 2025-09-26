
// server/index.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');


// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // To parse JSON bodies in requests

// API Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/meals', require('./routes/mealRoutes')); // <-- ADD THIS LINE
app.use('/api/diet', require('./routes/dietRoutes'));
app.use('/api/analysis', require('./routes/analysisRoutes'));

// A simple test route to check if the server is running
app.get('/', (req, res) => {
  res.send('Ayurveda Diet App API is running...');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});