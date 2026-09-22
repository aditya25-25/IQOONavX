import { Request, Response, NextFunction } from 'express';
import { SupabaseService } from '../services/supabase.service';
import { sendSuccess } from '../utils/response';
import { UnauthorizedError } from '../lib/errors';

export class RoutesController {
  static async getRecentRoutes(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const routes = await SupabaseService.getRecentRoutes(req.user.id, limit, req.token);
      return sendSuccess(res, routes);
    } catch (error) {
      return next(error);
    }
  }

  static async createRecentRoute(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      const route = await SupabaseService.createRecentRoute(req.user.id, req.body, req.token);
      return sendSuccess(res, route, 201);
    } catch (error) {
      return next(error);
    }
  }

  static async deleteRecentRoute(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      const { id } = req.params;
      await SupabaseService.deleteRecentRoute(id, req.user.id, req.token);
      return sendSuccess(res, { message: 'Recent route log removed successfully.' });
    } catch (error) {
      return next(error);
    }
  }
}
