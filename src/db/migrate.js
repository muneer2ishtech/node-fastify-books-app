#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const env = process.env.NODE_ENV || 'development';
const envFile = `.env.${env}`;
const envPath = path.join(process.cwd(), envFile);

console.log(`Running migrations for environment: ${env}`);

// Load environment variables
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
} else {
  console.warn(`Environment file ${envFile} not found, using system environment variables`);
}

// Run migrations
try {
  console.log('Running database migrations...');
  
  const command = `node-pg-migrate up --migrations-dir=./src/db/migrations --database-url=postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
  
  execSync(command, { stdio: 'inherit' });
  
  console.log('Migrations completed successfully!');
} catch (error) {
  console.error('Migration failed:', error.message);
  process.exit(1);
}