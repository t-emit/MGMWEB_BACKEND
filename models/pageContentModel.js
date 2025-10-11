const mongoose = require('mongoose');

const contentBlockSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['heading', 'paragraph', 'image', 'list', 'pdfLink'] // Add more types as needed
    },
    content: {
        type: mongoose.Schema.Types.Mixed, // Allows for flexibility (string for text, object for image, array for list)
        required: true
    }
    // Example `content` structures:
    // for 'heading'/'paragraph': "Some text content"
    // for 'image': { url: "path/to/image.jpg", alt: "Description" }
    // for 'list': ["Item 1", "Item 2", "Item 3"]
    // for 'pdfLink': { url: "path/to/doc.pdf", text: "Download PDF" }
}, { _id: false });

const pageContentSchema = new mongoose.Schema({
    pageIdentifier: {
        type: String,
        required: true,
        unique: true, // e.g., 'about-us', 'home', 'contact'
        trim: true
    },
    pageTitle: {
        type: String,
        required: true // e.g., 'About Us'
    },
    contentBlocks: [contentBlockSchema]
}, { timestamps: true, strict: false }); // strict: false allows for additional fields if needed});

module.exports = mongoose.model('PageContent', pageContentSchema);