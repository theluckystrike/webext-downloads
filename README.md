<div align="center">

# @theluckystrike/webext-downloads

Typed download helpers for Chrome extensions. Start, pause, resume, cancel, and monitor downloads with full TypeScript support.

[![npm version](https://img.shields.io/npm/v/@theluckystrike/webext-downloads)](https://www.npmjs.com/package/@theluckystrike/webext-downloads)
[![npm downloads](https://img.shields.io/npm/dm/@theluckystrike/webext-downloads)](https://www.npmjs.com/package/@theluckystrike/webext-downloads)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@theluckystrike/webext-downloads)

[Installation](#installation) · [Quick Start](#quick-start) · [API](#api) · [License](#license)

</div>

---

## Features

- **Full lifecycle** -- download, pause, resume, cancel, erase
- **Search** -- find downloads by URL, filename, state, or time range
- **Progress events** -- monitor download progress in real-time
- **File operations** -- open, show in folder, get file icon
- **Typed** -- full TypeScript support for all download operations
- **Promise-based** -- async/await for every method

## Installation

```bash
npm install @theluckystrike/webext-downloads
```

<details>
<summary>Other package managers</summary>

```bash
pnpm add @theluckystrike/webext-downloads
# or
yarn add @theluckystrike/webext-downloads
```

</details>

## Quick Start

```typescript
import { Downloads } from "@theluckystrike/webext-downloads";

const id = await Downloads.download({ url: "https://example.com/file.pdf" });
await Downloads.pause(id);
await Downloads.resume(id);
await Downloads.cancel(id);

const items = await Downloads.search({ state: "complete" });
```

## API

| Method | Description |
|--------|-------------|
| `download(options)` | Start a download |
| `pause(id)` | Pause a download |
| `resume(id)` | Resume a paused download |
| `cancel(id)` | Cancel a download |
| `search(query)` | Search downloads by criteria |
| `erase(query)` | Erase matching downloads from history |
| `open(id)` | Open a downloaded file |
| `showInFolder(id)` | Show file in OS file manager |
| `getFileIcon(id)` | Get the file type icon |
| `onChanged(callback)` | Monitor download state changes |
| `onCreated(callback)` | Listen for new downloads |

## Permissions

```json
{ "permissions": ["downloads"] }
```

## Part of @zovo/webext

This package is part of the [@zovo/webext](https://github.com/theluckystrike) family -- typed, modular utilities for Chrome extension development:

| Package | Description |
|---------|-------------|
| [webext-storage](https://github.com/theluckystrike/webext-storage) | Typed storage with schema validation |
| [webext-messaging](https://github.com/theluckystrike/webext-messaging) | Type-safe message passing |
| [webext-tabs](https://github.com/theluckystrike/webext-tabs) | Tab query helpers |
| [webext-cookies](https://github.com/theluckystrike/webext-cookies) | Promise-based cookies API |
| [webext-i18n](https://github.com/theluckystrike/webext-i18n) | Internationalization toolkit |

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License -- see [LICENSE](LICENSE) for details.

---

<div align="center">

Built by [theluckystrike](https://github.com/theluckystrike) · [zovo.one](https://zovo.one)

</div>
