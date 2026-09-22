import { Router } from 'express';
import { AIController } from '../controllers/ai.controller';
import { aiRateLimiter } from '../middleware/rateLimiter.middleware';
import { validate } from '../middleware/validate.middleware';
import { z } from 'zod';

const router = Router();

const aiRequestSchema = {
  body: z.object({
    destination: z.string().min(1, 'Destination is required for navigation advice').max(200),
    origin: z.string().max(200).optional(),
    travelMode: z.enum(['driving', 'walking', 'cycling', 'two_wheeler', 'monster']).optional(),
    routeSummary: z
      .object({
        distance: z.string().optional(),
        duration: z.string().optional(),
        currentStreet: z.string().optional(),
        trafficCondition: z.string().optional(),
        eta: z.string().optional(),
      })
      .optional(),
    userQuery: z.string().max(300).optional(),
  }),
};

router.post(
  '/navigation-assistant',
  aiRateLimiter,
  validate(aiRequestSchema),
  AIController.getAssistantAdvice
);

export const aiRoutes = router;
