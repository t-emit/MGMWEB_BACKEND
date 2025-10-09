// backend/server.js

const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Connect to Database
connectDB();

// Init Middleware
// NEW and production-ready
const allowedOrigins = [
    'http://localhost:5173', // For local development
    process.env.FRONTEND_URL  // For the deployed frontend
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
// Later you will add more routes here, e.g., app.use('/api/events', ...);
// Add this line under the '/api/auth' route
app.use('/api/events', require('./routes/events'));
// Add this under your other routes
app.use('/api/faculty', require('./routes/faculty'));
app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));