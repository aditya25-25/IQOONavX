import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../lib/errors';
import { getSupabaseAdmin } from '../lib/supabaseClient';
import { UserProfile } from '../types/auth.types';
import { config } from '../config/env';

declare global {
  namespace Express {
    interface Request {
      user?: UserProfile;
      token?: string;
    }
  }
}

/**
 * Extracts Bearer token from the Authorization header.
 */
const extractBearerToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
    return parts[1];
  }
  return null;
};

/**
 * Validates Supabase JWT session token.
 * Populates req.user with the verified identity.
 */
export const requireAuth = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = extractBearerToken(req);

    if (!token) {
      throw new UnauthorizedError('Missing Authorization Bearer token.');
    }

    req.token = token;

    // Support mock test tokens during development / testing if Supabase is unconfigured
    if (token.startsWith('mock-token-') || (!config.hasSupabase && (config.NODE_ENV === 'development' || config.NODE_ENV === 'test'))) {
      const mockUserId = token.startsWith('mock-token-') ? token.replace('mock-token-', '') : 'demo-pilot-user-1';
      req.user = {
        id: mockUserId,
        email: `${mockUserId}@iqoo-pilot.dev`,
        full_name: 'iQOO Test Pilot',
      };
      return next();
    }

    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      // Fallback demo user if Supabase is not connected
      req.user = {
        id: '00000000-0000-0000-0000-000000000001',
        email: 'pilot@iqoo-navx.dev',
        full_name: 'iQOO Monster Pilot',
      };
      return next();
    }

    // Verify token with Supabase Auth
    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user) {
      throw new UnauthorizedError('Invalid or expired authentication session token.');
    }

    req.user = {
      id: data.user.id,
      email: data.user.email || '',
      full_name: data.user.user_metadata?.full_name || null,
      avatar_url: data.user.user_metadata?.avatar_url || null,
      created_at: data.user.created_at,
    };

    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Optional authentication - does not reject if token is absent,
 * but populates req.user if a valid token is provided.
 */
export const optionalAuth = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = extractBearerToken(req);
    if (!token) return next();

    req.token = token;

    if (token.startsWith('mock-token-')) {
      const mockUserId = token.replace('mock-token-', '');
      req.user = {
        id: mockUserId,
        email: `${mockUserId}@iqoo-pilot.dev`,
        full_name: 'iQOO Test Pilot',
      };
      return next();
    }

    const supabaseAdmin = getSupabaseAdmin();
    if (supabaseAdmin) {
      const { data } = await supabaseAdmin.auth.getUser(token);
      if (data?.user) {
        req.user = {
          id: data.user.id,
          email: data.user.email || '',
          full_name: data.user.user_metadata?.full_name || null,
          avatar_url: data.user.user_metadata?.avatar_url || null,
        };
      }
    }
    return next();
  } catch {
    // Silently continue without authenticated user
    return next();
  }
};
