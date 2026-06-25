const express = require('express');
const path = require('path');
const fs = require('fs');
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

// API to sync localStorage data to the server
app.post('/api/sync', (req, res) => {
  try {
    const reservations = req.body;
    if (!Array.isArray(reservations)) {
      return res.status(400).json({ success: false, error: 'Invalid data format' });
    }
    // Safety check for write capabilities
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(reservations, null, 2));
      res.json({ success: true, message: 'LocalStorage successfully synced to server file.' });
    } catch (writeErr) {
      console.warn("Write failed (expected on serverless platforms):", writeErr.message);
      res.json({ success: true, message: 'Server is running serverless (read-only), synced via browser memory.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API to retrieve synced data from the server
app.get('/api/reservations', (req, res) => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      res.json(JSON.parse(data));
    } else {
      res.json([]);
    }
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
