const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const { PrismaClient } = require('@prisma/client');

let prisma;
try {
  prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL || "postgresql://mock:mock@localhost:5432/mock"
  });
} catch (e) {
  console.log("Prisma skipping initialization in passport.js until DB URL is added.");
}

if (!prisma) {
  prisma = {
    user: {
      findUnique: async ({ where }) => {
        // Mock finding user by email
        if (where.email) return { id: 'oauth_mock_id', email: where.email, name: 'OAuth User', role: 'professional' };
        return null;
      },
      create: async ({ data }) => ({ id: 'oauth_mock_id', ...data })
    }
  };
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    if (!prisma) return done(null, { id, email: 'mock@example.com' });
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5050/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      if (!profile.emails || !profile.emails[0]) {
        return done(new Error('No email from Google'), null);
      }
      const email = profile.emails[0].value;
      let user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            auth_provider: 'google',
            is_email_verified: true,
            role: 'professional'
          }
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }));
}

// LinkedIn Strategy
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: 'http://localhost:5050/auth/linkedin/callback',
    scope: ['openid', 'profile', 'email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      if (!profile.emails || !profile.emails[0]) {
        return done(new Error('No email from LinkedIn'), null);
      }
      const email = profile.emails[0].value;
      let user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            auth_provider: 'linkedin',
            is_email_verified: true,
            role: 'professional'
          }
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }));
}

module.exports = passport;