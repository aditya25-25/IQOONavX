import { Request, Response, NextFunction } from 'express';
import { SupabaseService } from '../services/supabase.service';
import { PlacesService } from '../services/places.service';
import { sendSuccess } from '../utils/response';
import { UnauthorizedError } from '../lib/errors';

export class PlacesController {
  static async getSavedPlaces(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      const places = await SupabaseService.getSavedPlaces(req.user.id, req.token);
      return sendSuccess(res, places);
    } catch (error) {
      return next(error);
    }
  }

  static async getSavedPlaceById(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      const { id } = req.params;
      const place = await SupabaseService.getSavedPlaceById(id, req.user.id, req.token);
      return sendSuccess(res, place);
    } catch (error) {
      return next(error);
    }
  }

  static async createSavedPlace(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      const place = await SupabaseService.createSavedPlace(req.user.id, req.body, req.token);
      return sendSuccess(res, place, 201);
    } catch (error) {
      return next(error);
    }
  }

  static async updateSavedPlace(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      const { id } = req.params;
      const place = await SupabaseService.updateSavedPlace(id, req.user.id, req.body, req.token);
      return sendSuccess(res, place);
    } catch (error) {
      return next(error);
    }
  }

  static async deleteSavedPlace(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      const { id } = req.params;
      await SupabaseService.deleteSavedPlace(id, req.user.id, req.token);
      return sendSuccess(res, { message: 'Saved place deleted successfully.' });
    } catch (error) {
      return next(error);
    }
  }

  static async searchPlaces(req: Request, res: Response, next: NextFunction) {
    try {
      const query = (req.query.q as string) || (req.query.query as string) || '';
      const lat = req.query.lat ? parseFloat(req.query.lat as string) : undefined;
      const lng = req.query.lng ? parseFloat(req.query.lng as string) : undefined;

      const results = await PlacesService.searchPlaces(query, lat, lng);
      return sendSuccess(res, results);
    } catch (error) {
      return next(error);
    }
  }
}
