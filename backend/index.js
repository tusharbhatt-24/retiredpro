const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
let prisma = null;
try {
  // Mock prismaclient initialization to prevent crashing when no db url is provided
  prisma = new PrismaClient({ 
    datasourceUrl: process.env.DATABASE_URL || "postgresql://mock:mock@localhost:5432/mock" 
  });
} catch (e) {
  console.log("Prisma skipping initialization until DB URL is added.");
}

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'active', message: 'RetirePro API is running smoothly.' });
});

// User Registration Mockup Endpoint
app.post('/api/auth/register', async (req, res) => {
  // Try using prisma safely if configured, else return mock
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // In actual implementation, we hash password here with bcrypt
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

    // Basic validation for mandatory legal fields
    if (!companyName || !businessEmail || !cin || !gstin || !pan || !ownerName) {
      return res.status(400).json({ 
        error: 'Missing mandatory registration fields. Legal identifiers (CIN, GSTIN, PAN) are required.' 
      });
    }
    
    console.log(`[VERIFICATION] New request from: ${companyName} (${cin})`);
    console.log(`[VERIFICATION] Admin: ${ownerName}, Email: ${businessEmail}`);

    // In a production environment, we would:
    // 1. Save all data to the Company model in Postgres via Prisma.
    // 2. Queue background checks for GSTIN/CIN via Government APIs.
    // 3. Mark the company as verification_status: 'pending'.

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
    console.log(`[EXPERT VERIFICATION] Context: ${exDesignation} at ${exCompany}, Industry: ${industry}`);
    console.log(`[EXPERT VERIFICATION] Documents: Retirement Letter, ${idType} (${idNumber})`);

    // In production:
    // 1. Save all fields to Professional model.
    // 2. Trigger ID verification (Aadhaar/PAN API).
    // 3. Queue manual document and video review.

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


// Start Server
app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`);
});
