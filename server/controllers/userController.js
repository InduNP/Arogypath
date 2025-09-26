// server/controllers/userController.js

const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// --- CONTROLLER 1: Register a new user ---
// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  // ... (rest of the registerUser logic) ...
  // [Code has been truncated for brevity - it remains the same as your input]
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    const payload = { user: { id: user.id } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5d' }, 
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};


// --- CONTROLLER 2: Authenticate a user (Login) ---
// @desc    Authenticate a user (Login)
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 2. Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 3. If credentials are correct, create and sign a JWT
    const payload = { user: { id: user.id } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            // Fetch and return all profile data here for clean client state update
            age: user.age,
            gender: user.gender,
            profession: user.profession,
            heightCm: user.heightCm, 
            currentWeightKg: user.currentWeightKg, 
            activityLevel: user.activityLevel, 
            profilePicture: user.profilePicture,
          },
        });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};


// --- CONTROLLER 3: Get user profile ---
// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); 

    if (user) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        profession: user.profession,
        heightCm: user.heightCm, 
        currentWeightKg: user.currentWeightKg, 
        activityLevel: user.activityLevel, 
        profilePicture: user.profilePicture, 
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};


// --- CONTROLLER 4: Update user profile ---
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const file = req.file; // File data from Multer

    if (!user) {
      if (file) fs.unlinkSync(path.resolve(file.path)); 
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update fields from req.body (handled by Multer)
    user.name = req.body.name || user.name;
    user.age = req.body.age || user.age;
    user.gender = req.body.gender || user.gender;
    user.profession = req.body.profession || user.profession;

    user.heightCm = req.body.heightCm ? Number(req.body.heightCm) : user.heightCm;
    user.currentWeightKg = req.body.currentWeightKg ? Number(req.body.currentWeightKg) : user.currentWeightKg;
    user.activityLevel = req.body.activityLevel || user.activityLevel;
    
    // Password update logic (kept as is)
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }
    
    // Handle PROFILE PICTURE (File Upload)
    if (file) {
        // If an old picture exists, attempt to delete it from the file system
        if (user.profilePicture && user.profilePicture !== 'path/to/default') {
            const oldPath = path.resolve(user.profilePicture);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }
        // Save the new file path provided by Multer
        user.profilePicture = file.path; 
    }

    const updatedUser = await user.save();

    // Send back the updated user data
    const payload = { user: { id: updatedUser.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5d' });
    
    res.json({
      token,
      user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          age: updatedUser.age,
          gender: updatedUser.gender,
          profession: updatedUser.profession,
          heightCm: updatedUser.heightCm, 
          currentWeightKg: updatedUser.currentWeightKg, 
          activityLevel: updatedUser.activityLevel, 
          profilePicture: updatedUser.profilePicture,
      }
    });

  } catch (error) {
    console.error('Profile update failed:', error.message);
    res.status(500).send('Server error during profile update.');
  }
};


// Make sure to export all functions
module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};