const express = require('express');
const router = express.Router();
const DepartmentContent = require('../models/DeptCont');

// GET all manageable departments
router.get('/', async (req, res) => {
    try {
        const departments = await DepartmentContent.find({}).select('departmentIdentifier departmentName _id');
        res.json(departments);
    } catch (error) {
        console.error("Error fetching departments list:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET all content for a specific department
router.get('/:identifier', async (req, res) => {
    try {
        const department = await DepartmentContent.findOne({ departmentIdentifier: req.params.identifier });
        if (department) {
            res.json(department);
        } else {
            res.status(404).json({ message: 'Department content not found' });
        }
    } catch (error) {
        console.error(`Error fetching department ${req.params.identifier}:`, error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// UPDATE content for a specific department
router.put('/:identifier', async (req, res) => {
    try {
        const updateData = req.body;
        delete updateData.departmentIdentifier; // Prevent changing the identifier

        const updatedDepartment = await DepartmentContent.findOneAndUpdate(
            { departmentIdentifier: req.params.identifier },
            updateData,
            { new: true, runValidators: true }
        );

        if (updatedDepartment) {
            res.json(updatedDepartment);
        } else {
            res.status(404).json({ message: 'Department not found to update' });
        }
    } catch (error) {
        console.error(`Error updating department ${req.params.identifier}:`, error);
        res.status(400).json({ message: 'Error updating department content' });
    }
});

module.exports = router;