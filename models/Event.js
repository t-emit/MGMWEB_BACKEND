const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: false // Optional, can be a link to an image
    },
    link: {
        type: String,
        required: false // Optional, link to a registration page or more info
    },
    type: {
        type: String,
        required: true,
        enum: ['news', 'event'] // This is important for your NewsEvents component
    }
});

module.exports = mongoose.model('Event', EventSchema);