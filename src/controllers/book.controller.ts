import { FastifyRequest, FastifyReply } from 'fastify';
import bookService from '../services/book.service';
import { ApiResponse, ErrorResponse } from '../types';

export class BookController {
  getAllBooks = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const queryParams = request.validatedData;
      const result = await bookService.findAll(queryParams);

      const response: ApiResponse<any> = {
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      };

      return reply.status(200).send(response);
    } catch (error: any) {
      return this.handleError(error, reply);
    }
  };

  getBookById = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.validatedData;
      const book = await bookService.findById(id);

      if (!book) {
        const errorResponse: ErrorResponse = {
          success: false,
          error: 'Not Found',
          message: 'Book not found',
          statusCode: 404,
          timestamp: new Date().toISOString(),
        };
        return reply.status(404).send(errorResponse);
      }

      const response: ApiResponse<any> = {
        success: true,
        data: book,
        timestamp: new Date().toISOString(),
      };

      return reply.status(200).send(response);
    } catch (error: any) {
      return this.handleError(error, reply);
    }
  };

  createBook = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const bookData = request.validatedData;
      const book = await bookService.create(bookData);

      const response: ApiResponse<any> = {
        success: true,
        data: book,
        message: 'Book created successfully',
        timestamp: new Date().toISOString(),
      };

      return reply.status(201).send(response);
    } catch (error: any) {
      return this.handleError(error, reply);
    }
  };

  updateBook = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id, ...updateData } = request.validatedData;
      const book = await bookService.update(id, updateData);

      if (!book) {
        const errorResponse: ErrorResponse = {
          success: false,
          error: 'Not Found',
          message: 'Book not found',
          statusCode: 404,
          timestamp: new Date().toISOString(),
        };
        return reply.status(404).send(errorResponse);
      }

      const response: ApiResponse<any> = {
        success: true,
        data: book,
        message: 'Book updated successfully',
        timestamp: new Date().toISOString(),
      };

      return reply.status(200).send(response);
    } catch (error: any) {
      return this.handleError(error, reply);
    }
  };

  deleteBook = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.validatedData;
      const deleted = await bookService.delete(id);

      if (!deleted) {
        const errorResponse: ErrorResponse = {
          success: false,
          error: 'Not Found',
          message: 'Book not found',
          statusCode: 404,
          timestamp: new Date().toISOString(),
        };
        return reply.status(404).send(errorResponse);
      }

      const response: ApiResponse<null> = {
        success: true,
        data: null,
        message: 'Book deleted successfully',
        timestamp: new Date().toISOString(),
      };

      return reply.status(200).send(response);
    } catch (error: any) {
      return this.handleError(error, reply);
    }
  };

  softDeleteBook = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.validatedData;
      const updated = await bookService.softDelete(id);

      if (!updated) {
        const errorResponse: ErrorResponse = {
          success: false,
          error: 'Not Found',
          message: 'Book not found',
          statusCode: 404,
          timestamp: new Date().toISOString(),
        };
        return reply.status(404).send(errorResponse);
      }

      const response: ApiResponse<null> = {
        success: true,
        data: null,
        message: 'Book soft deleted successfully',
        timestamp: new Date().toISOString(),
      };

      return reply.status(200).send(response);
    } catch (error: any) {
      return this.handleError(error, reply);
    }
  };

  restoreBook = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.validatedData;
      const restored = await bookService.restore(id);

      if (!restored) {
        const errorResponse: ErrorResponse = {
          success: false,
          error: 'Not Found',
          message: 'Book not found',
          statusCode: 404,
          timestamp: new Date().toISOString(),
        };
        return reply.status(404).send(errorResponse);
      }

      const response: ApiResponse<null> = {
        success: true,
        data: null,
        message: 'Book restored successfully',
        timestamp: new Date().toISOString(),
      };

      return reply.status(200).send(response);
    } catch (error: any) {
      return this.handleError(error, reply);
    }
  };

  private handleError(error: any, reply: FastifyReply) {
    console.error('Controller error:', error);

    const errorResponse: ErrorResponse = {
      success: false,
      error: 'Internal Server Error',
      message: error.message || 'An unexpected error occurred',
      statusCode: 500,
      timestamp: new Date().toISOString(),
    };

    if (error.message.includes('already exists')) {
      errorResponse.error = 'Conflict';
      errorResponse.statusCode = 409;
    } else if (error.message.includes('required') || error.message.includes('must be')) {
      errorResponse.error = 'Bad Request';
      errorResponse.statusCode = 400;
    }

    return reply.status(errorResponse.statusCode).send(errorResponse);
  }
}

export default new BookController();
