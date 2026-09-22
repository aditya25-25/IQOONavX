import { Request, Response, NextFunction } from 'express';
import { GeocodingService } from '../services/geocoding.service';
import { sendSuccess } from '../utils/response';
import { BadRequestError } from '../lib/errors';

export class GeocodeController {
  /**
   * GET /api/v1/geocode?address=...
   */
  static async geocode(req: Request, res: Response, next: NextFunction) {
    try {
      const address = req.query.address as string;
      if (!address || address.trim().length === 0) {
        throw new BadRequestError('Address query parameter is required.');
      }

      const result = await GeocodingService.geocodeAddress(address);
      return sendSuccess(res, result);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * GET /api/v1/reverse-geocode?lat=...&lng=...
   */
  static async reverseGeocode(req: Request, res: Response, next: NextFunction) {
    try {
      const latStr = (req.query.lat || req.query.latitude) as string;
      const lngStr = (req.query.lng || req.query.longitude) as string;

      if (!latStr || !lngStr) {
        throw new BadRequestError('Both "lat" and "lng" query parameters are required.');
      }

      const latitude = parseFloat(latStr);
      const longitude = parseFloat(lngStr);

      if (isNaN(latitude) || latitude < -90 || latitude > 90) {
        throw new BadRequestError('Latitude must be a valid number between -90 and 90.');
      }
      if (isNaN(longitude) || longitude < -180 || longitude > 180) {
        throw new BadRequestError('Longitude must be a valid number between -180 and 180.');
      }

      const result = await GeocodingService.reverseGeocode(latitude, longitude);
      return sendSuccess(res, result);
    } catch (error) {
      return next(error);
    }
  }
}
