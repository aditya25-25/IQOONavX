import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rootRouter from './routes';
import { errorHandler } from './middleware/error.middleware';
import { generalRateLimiter } from './middleware/rateLimiter.middleware';
import { requestLogger } from './middleware/logger.middleware';
import { NotFoundError } from './lib/errors';
import { config } from './config/env';

export const createApp = (): Application => {
  const app: Application = express();

  // 1. Security Headers via Helmet
  app.use(helmet());

  // 2. CORS configuration
  const allowedOrigins = [
    config.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
  ].filter(Boolean);

  app.use(
    cors({
      origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // Allow requests with no origin (like mobile apps, curl, or server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || config.NODE_ENV === 'development') {
          return callback(null, true);
        }
        return callback(new Error('CORS policy: Not allowed by origin.'));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // 3. Body parsers with strict size limits
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // 4. Request Logging & Rate Limiting
  app.use(requestLogger);
  app.use('/api', generalRateLimiter);

  // 5. Mount API Routes
  app.use('/', rootRouter);

  // 6. 404 Route Handler
  app.use((req: Request, _res: Response, next: NextFunction) => {
    next(new NotFoundError(`Cannot ${req.method} ${req.originalUrl} on this server.`));
  });

  // 7. Centralized Error Handler
  app.use(errorHandler);

  return app;
};

export const app = createApp();
export default app;
