import { FastifyReply } from 'fastify';

export const sendSuccess = (
  reply: FastifyReply,
  data: any,
  message?: string,
  statusCode: number = 200
) => {
  return reply.status(statusCode).send({
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  });
};

export const sendError = (
  reply: FastifyReply,
  error: string,
  message: string,
  statusCode: number = 500
) => {
  return reply.status(statusCode).send({
    success: false,
    error,
    message,
    statusCode,
    timestamp: new Date().toISOString(),
  });
};
