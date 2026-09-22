import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../utils/response';
import { UnauthorizedError } from '../lib/errors';

export class AuthController {
  /**
   * POST /api/v1/auth/session
   * Verifies incoming session token and returns user profile.
   */
  static async verifySession(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError('No active authentication session found.');
      }

      return sendSuccess(res, {
        user: req.user,
        authenticated: true,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * GET /api/v1/auth/me
   * Returns current authenticated user profile.
   */
  static async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User is not authenticated.');
      }

      return sendSuccess(res, {
        user: req.user,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * POST /api/v1/auth/logout
   * Handles session logout on backend.
   */
  static async logout(_req: Request, res: Response) {
    return sendSuccess(res, {
      message: 'Successfully logged out of iQOO NavX session.',
    });
  }
}
