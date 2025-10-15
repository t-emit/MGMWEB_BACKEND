// controllers/departmentController.js
const Department = require('../models/departmentModel');

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
const getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find({}).sort({ name: 1 });
        res.status(200).json(departments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create a new department
// @route   POST /api/departments
// @access  Admin
const createDepartment = async (req, res) => {
    const { name, code, description } = req.body;
    if (!name || !code) {
        return res.status(400).json({ message: 'Name and Code are required' });
    }

    try {
        const departmentExists = await Department.findOne({ $or: [{ name }, { code }] });
        if (departmentExists) {
            return res.status(400).json({ message: 'Department with that name or code already exists' });
        }

        const department = await Department.create({ name, code, description });
        res.status(201).json(department);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete a department
// @route   DELETE /api/departments/:id
// @access  Admin
const deleteDepartment = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }
        await Department.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Department removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getAllDepartments,
    createDepartment,
    deleteDepartment,
};