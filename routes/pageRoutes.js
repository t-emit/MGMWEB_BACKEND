// backend/routes/pageRoutes.js

const express = require('express');
const router = express.Router();
// CORRECT THE MODEL IMPORT: Make sure the model is imported correctly.
// The file should be in ../models/pageContentModel.js from the routes folder.
const PageContent = require('../models/pageContentModel');

// Assuming you have this middleware for admin protection. If not, you can remove 'protect' and 'admin'.
// const { protect, admin } = require('../middleware/authMiddleware');

// GET all manageable pages
// GET /api/pages
router.get('/', async (req, res) => {
    try {
        console.log("Attempting to fetch page list from the database...");
        // This query finds all documents and selects only the fields we need.
        const pages = await PageContent.find({}).select('pageIdentifier pageTitle _id');

        if (!pages || pages.length === 0) {
            console.log("No pages found in the database.");
            return res.status(404).json({ message: "No pages found." });
        }

        console.log(`Found ${pages.length} page(s).`);
        res.json(pages);

    } catch (error) {
        console.error("SERVER ERROR in GET /api/pages:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET content for a specific page by identifier
// GET /api/pages/:identifier
router.get('/:identifier', async (req, res) => {
    try {
        const page = await PageContent.findOne({ pageIdentifier: req.params.identifier });
        if (page) {
            res.json(page);
        } else {
            res.status(404).json({ message: 'Page content not found' });
        }
    } catch (error) {
        console.error(`SERVER ERROR in GET /api/pages/${req.params.identifier}:`, error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// UPDATE content for a specific page
// PUT /api/pages/:identifier
// This route should be protected in production
router.put('/:identifier', /* protect, admin, */ async (req, res) => {
    try {
        const { pageTitle, content } = req.body; // Assuming content is sent as a direct object

        const updatedPage = await PageContent.findOneAndUpdate(
            { pageIdentifier: req.params.identifier },
            { pageTitle, content }, // Updated to use 'content' directly
            { new: true, runValidators: true }
        );

        if (updatedPage) {
            res.json(updatedPage);
        } else {
            res.status(404).json({ message: 'Page content not found for update' });
        }
    } catch (error) {
        console.error(`SERVER ERROR in PUT /api/pages/${req.params.identifier}:`, error);
        res.status(400).json({ message: 'Error updating page content' });
    }
});

module.exports = router;