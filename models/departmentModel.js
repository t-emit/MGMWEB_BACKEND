// models/departmentModel.js
const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Department name is required'],
        unique: true,
        trim: true,
    },
    code: { // A short code like "CSE", "MECH", "CIVIL"
        type: String,
        required: [true, 'Department code is required'],
        unique: true,
        trim: true,
        uppercase: true,
    },
    description: {
        type: String,
        trim: true,
        default: '',
    }
}, { timestamps: true });

const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;