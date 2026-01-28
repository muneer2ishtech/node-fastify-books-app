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
};

class Database {
  private pool: Pool;
  private static instance: Database;

  private constructor() {
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
    this.pool.on('connect', () => {
      logger.debug('Database connection established');
    });

    this.pool.on('error', (err) => {
      logger.error('Unexpected database error', err);
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
      
      // Only log slow queries in production
      if (duration > 1000 && config.NODE_ENV === 'production') {
        logger.warn('Slow query detected', { text, duration, rows: result.rowCount });
      }
      
      return result;
    } catch (error) {
      logger.error('Error executing query', { text, params, error });
      throw error;
    }
  }

  async connect(): Promise<void> {
    try {
      await this.pool.connect();
      logger.info('Database connected successfully');
    } catch (error) {
      logger.error('Database connection failed', { 
        error: error.message,
        host: config.DB_HOST,
        port: config.DB_PORT,
        database: config.DB_NAME,
        user: config.DB_USER,
      });
  
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.pool.end();
      logger.info('Database disconnected');
    } catch (error) {
      logger.error('Error disconnecting from database', error);
      throw error;
    }
  }

  getPool(): Pool {
    return this.pool;
  }
}

export default Database.getInstance();
