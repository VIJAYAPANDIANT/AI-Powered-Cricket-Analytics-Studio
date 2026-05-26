import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { loggingMiddleware } from './middleware/loggingMiddleware';
import { errorMiddleware } from './middleware/errorMiddleware';
import authRoutes from './routes/authRoutes';
import datasetRoutes from './routes/datasetRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import reportRoutes from './routes/reportRoutes';
import { analyticsService } from './services/analyticsService';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Setup CORS middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  exposedHeaders: ['Content-Disposition']
}));

// Setup Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import { rateLimiter } from './middleware/rateLimiter';
import { cacheMiddleware } from './middleware/cacheMiddleware';

// Setup Request Logger
app.use(loggingMiddleware);

// Apply Global Rate Limiting on API endpoints
app.use('/api', rateLimiter);

// Base Status Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'IPL InsightX REST API Server is online and ready.',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Setup API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dataset', datasetRoutes);
app.use('/api/analytics', cacheMiddleware, analyticsRoutes);
app.use('/api/reports', cacheMiddleware, reportRoutes);

// Global Error Handler
app.use(errorMiddleware);

// Start listening and initialize data
if (!process.env.VERCEL) {
  app.listen(PORT, async () => {
    console.log(`==================================================`);
    console.log(`  IPL InsightX REST Server running on port ${PORT} `);
    console.log(`  Target Frontend: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    console.log(`==================================================`);
    
    // Warm up analytics service on startup
    try {
      await analyticsService.initializeData();
    } catch (error) {
      console.error('Failed to initialize analytics service cache on startup:', error);
    }
  });
} else {
  // Warm up analytics service on serverless startup
  console.log('Running in serverless mode (Vercel). Skipping app.listen().');
  analyticsService.initializeData().catch((error) => {
    console.error('Failed to initialize analytics service cache on serverless startup:', error);
  });
}

export default app;
