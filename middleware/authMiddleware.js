const jwt = require('jsonwebtoken');
require('dotenv').config();

// This middleware function only verifies the token. It does not need a user model.
const authMiddleware = (req, res, next) => {
    // Get token from header
    const authHeader = req.header('Authorization');

    // Check if there is no token
    if (!authHeader) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // The header format is "Bearer <token>"
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ msg: 'Token format is invalid, authorization denied' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; // Attach user info from token to the request
        next(); // Move to the next middleware or route handler
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = authMiddleware;