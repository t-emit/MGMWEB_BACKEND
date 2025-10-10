const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const authMiddleware = require('../middleware/authMiddleware');
const Event = require('../models/Event');

// Configure Cloudinary (it uses the .env variables)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer to handle files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// @route   GET /api/events (No changes needed here)
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().sort({ date: -1 });
        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/events (MAJOR CHANGES HERE)
// @desc    Add a new event with optional file uploads
router.post('/', [authMiddleware, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }])], async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied' });
    }

    const { title, date, description, link, type } = req.body;

    try {
        let imageUrl = '', imagePublicId = '', pdfUrl = '', pdfPublicId = '';

        // Helper function to upload a buffer to Cloudinary
        const uploadToCloudinary = (fileBuffer, options) => {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                });
                uploadStream.end(fileBuffer);
            });
        };

        // Check for and upload the image file
        if (req.files && req.files.image) {
            const imageResult = await uploadToCloudinary(req.files.image[0].buffer, { folder: "mgm_events_images" });
            imageUrl = imageResult.secure_url;
            imagePublicId = imageResult.public_id;
        }

        // Check for and upload the PDF file
        if (req.files && req.files.pdf) {
            const pdfResult = await uploadToCloudinary(req.files.pdf[0].buffer, { folder: "mgm_events_pdfs", resource_type: "auto" });
            pdfUrl = pdfResult.secure_url;
            pdfPublicId = pdfResult.public_id;
        }

        const newEvent = new Event({
            title, date, description, link, type,
            imageUrl, imagePublicId, pdfUrl, pdfPublicId
        });

        const event = await newEvent.save();
        res.json(event);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/events/:id (MAJOR CHANGES HERE)
// @desc    Delete an event and its associated files from Cloudinary
router.delete('/:id', authMiddleware, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied' });
    }

    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ msg: 'Event not found' });

        // If an image exists on Cloudinary, delete it
        if (event.imagePublicId) {
            await cloudinary.uploader.destroy(event.imagePublicId);
        }
        
        // If a PDF exists on Cloudinary, delete it
        if (event.pdfPublicId) {
            await cloudinary.uploader.destroy(event.pdfPublicId, { resource_type: "raw" }); // PDFs might be stored as 'raw'
        }

        await Event.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Event removed' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;