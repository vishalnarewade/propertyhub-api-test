require('dotenv').config();
require('express-async-errors');

const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();
connectDB();

const requestBucket = new Map();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const bucket = requestBucket.get(ip);

  if (!bucket || now > bucket.expiresAt) {
    requestBucket.set(ip, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  if (bucket.count >= RATE_LIMIT_MAX) {
    return res.status(429).json({
      message: 'Too many requests. Please try again in a minute.'
    });
  }

  bucket.count += 1;
  requestBucket.set(ip, bucket);
  next();
};

const allowedOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : ['http://localhost:5173'],
    credentials: true
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));
// app.use(rateLimiter);
app.use('/uploads', express.static(path.join(process.cwd(), 'backend', 'uploads')));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/enquiries', enquiryRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
