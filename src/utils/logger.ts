/**
 * Minimal levelled logger. Keeps console output greppable in CI logs without
 * dragging in winston/pino for a test project.
 *
 * Level is controlled by LOG_LEVEL (error | warn | info | debug), default info.
 */

const LEVELS = ['error', 'warn', 'info', 'debug'] as const;
type Level = (typeof LEVELS)[number];

const configured = (process.env.LOG_LEVEL ?? 'info').toLowerCase() as Level;
const threshold = LEVELS.includes(configured) ? LEVELS.indexOf(configured) : LEVELS.indexOf('info');

function emit(level: Level, scope: string, message: string, ...rest: unknown[]): void {
  if (LEVELS.indexOf(level) > threshold) return;
  const line = `[${new Date().toISOString()}] [${level.toUpperCase()}] [${scope}] ${message}`;
  if (level === 'error') console.error(line, ...rest);
  else if (level === 'warn') console.warn(line, ...rest);
  else console.log(line, ...rest);
}

export class Logger {
  constructor(private readonly scope: string) {}

  error(message: string, ...rest: unknown[]): void {
    emit('error', this.scope, message, ...rest);
  }

  warn(message: string, ...rest: unknown[]): void {
    emit('warn', this.scope, message, ...rest);
  }

  info(message: string, ...rest: unknown[]): void {
    emit('info', this.scope, message, ...rest);
  }

  debug(message: string, ...rest: unknown[]): void {
    emit('debug', this.scope, message, ...rest);
  }

  /** Factory so page objects can do `Logger.for(HomePage.name)`. */
  static for(scope: string): Logger {
    return new Logger(scope);
  }
}

export const logger = Logger.for('framework');
