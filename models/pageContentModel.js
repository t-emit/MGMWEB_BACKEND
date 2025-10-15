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
  title: {
    type: String,
    required: [true, 'Page title is required'],
    trim: true,
  },
  subtitle: {
    type: String,
    trim: true,
  },
  content: {
    type: String, // This will store the main HTML content from the rich text editor
    required: true,
    default: '<p>Start editing this page...</p>',
  },
  lastUpdatedBy: {
    type: String, // Or mongoose.Schema.Types.ObjectId if you link to a User model
    required: true,
  },
}, { timestamps: true });

const PageContent = mongoose.model('PageContent', pageContentSchema);

module.exports = PageContent;