const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/swagod';

// Middleware
app.use(cors());
app.use(express.json());

// Custom logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// MongoDB Connection
mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB (Swagod Backend)'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Demo Swagod Routes (tailored logic)
app.get('/api/swagod/status', (req, res) => {
    res.json({
        brand: 'SWAGOD',
        motto: 'WEAR THE FUTURE. FEAR THE PAST.',
        dbConnected: mongoose.connection.readyState === 1
    });
});

// Error Catching Middleware
app.use((err, req, res, _next) => {
    console.error('🔥 Error caught by Middleware:', err.stack);
    res.status(500).json({
        success: false,
        error: 'INTERNAL_SYSTEM_FAILURE',
        message: err.message || 'An unexpected error occurred'
    });
});

// Basic Route
app.get('/', (req, res) => {
    res.json({
        message: 'SWAGOD API SERVER // ONLINE',
        status: 'READY',
        version: '1.2.0'
    });
});

// Server Listen
app.listen(PORT, () => {
    console.log(`🚀 Swagod Server running on port ${PORT} using nodemon`);
});
