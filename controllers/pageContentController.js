// controllers/pageContentController.js
const PageContent = require('../models/pageContentModel');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// GET a single page by its slug (Public access)
const getPageBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const page = await PageContent.findOne({ slug });
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }
    res.status(200).json(page);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET all pages (Admin access)
const getAllPages = async (req, res) => {
    try {
        const pages = await PageContent.find({}).select('title slug updatedAt');
        res.status(200).json(pages);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// UPDATE a page by its slug (Admin access)
const updatePageBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, subtitle, content } = req.body;
    // const updatedBy = req.user.id; // Assuming you have user info from auth middleware

    const updatedPage = await PageContent.findOneAndUpdate(
      { slug },
      { title, subtitle, content, lastUpdatedBy: 'Admin' /* replace with updatedBy */ },
      { new: true, runValidators: true }
    );

    if (!updatedPage) {
      return res.status(404).json({ message: 'Page not found' });
    }
    res.status(200).json({ message: 'Page updated successfully', page: updatedPage });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Handle File Uploads to Supabase (Admin access)
const uploadFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    try {
        const file = req.file;
        const fileName = `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`;
        
        const { data, error } = await supabase.storage
            .from('page-assets') // IMPORTANT: Create a bucket named 'page-assets' in Supabase
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            throw error;
        }
        
        // Construct the public URL
        const publicURL = `${supabaseUrl}/storage/v1/object/public/page-assets/${data.path}`;

        res.status(200).json({ message: 'File uploaded successfully', url: publicURL });

    } catch (error) {
        res.status(500).json({ message: 'Error uploading file', error: error.message });
    }
};


module.exports = {
  getPageBySlug,
  getAllPages,
  updatePageBySlug,
  uploadFile,
};