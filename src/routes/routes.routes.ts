import { Router } from 'express';
import { RoutesController } from '../controllers/routes.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { z } from 'zod';

const router = Router();

const createRouteSchema = {
  body: z.object({
    source_name: z.string().min(1, 'Source name is required'),
    destination_name: z.string().min(1, 'Destination name is required'),
    source_latitude: z.number().min(-90).max(90).optional(),
    source_longitude: z.number().min(-180).max(180).optional(),
    dest_latitude: z.number().min(-90).max(90).optional(),
    dest_longitude: z.number().min(-180).max(180).optional(),
    distance: z.number({ invalid_type_error: 'Distance must be a number' }).positive('Distance must be positive'),
    duration: z.number({ invalid_type_error: 'Duration must be a number' }).positive('Duration must be positive'),
    travel_mode: z.string().optional(),
  }),
};

router.get('/recent', requireAuth, RoutesController.getRecentRoutes);
router.post('/recent', requireAuth, validate(createRouteSchema), RoutesController.createRecentRoute);
router.delete('/recent/:id', requireAuth, RoutesController.deleteRecentRoute);

export const routesRoutes = router;
