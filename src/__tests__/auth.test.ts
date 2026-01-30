import request from 'supertest';
import createApp from '../app';
import prisma from '../config/database';

describe('Auth Endpoints', () => {
  let app: any;

  beforeAll(async () => {
    app = createApp();
    
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
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
    let refreshToken: string;

    beforeAll(async () => {
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      refreshToken = loginResponse.body.data.refreshToken;
    });

    it('should refresh access token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh-token')
        .send({
          refreshToken,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
    });

    it('should not refresh with invalid token', async () => {
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
