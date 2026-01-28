import { FastifyInstance } from 'fastify';
import bookController from '../controllers/book.controller';
import { validate, bookCreateSchema, bookUpdateSchema, bookQuerySchema, idParamSchema } from '../middlewares/validation.middleware';

export async function bookRoutes(fastify: FastifyInstance) {
  // Tag for OpenAPI grouping
  const tags = ['Books'];

  // GET /api/v1/books - Get all books with pagination and filtering
  fastify.get('/', {
    schema: {
      tags,
      summary: 'Get all books',
      description: 'Retrieve a paginated list of books with filtering and sorting options',
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          search: { type: 'string' },
          year: { type: 'integer' },
          author: { type: 'string' },
          is_active: { type: 'boolean', default: true },
          sort_by: { 
            type: 'string', 
            enum: ['id', 'title', 'author', 'year', 'price'],
            default: 'title'
          },
          sort_order: { type: 'string', enum: ['asc', 'desc'], default: 'asc' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                data: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer' },
                      title: { type: 'string' },
                      author: { type: 'string' },
                      year: { type: 'integer' },
                      price: { type: 'string' },
                      is_active: { type: 'boolean' },
                      description: { type: 'string' },
                    },
                  },
                },
                pagination: {
                  type: 'object',
                  properties: {
                    page: { type: 'integer' },
                    limit: { type: 'integer' },
                    total: { type: 'integer' },
                    total_pages: { type: 'integer' },
                  },
                },
              },
            },
          },
        },
      },
    },
    preHandler: validate(bookQuerySchema),
    handler: bookController.getAllBooks,
  });

  // GET /api/v1/books/:id - Get book by ID
  fastify.get('/:id', {
    schema: {
      tags,
      summary: 'Get book by ID',
      description: 'Retrieve a specific book by its ID',
      params: {
        type: 'object',
        properties: {
          id: { type: 'integer', minimum: 1 },
        },
        required: ['id'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                title: { type: 'string' },
                author: { type: 'string' },
                year: { type: 'integer' },
                price: { type: 'string' },
                is_active: { type: 'boolean' },
                description: { type: 'string' },
              },
            },
          },
        },
        404: {
          type: 'object',
          properties: {
            success: { type: 'boolean', default: false },
            error: { type: 'string' },
            message: { type: 'string' },
            statusCode: { type: 'integer' },
          },
        },
      },
    },
    preHandler: validate(idParamSchema),
    handler: bookController.getBookById,
  });

  // POST /api/v1/books - Create new book
  fastify.post('/', {
    schema: {
      tags,
      summary: 'Create a new book',
      description: 'Create a new book record',
      body: {
        type: 'object',
        required: ['title', 'author', 'year', 'price'],
        properties: {
          title: { type: 'string', minLength: 1, maxLength: 255 },
          author: { type: 'string', minLength: 1, maxLength: 255 },
          year: { type: 'integer', minimum: 0 },
          price: { type: 'number', minimum: 0 },
          description: { type: 'string', maxLength: 1000 },
          is_active: { type: 'boolean', default: true },
        },
      },
      response: {
        201: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                title: { type: 'string' },
                author: { type: 'string' },
                year: { type: 'integer' },
                price: { type: 'string' },
                is_active: { type: 'boolean' },
                description: { type: 'string' },
              },
            },
            message: { type: 'string' },
          },
        },
        409: {
          type: 'object',
          properties: {
            success: { type: 'boolean', default: false },
            error: { type: 'string' },
            message: { type: 'string' },
            statusCode: { type: 'integer' },
          },
        },
      },
    },
    preHandler: validate(bookCreateSchema),
    handler: bookController.createBook,
  });

  // PUT /api/v1/books/:id - Update existing book
  fastify.put('/:id', {
    schema: {
      tags,
      summary: 'Update a book',
      description: 'Update an existing book record',
      params: {
        type: 'object',
        properties: {
          id: { type: 'integer', minimum: 1 },
        },
        required: ['id'],
      },
      body: {
        type: 'object',
        properties: {
          title: { type: 'string', minLength: 1, maxLength: 255 },
          author: { type: 'string', minLength: 1, maxLength: 255 },
          year: { type: 'integer', minimum: 0 },
          price: { type: 'number', minimum: 0 },
          description: { type: 'string', maxLength: 1000 },
          is_active: { type: 'boolean' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                title: { type: 'string' },
                author: { type: 'string' },
                year: { type: 'integer' },
                price: { type: 'string' },
                is_active: { type: 'boolean' },
                description: { type: 'string' },
              },
            },
            message: { type: 'string' },
          },
        },
        404: {
          type: 'object',
          properties: {
            success: { type: 'boolean', default: false },
            error: { type: 'string' },
            message: { type: 'string' },
            statusCode: { type: 'integer' },
          },
        },
      },
    },
    preHandler: validate(bookUpdateSchema.merge(idParamSchema)),
    handler: bookController.updateBook,
  });

  // DELETE /api/v1/books/:id - Delete book
  fastify.delete('/:id', {
    schema: {
      tags,
      summary: 'Delete a book',
      description: 'Permanently delete a book record',
      params: {
        type: 'object',
        properties: {
          id: { type: 'integer', minimum: 1 },
        },
        required: ['id'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'null' },
            message: { type: 'string' },
          },
        },
        404: {
          type: 'object',
          properties: {
            success: { type: 'boolean', default: false },
            error: { type: 'string' },
            message: { type: 'string' },
            statusCode: { type: 'integer' },
          },
        },
      },
    },
    preHandler: validate(idParamSchema),
    handler: bookController.deleteBook,
  });
}
