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
    logger.info(`API Documentation available on http://${config.HOST}:${config.PORT}/documentation`);
    logger.info(`Environment: ${config.NODE_ENV}`);

    // Log available routes
    app.ready(() => {
      const routes = app.routes.map(route => ({
        method: route.method,
        url: route.url,
      }));
      logger.debug('Registered routes:', { routes });
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
