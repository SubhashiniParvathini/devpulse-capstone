import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize SQLite Database
const dbPath = path.join(__dirname, 'devpulse.db');
const db = new Database(dbPath);

// Enable foreign keys and WAL mode
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS standups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    yesterday_work TEXT NOT NULL,
    today_plan TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS blockers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    error_log TEXT,
    status TEXT DEFAULT 'open' CHECK(status IN ('open', 'investigating', 'resolved')),
    ai_suggestion TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Custom HTTP Error Class
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// Validation Helper
function requireText(value, field, max = 1000) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new HttpError(400, `${field} is required`);
  }
  if (value.length > max) {
    throw new HttpError(400, `${field} must be at most ${max} characters`);
  }
  return value.trim();
}

// --- STANDUP ROUTES ---

// Submit Standup
app.post('/api/standups', (req, res, next) => {
  try {
    const { userId = 'user_default', yesterdayWork, todayPlan } = req.body;
    const cleanYesterday = requireText(yesterdayWork, 'yesterday_work', 2000);
    const cleanToday = requireText(todayPlan, 'today_plan', 2000);

    const stmt = db.prepare('INSERT INTO standups (user_id, yesterday_work, today_plan) VALUES (?, ?, ?)');
    const info = stmt.run(userId, cleanYesterday, cleanToday);

    const newStandup = db.prepare('SELECT * FROM standups WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(newStandup);
  } catch (err) {
    next(err);
  }
});

// Get All Standups
app.get('/api/standups', (req, res, next) => {
  try {
    const standups = db.prepare('SELECT * FROM standups ORDER BY created_at DESC').all();
    res.json(standups);
  } catch (err) {
    next(err);
  }
});

// --- BLOCKER ROUTES ---

// Report Blocker with Mock AI Analysis
app.post('/api/blockers', (req, res, next) => {
  try {
    const { userId = 'user_default', title, errorLog } = req.body;
    const cleanTitle = requireText(title, 'title', 255);
    const cleanError = errorLog ? String(errorLog) : '';

    // Simulate AI troubleshooting generation based on error log
    let aiSuggestion = 'No error log provided. Please verify network and environment configuration.';
    if (cleanError.toLowerCase().includes('syntax') || cleanError.includes('token')) {
      aiSuggestion = 'AI Analysis: Looks like a syntax or parsing error. Check for missing brackets, commas, or quotes.';
    } else if (cleanError.toLowerCase().includes('timeout') || cleanError.toLowerCase().includes('etimedout')) {
      aiSuggestion = 'AI Analysis: Network timeout detected. Check your firewall settings and API endpoint availability.';
    } else if (cleanError.toLowerCase().includes('enoent') || cleanError.toLowerCase().includes('not found')) {
      aiSuggestion = 'AI Analysis: File or directory not found. Verify relative paths using path.join().';
    } else if (cleanError.trim()) {
      aiSuggestion = `AI Analysis: Reviewed error log "${cleanError.substring(0, 50)}...". Recommended action: Check stack trace and validate dependency versions.`;
    }

    const stmt = db.prepare('INSERT INTO blockers (user_id, title, error_log, status, ai_suggestion) VALUES (?, ?, ?, ?, ?)');
    const info = stmt.run(userId, cleanTitle, cleanError, 'open', aiSuggestion);

    const newBlocker = db.prepare('SELECT * FROM blockers WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(newBlocker);
  } catch (err) {
    next(err);
  }
});

// Get All Blockers
app.get('/api/blockers', (req, res, next) => {
  try {
    const blockers = db.prepare('SELECT * FROM blockers ORDER BY created_at DESC').all();
    res.json(blockers);
  } catch (err) {
    next(err);
  }
});

// Update Blocker Status
app.put('/api/blockers/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['open', 'investigating', 'resolved'].includes(status)) {
      throw new HttpError(400, 'Invalid status value');
    }

    const stmt = db.prepare('UPDATE blockers SET status = ? WHERE id = ?');
    const result = stmt.run(status, id);

    if (result.changes === 0) {
      throw new HttpError(404, 'Blocker not found');
    }

    const updated = db.prepare('SELECT * FROM blockers WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    error: status >= 500 ? 'Internal server error' : err.message,
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`DevPulse backend server running on http://localhost:${PORT}`);
});