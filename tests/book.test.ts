import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { createApp } from '../src/app';
import { FastifyInstance } from 'fastify';

describe('Book API', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await createApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/v1/books', () => {
    it('should return paginated books', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/books',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data).toHaveProperty('data');
      expect(body.data).toHaveProperty('pagination');
    });
  });

  describe('POST /api/v1/books', () => {
    it('should create a new book', async () => {
      const bookData = {
        title: 'Test Book',
        author: 'Test Author',
        year: 2023,
        price: 29.99,
        description: 'Test Description',
      };

      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/books',
        payload: bookData,
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.title).toBe(bookData.title);
      expect(body.data.author).toBe(bookData.author);
    });
  });
});
