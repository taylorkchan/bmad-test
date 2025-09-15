const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Initialize database
require('./db/database');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
// Temporarily permissive CORS for Flutter web development
app.use(cors({
  origin: true, // Allow all origins during development
  credentials: true
}));

// Rate limiting (more permissive for development)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // limit each IP to 1000 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Simple Medicine Logger API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes will be added here
app.use('/api/medications', require('./routes/medications'));
app.use('/api/users', require('./routes/users'));
app.use('/api/ocr', require('./routes/ocr'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});