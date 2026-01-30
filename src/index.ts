import dotenv from 'dotenv';
import createApp from './app';
import logger from './utils/logger';
import { config } from './config';

dotenv.config();

const app = createApp();

const server = app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
  logger.info(`API documentation available at http://localhost:${config.port}/api-docs`);
});

const gracefulShutdown = (signal: string) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Forcing shutdown...');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  gracefulShutdown('unhandledRejection');
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  gracefulShutdown('uncaughtException');
});
