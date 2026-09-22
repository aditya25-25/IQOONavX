import { Router } from 'express';
import { getHealth } from '../controllers/health.controller';
import { authRoutes } from './auth.routes';
import { placesRoutes } from './places.routes';
import { routesRoutes } from './routes.routes';
import { preferencesRoutes } from './preferences.routes';
import { navigationRoutes } from './navigation.routes';
import { geocodeRoutes } from './geocode.routes';
import { aiRoutes } from './ai.routes';

const rootRouter = Router();

// Unversioned Health Check
rootRouter.get('/health', getHealth);

// API v1 Router
const v1Router = Router();
v1Router.use('/auth', authRoutes);
v1Router.use('/places', placesRoutes);
v1Router.use('/routes', routesRoutes);
v1Router.use('/preferences', preferencesRoutes);
v1Router.use('/navigation', navigationRoutes);
v1Router.use('/geocode', geocodeRoutes);
v1Router.use('/ai', aiRoutes);

// Mount versioned routes
rootRouter.use('/api/v1', v1Router);

export default rootRouter;
