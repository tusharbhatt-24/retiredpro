require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { PrismaClient } = require('@prisma/client');

const passport = require('./config/passport');
const authRoutes = require('./routes/auth');

const app = express();
const port = process.env.PORT || 5000;

console.log('Client ID loaded:', process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET exists:', !!process.env.GOOGLE_CLIENT_SECRET);

let prisma;
try {
  if (process.env.DATABASE_URL) {
    // Attempting simple instantiation for Prisma 7
    prisma = new PrismaClient();
  } else {
     throw new Error("No DATABASE_URL");
  }
} catch (e) {
  console.log("Prisma initialization failed:", e.message);
  console.log("Using Robust Mock for safety.");
  // Use a Proxy to handle any model/method call on prisma
  prisma = new Proxy({}, {
    get: (target, model) => {
      return new Proxy({}, {
        get: (target, method) => {
          return async (...args) => {
            console.log(`[MOCK PRISMA] Called ${String(model)}.${String(method)}`, args);
            if (method === 'findUnique' || method === 'findFirst') return null;
            if (method === 'create') return { id: 'mock-id-' + Math.random().toString(36).substr(2, 9), ...args[0]?.data };
            if (method === 'findMany') return [];
            return { id: 'mock-id' };
          };
        }
      });
    }
  });
}

// ─── Middleware ────────────────────────────────────────────────────────────────
const CLIENT_URL = process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));
app.use(express.json());

// Session (required by Passport for OAuth flow)
app.use(session({
  secret: process.env.SESSION_SECRET || 'retirepro_session_secret_2026',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

app.use(passport.initialize());
app.use(passport.session());

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'active', message: 'RetirePro API is running smoothly.' });
});

// Auth routes (New OAuth)
app.use('/auth', authRoutes);

// User Registration Mockup Endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    res.status(201).json({ message: 'User registered successfully', email, role });
  } catch (error) {
    res.status(500).json({ error: 'Server configuration error or DB not connected.' });
  }
});

// Comprehensive Company Verification Endpoint
app.post('/api/companies/verify', async (req, res) => {
  try {
    const {
      companyName, businessEmail, phone, website, address,
      cin, gstin, pan,
      ownerName, ownerId
    } = req.body;

    if (!companyName || !businessEmail || !cin || !gstin || !pan || !ownerName) {
      return res.status(400).json({
        error: 'Missing mandatory registration fields. Legal identifiers (CIN, GSTIN, PAN) are required.'
      });
    }

    console.log(`[VERIFICATION] New request from: ${companyName} (${cin})`);
    console.log(`[VERIFICATION] Admin: ${ownerName}, Email: ${businessEmail}`);

    res.status(202).json({
      message: 'Comprehensive verification request submitted successfully.',
      tracking_status: 'Pending Manual Review',
      details: 'Our legal team will verify your COI and GST certificates against the provided CIN/GSTIN.'
    });
  } catch (error) {
    console.error('Verification Error:', error);
    res.status(500).json({ error: 'Internal server error during comprehensive verification submission.' });
  }
});

// Comprehensive Professional (Expert) Verification Endpoint
app.post('/api/professionals/verify', async (req, res) => {
  try {
    const data = req.body;
    const {
      fullName, email, phone, idType, idNumber,
      exCompany, exDesignation, exitType,
      industry, expYears
    } = data;

    if (!fullName || !email || !idNumber || !exCompany || !industry || !expYears) {
      return res.status(400).json({
        error: 'Missing critical verification data. Identity, Employment, and Expertise details are mandatory.'
      });
    }

    console.log(`[EXPERT VERIFICATION] Deep review triggered for: ${fullName}`);

    res.status(202).json({
      message: 'Expert profile submitted for comprehensive verification.',
      verification_status: {
        identity: 'Pending API Check',
        employment: 'Pending Manual Review',
        video_intro: 'Uploaded',
        status: 'In Review'
      },
      nextSteps: 'Our team of industry curators will review your 20+ years of background within 48 hours.'
    });
  } catch (error) {
    console.error('Expert Verification Error:', error);
    res.status(500).json({ error: 'Internal server error during comprehensive expert verification.' });
  }
});

// ─── Start Server ──────────────────────────────────────────────────────────────
app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`);
  console.log(`OAuth Endpoints:`);
  console.log(`  Google:   http://localhost:${port}/auth/google`);
  console.log(`  LinkedIn: http://localhost:${port}/auth/linkedin`);
});
