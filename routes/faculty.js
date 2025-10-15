// routes/faculty.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const { protect, admin } = require('../middleware/authMiddleware');
const Faculty = require('../models/Faculty');

// Initialize Supabase client using environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Configure Multer for in-memory file storage to handle uploads
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
// @desc    Add a new faculty member with photo upload to Supabase
// @access  Private (Admin)
router.post('/', [protect, admin, upload.single('photo')], async (req, res) => {
    const { name, title, department } = req.body;

    try {
        let profileImageUrl = '';

        // Check if a photo file was included in the request
        if (req.file) {
            // Create a unique file path and name for the uploaded photo
            const fileName = `faculty-photos/${Date.now()}-${req.file.originalname.replace(/\s/g, '_')}`;
            
            // Upload the file buffer to the 'page-assets' bucket in Supabase
            const { data, error } = await supabase.storage
                .from('page-assets')
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype,
                });

            if (error) {
                // If Supabase returns an error, throw it to the catch block
                throw error;
            }
            
            // Construct the public URL for the uploaded image
            profileImageUrl = `${supabaseUrl}/storage/v1/object/public/page-assets/${data.path}`;
        }

        const newFaculty = new Faculty({
            name,
            title,
            department,
            profileImageUrl, // This will be the Supabase URL or an empty string
        });

        const faculty = await newFaculty.save();
        res.status(201).json(faculty);

    } catch (err) {
        console.error('Error adding faculty member:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/faculty/:id
// @desc    Delete a faculty member and their photo from Supabase
// @access  Private (Admin)
router.delete('/:id', [protect, admin], async (req, res) => {
    try {
        const faculty = await Faculty.findById(req.params.id);
        if (!faculty) {
            return res.status(404).json({ msg: 'Faculty member not found' });
        }

        // If the faculty member has a photo URL, delete the corresponding file from Supabase
        if (faculty.profileImageUrl) {
            // Extract the file path from the full public URL
            const filePath = faculty.profileImageUrl.split('/page-assets/')[1];
            if (filePath) {
                const { error } = await supabase.storage.from('page-assets').remove([filePath]);
                if (error) {
                    // Log the error but continue with DB deletion, as the record is more important
                    console.error('Supabase file deletion error:', error.message);
                }
            }
        }

        // Delete the faculty member's record from the database
        await Faculty.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Faculty member removed successfully' });

    } catch (err) {
        console.error('Error deleting faculty member:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;