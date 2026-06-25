const express = require('express');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve static assets from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve static assets from mockup folders
app.use('/mockup01', express.static(path.join(__dirname, 'mockup01')));
app.use('/mockup02', express.static(path.join(__dirname, 'mockup02')));
app.use('/mockup03', express.static(path.join(__dirname, 'mockup03')));
app.use('/mockup04', express.static(path.join(__dirname, 'mockup04')));
app.use('/mockup05', express.static(path.join(__dirname, 'mockup05')));
app.use('/mockup-src', express.static(path.join(__dirname, 'mockup-src')));

// Explicit mockup index routers to avoid trailing slash issues
app.get('/mockup01', (req, res) => {
  res.sendFile(path.join(__dirname, 'mockup01', 'index.html'));
});
app.get('/mockup02', (req, res) => {
  res.sendFile(path.join(__dirname, 'mockup02', 'index.html'));
});
app.get('/mockup03', (req, res) => {
  res.sendFile(path.join(__dirname, 'mockup03', 'index.html'));
});
app.get('/mockup04', (req, res) => {
  res.sendFile(path.join(__dirname, 'mockup04', 'index.html'));
});
app.get('/mockup05', (req, res) => {
  res.sendFile(path.join(__dirname, 'mockup05', 'index.html'));
});

// Explicit clean URL page mapping
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about', 'index.html'));
});

app.get('/curriculum', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'curriculum', 'index.html'));
});

app.get('/ecosystem', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'ecosystem', 'index.html'));
});

app.get('/admissions', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admissions', 'index.html'));
});

app.get('/mockups', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mockups', 'index.html'));
});

// File paths for 간이 DB (for backup sync)
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'reservations.json');

// Ensure data folder exists with safety wrapping for read-only filesystem environments (Vercel)
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (err) {
  console.warn("Read-only filesystem detected, data folder creation skipped:", err.message);
}

// Date formatter helper to match client expectation
function formatPreferredDate(date) {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// API to sync localStorage data to the server (with Neon DB and fallback to file DB)
app.post('/api/sync', async (req, res) => {
  try {
    const reservations = req.body;
    if (!Array.isArray(reservations)) {
      return res.status(400).json({ success: false, error: 'Invalid data format' });
    }

    // 1. Primary Sync: Save to Neon DB using Prisma upsert
    try {
      const upsertPromises = reservations.map(item => {
        const preferredDate = item.preferredDate ? new Date(item.preferredDate) : new Date();
        const createdAt = item.createdAt ? new Date(item.createdAt) : new Date();

        return prisma.consultation.upsert({
          where: { id: item.id },
          update: {
            studentName: item.studentName || '',
            grade: item.grade || '',
            parentContact: item.parentContact || '',
            interestedCourse: item.interestedCourse || '',
            preferredDate: preferredDate,
            privacyConsent: item.privacyConsent === true || item.privacyConsent === 'true',
            status: item.status || 'pending',
            createdAt: createdAt
          },
          create: {
            id: item.id,
            studentName: item.studentName || '',
            grade: item.grade || '',
            parentContact: item.parentContact || '',
            interestedCourse: item.interestedCourse || '',
            preferredDate: preferredDate,
            privacyConsent: item.privacyConsent === true || item.privacyConsent === 'true',
            status: item.status || 'pending',
            createdAt: createdAt
          }
        });
      });

      await Promise.all(upsertPromises);
      console.log('Successfully synchronized bookings with Neon database.');
    } catch (dbErr) {
      console.error('Neon DB Sync failed, falling back to local file operations:', dbErr.message);
    }

    // 2. Secondary Sync: Backup to local file storage (if writable)
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(reservations, null, 2));
    } catch (writeErr) {
      console.warn("Write to local backup failed (Expected on serverless read-only platforms):", writeErr.message);
    }

    res.json({ success: true, message: 'LocalStorage synced. Processed via DB integration & local backup fallback.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API to retrieve synced data from the server
app.get('/api/reservations', async (req, res) => {
  try {
    let dataLoaded = false;
    let reservations = [];

    // 1. Primary Fetch: Load from Neon DB
    try {
      const dbReservations = await prisma.consultation.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      if (dbReservations && dbReservations.length > 0) {
        reservations = dbReservations.map(item => ({
          id: item.id,
          studentName: item.studentName,
          grade: item.grade,
          parentContact: item.parentContact,
          interestedCourse: item.interestedCourse,
          preferredDate: formatPreferredDate(item.preferredDate),
          privacyConsent: item.privacyConsent,
          status: item.status,
          createdAt: item.createdAt ? item.createdAt.toISOString() : new Date().toISOString()
        }));
        dataLoaded = true;
        console.log('Successfully fetched reservations from Neon DB.');
      }
    } catch (dbErr) {
      console.error('Failed to fetch from Neon DB, falling back to local file:', dbErr.message);
    }

    // 2. Secondary Fetch (Fallback): Load from local json file
    if (!dataLoaded) {
      if (fs.existsSync(DATA_FILE)) {
        const fileData = fs.readFileSync(DATA_FILE, 'utf8');
        reservations = JSON.parse(fileData);
        console.log('Fetched reservations from local backup file.');
      }
    }

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Only listen if run directly (local development) to prevent Vercel Serverless crashes
if (process.env.NODE_ENV !== 'production' && require.main === module) {
  app.listen(PORT, () => {
    console.log(`IEA Server is running on http://localhost:${PORT}`);
  });
}

// Export the Express app for Vercel Serverless Function binding
module.exports = app;
