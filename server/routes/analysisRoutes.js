const express = require('express');
const multer = require('multer');
const { analyzeImages } = require('../controllers/analysisController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Configure multer for in-memory storage (we don't need to save the files)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define the route
// 'protect' ensures the user is logged in.
// 'upload.fields' looks for files named 'faceImage' and 'tongueImage' in the request.
router.post(
  '/image',
  protect,
  upload.fields([
    { name: 'faceImage', maxCount: 1 },
    { name: 'tongueImage', maxCount: 1 },
  ]),
  analyzeImages
);

module.exports = router;