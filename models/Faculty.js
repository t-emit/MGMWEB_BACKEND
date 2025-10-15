const mongoose = require('mongoose');

const FacultySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    title: { // e.g., "Professor", "Head of Department"
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        required: true,
        trim: true
    },
    profileImageUrl: {
        type: String,
        default: '' // Use a default empty string if no photo is provided
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields automatically
});

module.exports = mongoose.model('Faculty', FacultySchema);