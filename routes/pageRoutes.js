// routes/pageRoutes.js
const express = require('express');
const router = express.Router();
const { getPageBySlug, getAllPages, updatePageBySlug, uploadFile } = require('../controllers/pageContentController');
const { protect, admin } = require('../middleware/authMiddleware'); // Your auth middleware
const multer = require('multer');

// Configure multer for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Public Route
router.get('/:slug', getPageBySlug);

// Admin Routes
router.get('/', protect, admin, getAllPages);
router.put('/:slug', protect, admin, updatePageBySlug);
router.post('/upload', protect, admin, upload.single('file'), uploadFile);

module.exports = router;