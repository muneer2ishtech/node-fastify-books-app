import dotenv from 'dotenv';
import path from 'path';

// Load test environment variables
dotenv.config({
  path: path.resolve(process.cwd(), '.env.test'),
});

// Global test timeout
jest.setTimeout(10000);

// Global test setup
beforeAll(async () => {
  console.log('Setting up test environment...');
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Database: ${process.env.DB_NAME}`);
});

afterAll(async () => {
  console.log('Cleaning up test environment...');
});

// Global teardown
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Mock console for tests
global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};
