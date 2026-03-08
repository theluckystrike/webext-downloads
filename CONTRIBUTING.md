# Contributing to @theluckystrike/webext-downloads

Thank you for your interest in contributing! This guide will help you get started.

## Development Setup

1. **Fork the repository**

2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/webext-downloads.git
   cd webext-downloads
   ```

3. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

4. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Building

```bash
npm run build
```

## Testing

```bash
npm test
```

## Pull Request Checklist

Before submitting a PR, ensure:

- [ ] All tests pass (`npm test`)
- [ ] Build completes without errors (`npm run build`)
- [ ] TypeScript types are correct
- [ ] Documentation is updated if needed
- [ ] README reflects any new features or API changes

## Code Style

- Use TypeScript with strict mode
- Follow existing code conventions
- Add JSDoc comments for public APIs

## One Feature Per PR

Please keep pull requests focused on a single feature or fix. This makes them easier to review and merge.

## Questions?

Open an issue for questions about contributing or if you encounter any problems.
