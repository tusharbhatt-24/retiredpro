const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 5000;

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

// Start Server
app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`);
});
