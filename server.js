const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve static assets from the public folder
app.use(express.static(path.join(__dirname, 'public')));

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

// File paths for 간이 DB (for backup sync)
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'reservations.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// API to sync localStorage data to the server
app.post('/api/sync', (req, res) => {
  try {
    const reservations = req.body;
    if (!Array.isArray(reservations)) {
      return res.status(400).json({ success: false, error: 'Invalid data format' });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(reservations, null, 2));
    res.json({ success: true, message: 'LocalStorage successfully synced to server file.' });
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

app.listen(PORT, () => {
  console.log(`IEA Server is running on http://localhost:${PORT}`);
});
