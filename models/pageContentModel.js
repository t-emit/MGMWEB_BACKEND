// models/pageContentModel.js
const mongoose = require('mongoose');

const pageContentSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: [true, 'Page slug is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  // Renamed to match the database screenshot for consistency
  pageTitle: {
    type: String,
    required: [true, 'Page title is required'],
    trim: true,
  },
  // CORRECTED: 'content' is now defined as a flexible Object type
  content: {
    type: mongoose.Schema.Types.Mixed, // Allows for any nested object structure
    required: true,
  },
  lastUpdatedBy: {
    type: String, // Or mongoose.Schema.Types.ObjectId if you link to a User model
  },
}, { timestamps: true });

const PageContent = mongoose.model('PageContent', pageContentSchema);

module.exports = PageContent;