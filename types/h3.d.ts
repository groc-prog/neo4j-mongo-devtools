import type { Logger } from 'winston';

declare module 'h3' {
  interface H3EventContext {
    logger: Logger;
  }
}
