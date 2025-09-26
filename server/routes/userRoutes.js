// server/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer'); // <--- 1. IMPORT MULTER
const path = require('path');     // <--- 2. IMPORT PATH (Good practice for file paths)

const { 
    registerUser, 
    loginUser, 
    getUserProfile,
    updateUserProfile 
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// --- 3. MULTER CONFIGURATION ---
// Set storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // NOTE: You must create this 'uploads' folder in your server directory
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        // Rename file for safety and uniqueness: user_id-timestamp.ext
        const ext = path.extname(file.originalname);
        cb(null, `${req.user._id}-${Date.now()}${ext}`);
    }
});

// Initialize upload middleware
const upload = multer({
    storage: storage,
    limits: { fileSize: 2000000 }, // 2MB file size limit
    fileFilter: (req, file, cb) => {
        // Only allow images
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed.'), false);
        }
    }
});
// ---------------------------------


// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected Profile Route
router.route('/profile')
  .get(protect, getUserProfile)
  // --- 4. ADD MULTER MIDDLEWARE TO THE PUT ROUTE ---
  // upload.single('profilePicture') must match the key used in client's FormData
  .put(protect, upload.single('profilePicture'), updateUserProfile); 
  // NOTE: req.user is available here because 'protect' runs first.

module.exports = router;