import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.post('/session', requireAuth, AuthController.verifySession);
router.get('/me', requireAuth, AuthController.getCurrentUser);
router.post('/logout', AuthController.logout);

export const authRoutes = router;
