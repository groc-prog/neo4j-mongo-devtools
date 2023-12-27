import { createLogger, format, transports } from 'winston';

export default defineEventHandler((event) => {
  event.context.logger = createLogger({
    level: 'info',
    format: format.combine(format.timestamp(), format.errors({ stack: true }), format.json()),
    transports: [
      new transports.Console({
        format: format.combine(format.colorize(), format.simple()),
      }),
    ],
  });
});
