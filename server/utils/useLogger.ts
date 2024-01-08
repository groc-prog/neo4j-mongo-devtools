import { createLogger, format, transports, type Logger } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.errors({ stack: true }), format.json()),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  ],
});

/**
 * Returns a logger with the given name. If no name is given, the default logger is returned.
 *
 * @param {string} [name] - The name of the logger.
 * @returns {Logger} The logger.
 */
export function useLogger(name?: string, meta?: any): Logger {
  if (name) return logger.child({ name, meta });
  return logger;
}
