const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true, 
        trim: true 
    },
    // Using String to match your existing data like "April 15, 2025".
    // If you plan to use a date picker, changing this to `type: Date` is better practice.
    date: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    link: { 
        type: String, 
        default: '' 
    },
    type: { 
        type: String, 
        required: true, 
        enum: ['news', 'event'] 
    },
    imageUrl: { 
        type: String, 
        default: '' 
    },
    pdfUrl: {   // This field will store the Supabase PDF link
        type: String, 
        default: '' 
    }
}, { 
    timestamps: true // Adds createdAt and updatedAt fields automatically
});

module.exports = mongoose.model('Event', EventSchema);