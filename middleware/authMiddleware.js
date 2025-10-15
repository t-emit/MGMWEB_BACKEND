// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

// This middleware verifies the token and attaches the user payload.
const protect = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'No token or malformed token, authorization denied' });
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach the decoded payload to the request object
        req.user = decoded.user; 
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// This middleware checks if the user is an admin.
// For your simple case, we just check if a user object exists after 'protect' runs.
// In a more complex app, you would check a property like req.user.role === 'admin'
const admin = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.status(403).json({ msg: 'Admin access required, authorization denied' });
    }
};

// EXPORT AN OBJECT containing the middleware functions
module.exports = { protect, admin };