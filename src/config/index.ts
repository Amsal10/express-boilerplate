export const config = {
  port: Number.parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    accessExpiration: Number.parseInt(process.env.JWT_ACCESS_EXPIRATION || '900', 10),
    refreshExpiration: Number.parseInt(process.env.JWT_REFRESH_EXPIRATION || '604800', 10),
  },

  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number.parseInt(process.env.EMAIL_PORT || '587', 10),
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || '',
    from: process.env.EMAIL_FROM || 'noreply@example.com',
    fromName: process.env.EMAIL_FROM_NAME || 'Express Boilerplate',
  },

  upload: {
    maxSize: Number.parseInt(process.env.MAX_FILE_SIZE || '10485760', 10),
    dir: process.env.UPLOAD_DIR || './uploads',
  },

  rateLimit: {
    windowMs: Number.parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: Number.parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
};
