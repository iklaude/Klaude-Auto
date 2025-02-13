import { startBot } from './bot.js';
import { logger } from './logger.js';

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  logger.error('Unhandled Rejection:', error);
  process.exit(1);
});

startBot().catch((error) => {
  logger.error('Failed to start bot:', error);
  process.exit(1);
});
