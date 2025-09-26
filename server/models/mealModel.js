// server/models/mealModel.js
const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // This creates a relationship to the User model
      required: true,
      ref: 'User', // The specific model this ID refers to
    },
    foodItem: {
      type: String,
      required: [true, 'Please add a food item name'],
    },
    // We will add more nutrient fields later (calories, protein, etc.)
    // For now, we'll keep it simple.
    calories: {
      type: Number,
      required: false, // Make this optional for now
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

const Meal = mongoose.model('Meal', mealSchema);

module.exports = Meal;