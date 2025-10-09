const mongoose = require('mongoose');

const FacultySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    // Using 'title' as per your frontend code
    title: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        required: true,
        trim: true
    },
    // IMPORTANT: The photo URL is NOT required
    profileImageUrl: {
        type: String,
        required: false
    },
    // Cloudinary Public ID for deleting the image later
    cloudinaryPublicId: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Faculty', FacultySchema);