const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'retirepro_dev_secret_2026';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5050';

// ─── Passport: Serialize / Deserialize ───────────────────────────────────────
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// ─── Google Strategy ──────────────────────────────────────────────────────────
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${BACKEND_URL}/api/auth/google/callback`,
      },
      (accessToken, refreshToken, profile, done) => {
        const user = {
          id: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0]?.value || '',
          avatar: profile.photos?.[0]?.value || '',
          provider: 'google',
        };
        return done(null, user);
      }
    )
  );
}

// ─── LinkedIn Strategy ────────────────────────────────────────────────────────
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  passport.use(
    new LinkedInStrategy(
      {
        clientID: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackURL: `${BACKEND_URL}/api/auth/linkedin/callback`,
        scope: ['openid', 'profile', 'email'],
      },
      (accessToken, refreshToken, profile, done) => {
        const user = {
          id: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0]?.value || '',
          avatar: profile.photos?.[0]?.value || '',
          provider: 'linkedin',
        };
        return done(null, user);
      }
    )
  );
}

// ─── Helper: Issue JWT and redirect to frontend ───────────────────────────────
function issueTokenAndRedirect(req, res) {
  const user = req.user;
  if (!user) return res.redirect(`${CLIENT_URL}/auth?error=oauth_failed`);

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, avatar: user.avatar, provider: user.provider },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Redirect to frontend with token in query param (frontend stores in localStorage)
  res.redirect(`${CLIENT_URL}/auth?token=${token}`);
}

// ─── Google Routes ────────────────────────────────────────────────────────────
router.get('/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.redirect(`${CLIENT_URL}/auth?error=google_not_configured`);
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback',
  (req, res, next) => {
    passport.authenticate('google', { failureRedirect: `${CLIENT_URL}/auth?error=google_failed` })(req, res, next);
  },
  issueTokenAndRedirect
);

// ─── LinkedIn Routes ──────────────────────────────────────────────────────────
router.get('/linkedin', (req, res, next) => {
  if (!process.env.LINKEDIN_CLIENT_ID) {
    return res.redirect(`${CLIENT_URL}/auth?error=linkedin_not_configured`);
  }
  passport.authenticate('linkedin')(req, res, next);
});

router.get('/linkedin/callback',
  (req, res, next) => {
    passport.authenticate('linkedin', { failureRedirect: `${CLIENT_URL}/auth?error=linkedin_failed` })(req, res, next);
  },
  issueTokenAndRedirect
);

// ─── Verify Token Route (frontend calls this to validate stored JWT) ──────────
router.get('/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

// ─── Logout ───────────────────────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  req.logout?.(() => {});
  res.json({ message: 'Logged out successfully' });
});

module.exports = { router, passport };
