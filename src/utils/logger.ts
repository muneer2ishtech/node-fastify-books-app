import { config } from '../config';

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

class Logger {
  private level: number;

  constructor() {
    this.level = logLevels[config.LOG_LEVEL as keyof typeof logLevels] || logLevels.info;
  }

  private formatMessage(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? JSON.stringify(meta) : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message} ${metaStr}`;
  }

  error(message: string, meta?: any): void {
    if (this.level >= logLevels.error) {
      console.error(this.formatMessage('error', message, meta));
    }
  }

  warn(message: string, meta?: any): void {
    if (this.level >= logLevels.warn) {
      console.warn(this.formatMessage('warn', message, meta));
    }
  }

  info(message: string, meta?: any): void {
    if (this.level >= logLevels.info) {
      console.log(this.formatMessage('info', message, meta));
    }
  }

  debug(message: string, meta?: any): void {
    if (this.level >= logLevels.debug) {
      console.debug(this.formatMessage('debug', message, meta));
    }
  }
}

export default new Logger();
