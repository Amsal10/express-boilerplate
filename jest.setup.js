// Mock uuid to avoid ES module issues with Jest
jest.mock('uuid', () => ({
  v4: () => 'mock-uuid-v4',
  v7: () => 'mock-uuid-v7',
  NIL: '00000000-0000-0000-0000-000000000000',
  parse: jest.fn(),
  stringify: jest.fn(),
  validate: jest.fn(),
  version: jest.fn(),
}));

// Mock bcrypt for password hashing
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn().mockImplementation((plain, hashed) => {
    return plain === 'password123';
  }),
}));

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock-jwt-token'),
  verify: jest.fn().mockReturnValue({ userId: '123', email: 'test@example.com', role: 'USER' }),
}));

// Mock email service with all methods
jest.mock('./src/services/email.service', () => ({
  __esModule: true,
  default: {
    sendEmail: jest.fn().mockResolvedValue(undefined),
    sendWelcomeEmail: jest.fn().mockResolvedValue(undefined),
    sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
    sendEmailVerificationEmail: jest.fn().mockResolvedValue(undefined),
    sendAccountLockedEmail: jest.fn().mockResolvedValue(undefined),
    sendLoginAlertEmail: jest.fn().mockResolvedValue(undefined),
  },
}));

// Mock Prisma database
jest.mock('./src/config/database', () => {
  const mockPrisma = {
    user: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
    },
    refreshToken: {
      deleteMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
    $disconnect: jest.fn(),
  };
  return {
    __esModule: true,
    default: mockPrisma,
  };
});
