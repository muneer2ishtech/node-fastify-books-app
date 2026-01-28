import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import logger from '../utils/logger';

export const errorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  // Log error
  logger.error('Request error:', {
    method: request.method,
    url: request.url,
    statusCode,
    message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    body: request.body,
    params: request.params,
    query: request.query,
  });

  // Send error response
  reply.status(statusCode).send({
    success: false,
    error: error.name || 'Error',
    message,
    statusCode,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

export const notFoundHandler = (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  reply.status(404).send({
    success: false,
    error: 'Not Found',
    message: `Route ${request.method} ${request.url} not found`,
    statusCode: 404,
    timestamp: new Date().toISOString(),
  });
};
