# Express.js Boilerplate ⭐

Production-ready Node.js/Express starter template with authentication, authorization, and many more features.

## Features ✨

- 🔐 **Authentication**: JWT access token + refresh token with rotation
- 👥 **Authorization**: Role-based access control (RBAC)
- 📧 **Email Service**: Nodemailer with email templates (welcome, password reset, email verification, account locked, login alerts)
- 💾 **Database**: PostgreSQL with Prisma ORM
- 📁 **File Upload**: Multer with file validation
- 🛡️ **Error Handling**: Centralized error handling middleware
- ✅ **Request Validation**: Zod schemas
- 📝 **Logging**: Winston logger with request tracking
- 🚦 **Rate Limiting**: Express rate limiter
- 📚 **API Documentation**: Swagger/OpenAPI
- ⚙️ **Environment Configuration**: Environment variables
- 🔒 **Security**: CORS, Helmet
- 🧪 **Testing**: Jest + Supertest with code coverage
- 🐳 **Docker**: Docker + Docker Compose
- 💅 **Code Quality**: ESLint + Prettier + Husky + lint-staged
- 🔍 **Code Analysis**: SonarQube/SonarCloud integration
- 📄 **API Versioning**: Versioned API endpoints
- 📊 **Pagination**: Built-in pagination utilities
- 📦 **Standard Response**: Consistent API response format
- 🆔 **Request Tracking**: Request ID middleware for distributed tracing

## Tech Stack 🛠️

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **Logging**: Winston
- **Email**: Nodemailer
- **Testing**: Jest + Supertest
- **Code Quality**: ESLint + Prettier + Husky + lint-staged
- **Code Analysis**: SonarQube/SonarCloud
- **Container**: Docker

## Getting Started 🚀

### Prerequisites

- Node.js 18+
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/express-js-boilerplate.git
cd express-js-boilerplate
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration

5. Run database migrations:
```bash
npm run prisma:migrate
```

6. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## API Documentation 📖

Swagger documentation is available at `http://localhost:3000/api-docs`

## Project Structure 📁

```
express-js-boilerplate/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── validators/      # Request validation schemas
│   ├── app.ts           # Express app setup
│   └── index.ts         # Entry point
├── prisma/              # Database schema and migrations
├── tests/               # Test files
├── logs/                # Log files
├── uploads/             # Uploaded files
├── docker-compose.yml   # Docker services
├── Dockerfile           # Docker image
└── package.json         # Dependencies
```

## Available Scripts 📜

```bash
# Development
npm run dev              # Start development server with hot reload

# Building
npm run build            # Build TypeScript to JavaScript

# Production
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting

# Database
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio
npm run prisma:seed      # Seed database

# Testing
npm test                 # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage

# Code Analysis
npm run sonar            # Run SonarQube/SonarCloud analysis
```

## API Endpoints 🔌

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `POST /api/v1/auth/logout` - Logout user

### Users

- `GET /api/v1/users` - List all users (Admin only)
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user (Admin only)

### Health

- `GET /health` - Comprehensive health check (database, memory, CPU status)
- `GET /health/readiness` - Kubernetes readiness probe
- `GET /health/liveness` - Kubernetes liveness probe

### File Upload

- `POST /api/v1/upload` - Upload single file

## Environment Variables 🌍

```env
# Server
NODE_ENV=development
PORT=3000
API_PREFIX=/api/v1
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Email Configuration (Gmail Example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@example.com
EMAIL_FROM_NAME=Express Boilerplate

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3000
```

## Docker Usage 🐳

### Using Docker Compose

```bash
docker-compose up -d
```

### Build Docker Image

```bash
docker build -t express-boilerplate .
```

### Run Docker Container

```bash
docker run -p 3000:3000 express-boilerplate
```

## Security Features 🔒

- JWT-based authentication
- Role-based authorization (USER, ADMIN)
- Rate limiting
- CORS configuration
- Helmet security headers
- Password hashing with bcrypt
- Input validation with Zod
- File upload validation
- Request ID tracking for audit trails

## Email Service 📧

The application includes a comprehensive email service with pre-built email templates:

### Available Email Templates

1. **Welcome Email**: Sent when a new user registers
2. **Email Verification**: Sent to verify user email address
3. **Password Reset**: Sent when user requests password reset
4. **Account Locked**: Sent when user account is locked
5. **Login Alert**: Sent when new login is detected

### Email Configuration

Configure email service in `.env`:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@example.com
EMAIL_FROM_NAME=Express Boilerplate
```

### Usage Example

```typescript
import emailService from './services/email.service';

// Send welcome email
await emailService.sendWelcomeEmail('user@example.com', 'username');

// Send password reset email
await emailService.sendPasswordResetEmail('user@example.com', 'username', 'reset-token');

// Send login alert
await emailService.sendLoginAlertEmail('user@example.com', 'username', '192.168.1.1');
```

## Error Handling 🛡️

The application uses centralized error handling with consistent error responses:

```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

## Request Tracking 🆔

Every request is assigned a unique Request ID for distributed tracing and debugging:

- Automatically generates UUID for each request
- Includes `X-Request-ID` header in responses
- Logs request ID with all log entries
- Supports external request ID via `X-Request-ID` header

## Code Quality & Analysis 🔍

### Pre-commit Hooks

The project uses Husky and lint-staged to ensure code quality before commits:

- ESLint for code linting
- Prettier for code formatting
- Automatically runs on every commit

### SonarQube/SonarCloud Integration

The project includes SonarCloud integration for code quality analysis:

```bash
# Run SonarQube analysis
npm run sonar
```

SonarCloud analyzes your code for:
- Code smells
- Bugs
- Vulnerabilities
- Code coverage
- Security hotspots
- Duplications

Configure SonarCloud in `sonar-project.properties`:
```properties
sonar.projectKey=your-project-key
sonar.organization=your-organization
sonar.sources=src
sonar.tests=src/__tests__
sonar.javascript.lcov.reportPaths=coverage/lcov.info
```

## Utilities & Helpers 🛠️

### Pagination Utility

Built-in pagination utility for handling large datasets:

```typescript
import { paginate } from './utils/pagination';

const result = await paginate({
  model: userModel,
  page: 1,
  limit: 10,
  where: { status: 'active' },
  orderBy: { createdAt: 'desc' }
});
```

### Response Utility

Consistent API response formatting:

```typescript
import { successResponse, errorResponse } from './utils/response';

// Success response
return successResponse(res, { data: 'value' }, 200);

// Error response
return errorResponse(res, 'Error message', 400, { details: 'error' });
```

### UUID Generator

Utility for generating UUIDs:

```typescript
import { generateUUID } from './utils/uuid';

const id = generateUUID(); // Generates v4 UUID
```

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

This project is licensed under the MIT License.

## Author 👤

Your Name

## Acknowledgments 🙏

- Express.js team
- Prisma ORM
- Zod validation
- Winston logger
