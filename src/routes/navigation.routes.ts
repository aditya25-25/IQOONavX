import { Router } from 'express';
import { NavigationController } from '../controllers/navigation.controller';
import { validate } from '../middleware/validate.middleware';
import { z } from 'zod';

const router = Router();

const routeRequestSchema = {
  body: z.object({
    origin: z.object({
      latitude: z.number().min(-90, 'Origin latitude must be between -90 and 90').max(90),
      longitude: z.number().min(-180, 'Origin longitude must be between -180 and 180').max(180),
    }),
    destination: z.object({
      latitude: z.number().min(-90, 'Destination latitude must be between -90 and 90').max(90),
      longitude: z.number().min(-180, 'Destination longitude must be between -180 and 180').max(180),
    }),
    travelMode: z.enum(['driving', 'walking', 'cycling', 'two_wheeler', 'monster']).optional(),
    avoidTolls: z.boolean().optional(),
    avoidHighways: z.boolean().optional(),
    monsterOptimization: z.boolean().optional(),
  }),
};

router.post('/route', validate(routeRequestSchema), NavigationController.calculateRoute);

export const navigationRoutes = router;
