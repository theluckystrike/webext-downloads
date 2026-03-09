# Contributing to @anthropic/webext-downloads

Thank you for your interest in contributing! This document outlines the process for contributing to this project.

## Getting Started

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/webext-downloads.git
cd webext-downloads
```

### Install Dependencies

This project uses pnpm:

```bash
pnpm install
```

### Build

Build the TypeScript:

```bash
pnpm build
```

### Test

Run the test suite:

```bash
pnpm test
```

## Development Workflow

1. Create a new branch for your feature or fix:

```bash
git checkout -b feature/my-new-feature
# or
git checkout -b fix/description-of-fix
```

2. Make your changes and ensure tests pass:

```bash
pnpm test
```

3. Build to verify TypeScript compiles:

```bash
pnpm build
```

4. Commit your changes with a descriptive message:

```bash
git commit -m "feat: add new function for X"
```

5. Push to your fork and create a Pull Request:

```bash
git push origin feature/my-new-feature
```

## Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Tests pass (`pnpm test`)
- [ ] Code builds without errors (`pnpm build`)
- [ ] TypeScript types are correct
- [ ] Documentation is updated if needed
- [ ] New functions have JSDoc comments

## Code Style

- Use TypeScript with strict mode
- Follow existing code patterns
- Add tests for new functionality
- Keep functions focused and small

## Reporting Issues

If you find a bug or have a feature request:

1. Search existing issues first
2. Create a new issue with:
   - Clear title
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Environment details

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
