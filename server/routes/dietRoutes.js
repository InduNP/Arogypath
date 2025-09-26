// server/routes/dietRoutes.js

const express = require('express');
const router = express.Router();

// Import all necessary controller functions
const { 
  generateDietPlan, 
  logMealCompletion,  // <--- NEW
  getPlanProgress     // <--- NEW
} = require('../controllers/dietController');

// Assuming you have an authentication middleware to ensure the user is logged in
const { protect } = require('../middleware/authMiddleware'); 


// @route   POST /api/diet/generate
// @desc    Generate and save a new Ayurvedic diet plan
// @access  Private
router.post('/generate', protect, generateDietPlan);


// @route   POST /api/diet/log-meal
// @desc    Log the completion status of a specific meal or update daily metrics
// @access  Private
router.post('/log-meal', protect, logMealCompletion);


// @route   GET /api/diet/progress
// @desc    Fetch progress data (charts, metrics) for the dashboard
// @access  Private
router.get('/progress', protect, getPlanProgress);


module.exports = router;