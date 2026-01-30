import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './index';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express JS Boilerplate API',
      version: '1.0.0',
      description:
        'Production-ready Node.js/Express boilerplate with authentication, authorization, and more',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}${config.apiPrefix}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            username: { type: 'string' },
            role: { type: 'string', enum: ['USER', 'ADMIN'] },
            isActive: { type: 'boolean' },
            isVerified: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'username'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
            username: { type: 'string', minLength: 3 },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/User' },
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string' },
                details: { type: 'object' },
              },
            },
          },
        },
        RequestPasswordResetRequest: {
          type: 'object',
          required: ['email'],
          properties: {
            email: { type: 'string', format: 'email' },
          },
        },
        ResetPasswordRequest: {
          type: 'object',
          required: ['token', 'password'],
          properties: {
            token: { type: 'string' },
            password: { type: 'string', minLength: 8 },
          },
        },
        VerifyEmailRequest: {
          type: 'object',
          required: ['token'],
          properties: {
            token: { type: 'string' },
          },
        },
        ResendVerificationRequest: {
          type: 'object',
          required: ['email'],
          properties: {
            email: { type: 'string', format: 'email' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/app.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
