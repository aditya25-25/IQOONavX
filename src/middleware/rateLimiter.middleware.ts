import rateLimit from 'express-rate-limit';
import { config } from '../config/env';

export const generalRateLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests created from this IP, please try again after 15 minutes.',
    },
  },
  skip: () => config.NODE_ENV === 'test',
});

export const aiRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 25, // max 25 AI prompts per 5 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'AI_RATE_LIMIT_EXCEEDED',
      message: 'AI assistant request quota reached. Please wait a few moments before requesting more routing advice.',
    },
  },
  skip: () => config.NODE_ENV === 'test',
});
