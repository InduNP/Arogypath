// server/controllers/mealController.js
const Meal = require('../models/mealModel');

// @desc    Get all meals for the logged-in user
// @route   GET /api/meals
// @access  Private
const getMeals = async (req, res) => {
  // We have access to req.user.id from our 'protect' middleware
  const meals = await Meal.find({ user: req.user.id }).sort({ createdAt: -1 }); // Get newest first
  res.json(meals);
};

// @desc    Add a new meal for the logged-in user
// @route   POST /api/meals
// @access  Private
const addMeal = async (req, res) => {
  const { foodItem, calories } = req.body;

  if (!foodItem) {
    return res.status(400).json({ message: 'Please add a food item' });
  }

  const meal = new Meal({
    user: req.user.id,
    foodItem,
    calories,
  });

  const createdMeal = await meal.save();
  res.status(201).json(createdMeal);
};

module.exports = {
  getMeals,
  addMeal,
};