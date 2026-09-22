import { Request, Response, NextFunction } from 'express';
import { RoutesService } from '../services/routes.service';
import { sendSuccess } from '../utils/response';

export class NavigationController {
  /**
   * POST /api/v1/navigation/route
   * Calculates primary and alternative navigation routes with turn maneuvers.
   */
  static async calculateRoute(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await RoutesService.computeRoute(req.body);
      return sendSuccess(res, result);
    } catch (error) {
      return next(error);
    }
  }
}
