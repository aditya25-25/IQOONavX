import { app } from './app';
import { config } from './config/env';
import { logger } from './lib/logger';

const server = app.listen(config.PORT, () => {
  logger.info(`=======================================================`);
  logger.info(`⚡ IQOO NavX Backend Server running on port ${config.PORT}`);
  logger.info(`📡 Environment: ${config.NODE_ENV}`);
  logger.info(`🔗 Health endpoint: http://localhost:${config.PORT}/health`);
  logger.info(`🚀 API Base: http://localhost:${config.PORT}/api/v1`);
  logger.info(`=======================================================`);
});

// Graceful shutdown handlers
const shutdown = () => {
  logger.info('Received termination signal. Closing HTTP server...');
  server.close(() => {
    logger.info('HTTP server closed. Exiting process.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
