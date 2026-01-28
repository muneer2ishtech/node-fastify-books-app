import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { config } from './config';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import { bookRoutes } from './routes/book.routes';
import db from './db';
import logger from './utils/logger';

export async function createApp(): Promise<FastifyInstance> {
  const app = fastify({
    logger: false,
    trustProxy: true,
    bodyLimit: 1048576, // 1MB
  });

  // Register plugins
  await app.register(cors, {
    origin: true,
    credentials: true,
  });

  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
      },
    },
  });

  // Swagger documentation
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Book Management API',
        description: 'High-performance Book Management API with Node.js, TypeScript, and Fastify',
        version: '1.0.0',
      },
      servers: [
        {
          url: `http://localhost:${config.PORT}${config.API_PREFIX}`,
          description: 'Development server',
        },
      ],
      tags: [
        {
          name: 'Books',
          description: 'Book related endpoints',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  });

  await app.register(swaggerUi, {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
  });

  // Database connection
  try {
    await db.connect();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Failed to connect to database:', error);
    process.exit(1);
  }

  // Health check endpoint
  app.get('/health', async () => {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  });

  // API routes
  app.register(async (apiApp) => {
    apiApp.register(bookRoutes, { prefix: '/books' });
  }, { prefix: config.API_PREFIX });

  // Error handlers
  app.setNotFoundHandler(notFoundHandler);
  app.setErrorHandler(errorHandler);

  // Graceful shutdown
  const gracefulShutdown = async () => {
    logger.info('Starting graceful shutdown...');
    
    try {
      await app.close();
      await db.disconnect();
      logger.info('Server shut down gracefully');
      process.exit(0);
    } catch (error) {
      logger.error('Error during graceful shutdown:', error);
      process.exit(1);
    }
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);

  return app;
}
