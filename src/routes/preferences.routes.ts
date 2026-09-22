import { Router } from 'express';
import { PreferencesController } from '../controllers/preferences.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { z } from 'zod';

const router = Router();

const updatePreferencesSchema = {
  body: z.object({
    voice_enabled: z.boolean().optional(),
    dark_mode: z.boolean().optional(),
    travel_mode: z
      .enum(['driving', 'walking', 'cycling', 'two_wheeler', 'monster'], {
        errorMap: () => ({ message: 'Invalid travel mode. Allowed: driving, walking, cycling, two_wheeler, monster' }),
      })
      .optional(),
    monster_mode_enabled: z.boolean().optional(),
    speed_unit: z.enum(['km/h', 'mph']).optional(),
    voice_language: z.string().optional(),
  }),
};

router.get('/', requireAuth, PreferencesController.getPreferences);
router.put('/', requireAuth, validate(updatePreferencesSchema), PreferencesController.updatePreferences);

export const preferencesRoutes = router;
