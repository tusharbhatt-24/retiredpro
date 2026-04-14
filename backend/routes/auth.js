const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      name: user.name, 
      avatar: user.avatar_url,
      role: user.role,
      isNewUser: !!user.wasJustCreated
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Google Auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user);
    const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth-success?token=${token}`);
  }
);

// LinkedIn Auth
router.get('/linkedin', passport.authenticate('linkedin'));

router.get('/linkedin/callback', 
  passport.authenticate('linkedin', { failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user);
    const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth-success?token=${token}`);
  }
);

module.exports = router;
