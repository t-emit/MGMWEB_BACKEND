const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

// The login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // --- Check against the single, hardcoded admin user from .env ---
  const isAdminEmail = email === process.env.ADMIN_EMAIL;
  const isAdminPassword = password === process.env.ADMIN_PASSWORD;

  if (!isAdminEmail || !isAdminPassword) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // If credentials are correct, create the "key card" (JWT)
  const payload = {
    user: {
      id: 'admin_user_01', // A static ID for the admin
      role: 'admin',      // This is CRITICAL for the frontend
    },
  };

  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '8h' }, // Token lasts for 8 hours
    (err, token) => {
      if (err) throw err;
      // Send the token and user info back to the frontend
      res.json({
        token,
        user: payload.user
      });
    }
  );
});

module.exports = router;