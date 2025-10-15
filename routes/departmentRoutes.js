// routes/departmentRoutes.js
const express = require('express');
const router = express.Router();
const { getAllDepartments, createDepartment, deleteDepartment } = require('../controllers/departmentController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public route to get all departments
router.get('/', getAllDepartments);

// Admin-only routes
router.post('/', protect, admin, createDepartment);
router.delete('/:id', protect, admin, deleteDepartment);

module.exports = router;