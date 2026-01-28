import { Pool, PoolConfig } from 'pg';
import { config } from '../config';
import logger from '../utils/logger';

const dbConfig: PoolConfig = {
  host: config.DB_HOST,
  port: config.DB_PORT,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  max: config.NODE_ENV === 'production' ? 20 : 10,
  idleTimeoutMillis: config.DB_IDLE_TIMEOUT_MS,
  connectionTimeoutMillis: config.NODE_ENV === 'production' ? 5000 : 2000,
  // No SSL for local development
};

class Database {
  private pool: Pool;
  private static instance: Database;

  private constructor() {
    logger.debug('Database configuration:', {
      host: config.DB_HOST,
      port: config.DB_PORT,
      database: config.DB_NAME,
      user: config.DB_USER,
    });
    
    this.pool = new Pool(dbConfig);
    this.setupEventListeners();
  }

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private setupEventListeners(): void {
    this.pool.on('connect', (client) => {
      logger.debug('Database connection established');
      // Set the schema for all queries on this connection
      client.query('SET search_path TO bookapp_dev_schema, public');
    });

    this.pool.on('error', (err) => {
      logger.error('Unexpected database pool error:', err.message);
    });

    this.pool.on('remove', () => {
      logger.debug('Database connection removed');
    });
  }

  async query<T = any>(text: string, params?: any[]): Promise<{ rows: T[]; rowCount: number }> {
    const start = Date.now();
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      
      if (duration > 1000 && config.NODE_ENV === 'production') {
        logger.warn('Slow query detected', { duration, rows: result.rowCount });
      }
      
      return result;
    } catch (error: any) {
      logger.error('Error executing query', { 
        query: text.substring(0, 100),
        error: error.message,
        code: error.code,
      });
      throw error;
    }
  }

  async connect(): Promise<void> {
    try {
      // Test connection with a simple query
      const client = await this.pool.connect();
      const result = await client.query('SELECT version()');
      client.release();
      
      logger.info(`Database connected successfully to ${config.DB_HOST}:${config.DB_PORT}/${config.DB_NAME}`);
      logger.debug(`PostgreSQL version: ${result.rows[0]?.version}`);
    } catch (error: any) {
      logger.error('Database connection failed', { 
        error: error.message,
        host: config.DB_HOST,
        port: config.DB_PORT,
        database: config.DB_NAME,
        user: config.DB_USER,
      });
      throw new Error(`Database connection failed: ${error.message}`);
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.pool.end();
      logger.info('Database disconnected');
    } catch (error: any) {
      logger.error('Error disconnecting from database', error.message);
      throw error;
    }
  }

  getPool(): Pool {
    return this.pool;
  }
}

export default Database.getInstance();
