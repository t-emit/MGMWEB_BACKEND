const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    link: { type: String, required: false }, // Optional external link
    type: { type: String, required: true, enum: ['news', 'event'] },
    
    // NEW FIELDS FOR FILE UPLOADS
    imageUrl: { type: String, required: false },
    imagePublicId: { type: String, required: false }, // For deleting from Cloudinary
    pdfUrl: { type: String, required: false },
    pdfPublicId: { type: String, required: false } // For deleting from Cloudinary
});

module.exports = mongoose.model('Event', EventSchema);