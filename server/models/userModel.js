// server/models/userModel.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Emails must be unique
    },
    password: {
      type: String,
      required: true,
    },
    // Add other user profile fields here
    age: { 
      type: Number 
    },
    gender: { 
      type: String 
    },
    profession: { 
      type: String 
    },
    
    // --- NEW PROFILE FIELDS FOR TRACKING AND PICTURE (CRUCIAL UPDATE) ---
    heightCm: {
        type: Number,
    },
    currentWeightKg: {
        type: Number,
    },
    activityLevel: {
        type: String, // e.g., "Sedentary", "Moderately Active"
    },
    profilePicture: {
        type: String, // Stores the file path from Multer (e.g., 'uploads/filename.jpg')
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;