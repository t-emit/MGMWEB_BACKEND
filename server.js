// backend/server.js

const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
const pageRoutes = require('./routes/pageRoutes');
const departmentRoutes = require('./routes/departmentRoutes');

require('dotenv').config();

const app = express();

// Connect to Database
connectDB();

// Init Middleware
// NEW and production-ready
// TEMPORARY DEBUGGING STEP
app.use(cors());
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
// Later you will add more routes here, e.g., app.use('/api/events', ...);
// Add this line under the '/api/auth' route
app.use('/api/events', require('./routes/events'));
// Add this under your other routes
app.use('/api/faculty', require('./routes/faculty'));
app.use('/api/pages', pageRoutes);
app.use('/api/departments', departmentRoutes); 
app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));