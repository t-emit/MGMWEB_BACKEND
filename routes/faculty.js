const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const authMiddleware = require('../middleware/authMiddleware');
const Faculty = require('../models/Faculty');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// @route   GET /api/faculty
// @desc    Get all faculty members
// @access  Public
router.get('/', async (req, res) => {
    try {
        const faculty = await Faculty.find().sort({ name: 1 }); // Sort alphabetically
        res.json(faculty);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/faculty
// @desc    Add a new faculty member
// @access  Private (Admin)
router.post('/', [authMiddleware, upload.single('photo')], async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied' });
    }

    const { name, title, department } = req.body;
    
    try {
        let profileImageUrl = '';
        let cloudinaryPublicId = '';

        // Check if a photo was uploaded
        if (req.file) {
            // Upload to Cloudinary
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "faculty_photos" }, // Optional: organize in a folder
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(req.file.buffer);
            });
            profileImageUrl = result.secure_url;
            cloudinaryPublicId = result.public_id;
        }

        const newFaculty = new Faculty({
            name,
            title,
            department,
            profileImageUrl,
            cloudinaryPublicId,
        });

        const faculty = await newFaculty.save();
        res.json(faculty);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/faculty/:id
// @desc    Delete a faculty member
// @access  Private (Admin)
router.delete('/:id', authMiddleware, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied' });
    }

    try {
        const faculty = await Faculty.findById(req.params.id);
        if (!faculty) return res.status(404).json({ msg: 'Faculty member not found' });

        // If there's an image in Cloudinary, delete it
        if (faculty.cloudinaryPublicId) {
            await cloudinary.uploader.destroy(faculty.cloudinaryPublicId);
        }

        await Faculty.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Faculty member removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;