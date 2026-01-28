import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

// Validation schemas
export const bookCreateSchema = z.object({
  title: z.string().min(1).max(255),
  author: z.string().min(1).max(255),
  year: z.number().int().min(0).max(new Date().getFullYear()),
  price: z.number().positive(),
  description: z.string().max(1000).optional(),
  is_active: z.boolean().optional().default(true),
});

export const bookUpdateSchema = bookCreateSchema.partial();

export const bookQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  search: z.string().optional(),
  year: z.coerce.number().int().optional(),
  author: z.string().optional(),
  is_active: z.coerce.boolean().optional().default(true),
  sort_by: z.enum(['id', 'title', 'author', 'year', 'price']).optional().default('title'),
  sort_order: z.enum(['asc', 'desc']).optional().default('asc'),
});

export const idParamSchema = z.object({
  id: z.coerce.bigint().positive(),
});

// Validation middleware
export const validate = (schema: z.ZodSchema) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const validationResult = await schema.parseAsync({
        ...request.params,
        ...request.query,
        ...request.body,
      });
      request.validatedData = validationResult;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          error: 'Validation Error',
          message: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
        });
      }
      throw error;
    }
  };
};

// Type augmentation for Fastify
declare module 'fastify' {
  interface FastifyRequest {
    validatedData?: any;
  }
}
