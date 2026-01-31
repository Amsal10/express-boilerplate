import request from 'supertest';
import createApp from '../app';
import prisma from '../config/database';

describe('Auth Endpoints', () => {
  let app: any;

  beforeAll(() => {
    // Increase timeout for tests that throw errors
    jest.setTimeout(10000);
  });

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    app = createApp();
  });

  afterAll(async () => {
    await (prisma as any).$disconnect();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      (prisma.user.findFirst as any).mockResolvedValue(null);
      (prisma.user.create as any).mockResolvedValue({
        id: '123',
        email: 'test@example.com',
        username: 'testuser',
        isVerified: false,
        role: 'USER',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          username: 'testuser',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe('test@example.com');
      expect(response.body.data).not.toHaveProperty('password');
    });

    it('should not register user with existing email', async () => {
      (prisma.user.findFirst as any).mockResolvedValue({
        id: '123',
        email: 'test@example.com',
        username: 'existinguser',
        isVerified: false,
        role: 'USER',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          username: 'testuser2',
        });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });

    it('should validate email format', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
          username: 'testuser3',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        username: 'testuser',
        isVerified: true,
        role: 'USER',
        isActive: true,
        password: '$2a$10$hashedpasswordhere', // This would be a bcrypt hash
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.user.findUnique as any).mockResolvedValue(mockUser);
      (prisma.user.update as any).mockResolvedValue(mockUser);
      (prisma.refreshToken.create as any).mockResolvedValue({
        id: 'token-id',
        token: 'mock-refresh-token',
        userId: '123',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
      });

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
    });

    it('should not login with invalid credentials', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        username: 'testuser',
        isVerified: true,
        role: 'USER',
        isActive: true,
        password: '$2a$10$hashedpasswordhere',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.user.findUnique as any).mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/refresh-token', () => {
    it('should refresh access token', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        username: 'testuser',
        isVerified: true,
        role: 'USER',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockStoredToken = {
        id: 'token-id',
        token: 'valid-refresh-token',
        userId: '123',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        user: mockUser,
      };

      (prisma.refreshToken.findUnique as any).mockResolvedValue(mockStoredToken);
      (prisma.user.findUnique as any).mockResolvedValue(mockUser);
      (prisma.refreshToken.delete as any).mockResolvedValue({});
      (prisma.user.update as any).mockResolvedValue(mockUser);
      (prisma.refreshToken.create as any).mockResolvedValue({
        id: 'new-token-id',
        token: 'new-refresh-token',
        userId: '123',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
      });

      const response = await request(app)
        .post('/api/v1/auth/refresh-token')
        .send({
          refreshToken: 'valid-refresh-token',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
    });

    it('should not refresh with invalid token', async () => {
      (prisma.refreshToken.findUnique as any).mockResolvedValue(null);

      const response = await request(app)
        .post('/api/v1/auth/refresh-token')
        .send({
          refreshToken: 'invalid-token',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
