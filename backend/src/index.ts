import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { ENV } from './config/env.js';
import healthRoutes from './routes/health.routes.js';
import wishesRoutes from './routes/wishes.routes.js';
import aiRoutes from './routes/ai.routes.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';

const app = express();

// Security and utility middleware
app.use(helmet());
app.use(morgan(ENV.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration supporting local dev and Vercel deployments
const allowedOrigins = ENV.FRONTEND_URL.split(',').map((url) => url.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes('*') ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost')
      ) {
        return callback(null, true);
      }

      console.warn(`Blocked by CORS: origin ${origin}`);
      return callback(new Error(`CORS origin not allowed: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Mount routes
app.use('/', healthRoutes);
app.use('/api/wishes', wishesRoutes);
app.use('/api/ai', aiRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(ENV.PORT, () => {
  console.log(`🚀 Wishora Backend API running on port ${ENV.PORT} (${ENV.NODE_ENV})`);
  console.log(`📡 Allowed frontend origins: ${ENV.FRONTEND_URL}`);
});

export default app;
