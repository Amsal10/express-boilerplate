# Contributing to Express.js Boilerplate

Thank you for your interest in contributing to Express.js Boilerplate! This document provides guidelines and instructions for contributing to the project.

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report:

1. Use a clear and descriptive title
2. Provide detailed information about the bug
3. Include steps to reproduce the issue
4. Provide screenshots if applicable
5. Specify your environment (OS, Node.js version, etc.)

### Suggesting Enhancements

Enhancement suggestions are welcome! When suggesting an enhancement:

1. Use a clear and descriptive title
2. Provide a detailed description of the enhancement
3. Explain why this enhancement would be useful
4. Provide examples of how the enhancement would work

### Pull Requests

1. Fork the repository
2. Create a new branch for your feature or fix
3. Make your changes with clear commit messages
4. Follow the coding standards
5. Add tests if applicable
6. Ensure all tests pass
7. Submit a pull request with a clear description

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Run linting: `npm run lint`
6. Run tests: `npm test`
7. Format code: `npm run format`

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Provide type annotations where necessary
- Avoid using `any` type

### Code Style

- Follow ESLint rules
- Use Prettier for formatting
- Keep functions small and focused
- Write meaningful variable and function names
- Add comments for complex logic

### Commit Messages

Follow conventional commits:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding or updating tests
- `chore:` for maintenance tasks

Example:
```
feat: add rate limiting middleware

- Implement rate limiting using express-rate-limit
- Add configuration options for rate limiting
- Update documentation
```

## Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Aim for good test coverage
- Use descriptive test names

## Documentation

- Update README for new features
- Update API documentation in Swagger
- Add inline comments for complex code
- Keep documentation up to date

## Code Review Process

1. Submit your pull request
2. Wait for code review
3. Address review comments
4. Make necessary changes
5. Get approval
6. Merge

## Questions or Need Help?

Feel free to open an issue or reach out to maintainers for any questions.

Thank you for contributing! 🎉
