import { Router } from 'express';
import { GeocodeController } from '../controllers/geocode.controller';

const router = Router();

router.get('/', GeocodeController.geocode);
router.get('/reverse-geocode', GeocodeController.reverseGeocode);

export const geocodeRoutes = router;
