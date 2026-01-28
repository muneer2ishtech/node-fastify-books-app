# Book Management API

A high-performance RESTful API for book management built with Node.js, TypeScript, Fastify, and PostgreSQL.

## Features

- RESTful API with OpenAPI (Swagger) documentation
- PostgreSQL database with optimized schema design
- Pagination, filtering, and sorting
- Input validation and error handling
- Comprehensive logging
- Docker support
- Unit tests
- Performance optimized queries

## Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Docker & Docker Compose (optional)

## Project structure

[GIT](https://github.com/muneer2ishtech/node-fastify-books-app/)

```
node-fastify-books-app/
├── src/
│ ├── app.ts
│ ├── index.ts
│ ├── config/
│ │ └── index.ts
│ ├── db/
│ │ ├── index.ts
│ │ └── migrations/
│ │ └── 001_create_t_book.sql
│ ├── entities/
│ │ └── book.entity.ts
│ ├── services/
│ │ └── book.service.ts
│ ├── controllers/
│ │ └── book.controller.ts
│ ├── routes/
│ │ └── book.routes.ts
│ ├── middlewares/
│ │ ├── error.middleware.ts
│ │ └── validation.middleware.ts
│ ├── utils/
│ │ ├── logger.ts
│ │ └── response.ts
│ └── types/
│ └── index.ts
├── tests/
│ └── book.test.ts
├── docker-compose.yml
├── Dockerfile
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Quick Start

### Using Docker

Start the application:

```
npm run docker:up
```

### Local Development
1. Install dependencies:

```
rm -rf dist/
rm -f package-lock.json
rm -rf node_modules/
```

```
npm install
```

2. Set up environment variables:
    - Edit .env with your database credentials

```
cp .env.example .env
```

3. Run database migrations:

```
npm run migrate up
```

4. Start the development server:

```
npm run dev
```

## Build for production

```
npm run build
```

### Run production build (set environment variables first)

```
NODE_ENV=production DB_HOST=... DB_USER=... DB_PASSWORD=... npm start
```

## API Documentation
Once the server is running, visit:

API Documentation: http://localhost:3000/documentation

Health Check: http://localhost:3000/health

### API Endpoints

- GET `/api/v1/books` - Get all books with pagination
- GET `/api/v1/books/:id` - Get book by ID
- POST `/api/v1/books` - Create new book
- PUT `/api/v1/books/:id` - Update existing book
- DELETE `/api/v1/books/:id` - Delete book

## Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run docker:up` - Start with Docker Compose
- `npm run docker:down` - Stop Docker containers
