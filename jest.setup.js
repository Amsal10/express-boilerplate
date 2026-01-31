// Mock uuid to avoid ES module issues with Jest
jest.mock('uuid', () => ({
  v4: () => 'mock-uuid-v4',
  NIL: '00000000-0000-0000-0000-000000000000',
  parse: jest.fn(),
  stringify: jest.fn(),
  validate: jest.fn(),
  version: jest.fn(),
}));
