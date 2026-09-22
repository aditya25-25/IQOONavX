import { config } from '../config/env';

/**
 * Sanitizes input to prevent accidental credential, token, or password logging.
 */
function sanitize(value: any): any {
  if (!value) return value;

  if (typeof value === 'string') {
    return value
      .replace(/Bearer\s+[\w\-_.]+/gi, 'Bearer [REDACTED]')
      .replace(/(AIza[0-9A-Za-z-_]{35})/g, '[REDACTED_GOOGLE_KEY]')
      .replace(/(sk-[A-Za-z0-9-_]{20,})/g, '[REDACTED_API_KEY]')
      .replace(/(eyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*)/g, '[REDACTED_JWT]');
  }

  if (Array.isArray(value)) {
    return value.map(sanitize);
  }

  if (typeof value === 'object') {
    const cleanObj: Record<string, any> = {};
    for (const key of Object.keys(value)) {
      const lowerKey = key.toLowerCase();
      if (
        lowerKey.includes('password') ||
        lowerKey.includes('secret') ||
        lowerKey.includes('token') ||
        lowerKey.includes('authorization') ||
        lowerKey.includes('apikey') ||
        lowerKey.includes('api_key')
      ) {
        cleanObj[key] = '[REDACTED]';
      } else {
        cleanObj[key] = sanitize(value[key]);
      }
    }
    return cleanObj;
  }

  return value;
}

export const logger = {
  info: (message: string, meta?: any) => {
    if (config.NODE_ENV !== 'test') {
      const sanitizedMeta = meta ? sanitize(meta) : '';
      console.log(`[INFO] [${new Date().toISOString()}] ${message}`, sanitizedMeta);
    }
  },
  warn: (message: string, meta?: any) => {
    if (config.NODE_ENV !== 'test') {
      const sanitizedMeta = meta ? sanitize(meta) : '';
      console.warn(`[WARN] [${new Date().toISOString()}] ${message}`, sanitizedMeta);
    }
  },
  error: (message: string, error?: any) => {
    if (config.NODE_ENV !== 'test') {
      const sanitizedError = error ? (error instanceof Error ? { message: error.message, stack: config.NODE_ENV === 'development' ? error.stack : undefined } : sanitize(error)) : '';
      console.error(`[ERROR] [${new Date().toISOString()}] ${message}`, sanitizedError);
    }
  },
  debug: (message: string, meta?: any) => {
    if (config.NODE_ENV === 'development') {
      console.debug(`[DEBUG] [${new Date().toISOString()}] ${message}`, meta ? sanitize(meta) : '');
    }
  },
};
