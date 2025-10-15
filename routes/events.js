// routes/events.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const { protect, admin } = require('../middleware/authMiddleware');
const Event = require('../models/Event');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Configure Multer for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().sort({ date: -1 });
        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/events
// @desc    Add a new event with optional file uploads to Supabase
// @access  Private (Admin)
router.post('/',
    [protect, admin, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }])],
    async (req, res) => {
        const { title, date, description, link, type } = req.body;

        try {
            let imageUrl = '';
            let pdfUrl = '';

            // Helper function to upload a file to a specific Supabase path
            const uploadToSupabase = async (file, path) => {
                const fileName = `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`;
                const { data, error } = await supabase.storage
                    .from('page-assets') // Or a different bucket like 'event-assets'
                    .upload(`${path}/${fileName}`, file.buffer, {
                        contentType: file.mimetype,
                    });
                if (error) throw error;
                return `${supabaseUrl}/storage/v1/object/public/page-assets/${data.path}`;
            };

            // Check for and upload the image file
            if (req.files && req.files.image) {
                imageUrl = await uploadToSupabase(req.files.image[0], 'event-images');
            }

            // Check for and upload the PDF file
            if (req.files && req.files.pdf) {
                pdfUrl = await uploadToSupabase(req.files.pdf[0], 'event-pdfs');
            }

            const newEvent = new Event({
                title, date, description, link, type,
                imageUrl, // Store the public Supabase URL
                pdfUrl,   // Store the public Supabase URL
            });

            const event = await newEvent.save();
            res.json(event);

        } catch (err) {
            console.error('Error creating event:', err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route   DELETE /api/events/:id
// @desc    Delete an event and its associated files from Supabase
// @access  Private (Admin)
router.delete('/:id', [protect, admin], async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ msg: 'Event not found' });

        // Helper function to extract file path from URL for deletion
        const getPathFromUrl = (url) => {
            if (!url) return null;
            return url.substring(url.indexOf('/page-assets/') + '/page-assets/'.length);
        };

        const imagePath = getPathFromUrl(event.imageUrl);
        const pdfPath = getPathFromUrl(event.pdfUrl);

        // Delete files from Supabase if they exist
        if (imagePath) await supabase.storage.from('page-assets').remove([imagePath]);
        if (pdfPath) await supabase.storage.from('page-assets').remove([pdfPath]);

        await Event.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Event removed' });

    } catch (err) {
        console.error('Error deleting event:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;