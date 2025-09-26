// server/routes/mealRoutes.js
const express = require('express');
const router = express.Router();
const { getMeals, addMeal } = require('../controllers/mealController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getMeals)
  .post(protect, addMeal);

module.exports = router;