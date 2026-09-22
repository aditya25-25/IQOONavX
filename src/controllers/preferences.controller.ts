import { Request, Response, NextFunction } from 'express';
import { SupabaseService } from '../services/supabase.service';
import { sendSuccess } from '../utils/response';
import { UnauthorizedError } from '../lib/errors';

export class PreferencesController {
  static async getPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      const prefs = await SupabaseService.getPreferences(req.user.id, req.token);
      return sendSuccess(res, prefs);
    } catch (error) {
      return next(error);
    }
  }

  static async updatePreferences(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      const prefs = await SupabaseService.updatePreferences(req.user.id, req.body, req.token);
      return sendSuccess(res, prefs);
    } catch (error) {
      return next(error);
    }
  }
}
