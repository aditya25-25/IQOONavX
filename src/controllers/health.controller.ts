import { Request, Response } from 'express';
import { config } from '../config/env';

export const getHealth = (_req: Request, res: Response) => {
  return res.status(200).json({
    status: 'ok',
    service: 'IQOO NavX API',
    version: '1.0.0',
    environment: config.NODE_ENV,
    timestamp: new Date().toISOString(),
    integrations: {
      supabase: config.hasSupabase,
      googleRoutes: config.hasGoogleRoutes,
      googlePlaces: config.hasGooglePlaces,
      googleGeocoding: config.hasGoogleGeocoding,
      geminiAi: config.hasGemini,
    },
  });
};
