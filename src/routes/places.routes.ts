import { Router } from 'express';
import { PlacesController } from '../controllers/places.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { z } from 'zod';

const router = Router();

const createPlaceSchema = {
  body: z.object({
    name: z.string().min(1, 'Place name is required').max(100, 'Place name too long'),
    latitude: z
      .number({ invalid_type_error: 'Latitude must be a number' })
      .min(-90, 'Latitude must be >= -90')
      .max(90, 'Latitude must be <= 90'),
    longitude: z
      .number({ invalid_type_error: 'Longitude must be a number' })
      .min(-180, 'Longitude must be >= -180')
      .max(180, 'Longitude must be <= 180'),
    address: z.string().optional(),
    category: z.string().optional(),
  }),
};

const updatePlaceSchema = {
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    address: z.string().optional(),
    category: z.string().optional(),
  }),
};

// Place search endpoint (supports optional auth or public)
router.get('/search', PlacesController.searchPlaces);

// User saved places (requires authentication)
router.get('/', requireAuth, PlacesController.getSavedPlaces);
router.post('/', requireAuth, validate(createPlaceSchema), PlacesController.createSavedPlace);
router.get('/:id', requireAuth, PlacesController.getSavedPlaceById);
router.put('/:id', requireAuth, validate(updatePlaceSchema), PlacesController.updateSavedPlace);
router.delete('/:id', requireAuth, PlacesController.deleteSavedPlace);

export const placesRoutes = router;
