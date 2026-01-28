import { createApp } from './app';
import { config } from './config';
import logger from './utils/logger';

async function startServer() {
  try {
    const app = await createApp();

    await app.listen({
      port: config.PORT,
      host: config.HOST,
    });

    logger.info(`Server running on http://${config.HOST}:${config.PORT}`);
    logger.info(`Environment: ${config.NODE_ENV}`);
    
    // Production-specific logging
    if (config.NODE_ENV === 'production') {
      logger.info('Production mode enabled');
      logger.info(`API Documentation: http://${config.HOST}:${config.PORT}/documentation`);
    }

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
