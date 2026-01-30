# Express.js Boilerplate ⭐

Production-ready Node.js/Express starter template with authentication, authorization, and many more features.

## Features ✨

- 🔐 **Authentication**: JWT access token + refresh token with rotation
- 👥 **Authorization**: Role-based access control (RBAC)
- 💾 **Database**: PostgreSQL with Prisma ORM
- 📁 **File Upload**: Multer with file validation
- 🛡️ **Error Handling**: Centralized error handling middleware
- ✅ **Request Validation**: Zod schemas
- 📝 **Logging**: Winston logger
- 🚦 **Rate Limiting**: Express rate limiter
- 📚 **API Documentation**: Swagger/OpenAPI
- ⚙️ **Environment Configuration**: Environment variables
- 🔒 **Security**: CORS, Helmet
- 🧪 **Testing**: Jest + Supertest
- 🐳 **Docker**: Docker + Docker Compose
- 💅 **Code Quality**: ESLint + Prettier + Husky
- 📄 **API Versioning**: Versioned API endpoints
- 📊 **Pagination**: Built-in pagination utilities
- 📦 **Standard Response**: Consistent API response format

## Tech Stack 🛠️

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **Logging**: Winston
- **Testing**: Jest + Supertest
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

# Database
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio
npm run prisma:seed      # Seed database

# Testing
npm test                 # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage
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

- `GET /health` - Health check endpoint

### File Upload

- `POST /api/v1/upload` - Upload single file

## Environment Variables 🌍

```env
# Server
NODE_ENV=development
PORT=3000
API_PREFIX=/api/v1

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# JWT
JWT_SECRET=your-secret-key
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

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
