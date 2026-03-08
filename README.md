[![CI](https://github.com/theluckystrike/webext-downloads/actions/workflows/ci.yml/badge.svg)](https://github.com/theluckystrike/webext-downloads/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Last Commit](https://img.shields.io/github/last-commit/theluckystrike/webext-downloads/main)](https://github.com/theluckystrike/webext-downloads/commits/main)

# @theluckystrike/webext-downloads

Typed download helpers for Chrome extensions. A lightweight TypeScript library that provides promise-based wrappers around the Chrome Downloads API with full type safety.

## Features

- �Type-safe Promise-based API for Chrome downloads
- 🧩 Full TypeScript support with auto-complete
- 📦 Lightweight with zero dependencies
- 🔄 Includes pause, resume, cancel, and more

## Installation

```bash
npm install @theluckystrike/webext-downloads
```

```bash
pnpm add @theluckystrike/webext-downloads
```

## Usage

```typescript
import {
  downloadFile,
  cancelDownload,
  pauseDownload,
  resumeDownload,
  getDownloads,
  onDownloadChanged,
  openDownload,
  showInFolder,
} from '@theluckystrike/webext-downloads';

// Download a file
const downloadId = await downloadFile({
  url: 'https://example.com/file.pdf',
  filename: 'my-file.pdf',
  saveAs: true,
});

// Get all downloads
const downloads = await getDownloads({ query: ['pdf'] });

// Pause a download
await pauseDownload(downloadId);

// Resume a download
await resumeDownload(downloadId);

// Cancel a download
await cancelDownload(downloadId);

// Open the downloaded file
await openDownload(downloadId);

// Show in folder
await showInFolder(downloadId);

// Listen for download changes
const removeListener = onDownloadChanged((delta) => {
  console.log('Download changed:', delta);
});

// Remove listener when done
removeListener();
```

## API Reference

### `downloadFile(opts)`

Downloads a file using the Chrome downloads API.

| Parameter | Type | Description |
|-----------|------|-------------|
| `opts.url` | `string` | The URL to download (required) |
| `opts.filename` | `string` | The filename to save as (optional) |
| `opts.saveAs` | `boolean` | Show the "Save As" dialog (optional) |

Returns: `Promise<number>` - The download ID

---

### `cancelDownload(id)`

Cancels a download.

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `number` | The download ID to cancel |

Returns: `Promise<void>`

---

### `pauseDownload(id)`

Pauses a download.

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `number` | The download ID to pause |

Returns: `Promise<void>`

---

### `resumeDownload(id)`

Resumes a paused download.

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `number` | The download ID to resume |

Returns: `Promise<void>`

---

### `getDownloads(query?)`

Gets downloads matching the query.

| Parameter | Type | Description |
|-----------|------|-------------|
| `query` | `DownloadQuery` | Query parameters (optional) |

Returns: `Promise<DownloadItem[]>` - Array of download items

---

### `onDownloadChanged(cb)`

Sets up a listener for download state changes.

| Parameter | Type | Description |
|-----------|------|-------------|
| `cb` | `(delta: DownloadDelta) => void` | Callback function called when download state changes |

Returns: `() => void` - Function to remove the listener

---

### `openDownload(id)`

Opens the downloaded file in the default viewer.

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `number` | The download ID to open |

Returns: `Promise<void>`

---

### `showInFolder(id)`

Shows the downloaded file in the system file manager.

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `number` | The download ID to show |

Returns: `Promise<void>`

---

## Project Structure

```
webext-downloads/
├── src/
│   ├── index.ts          # Main library source
│   └── __tests__/
│       └── index.test.ts # Test suite
├── .github/
│   └── workflows/
│       └── ci.yml        # CI pipeline
├── CHANGELOG.md          # Version history
├── LICENSE               # MIT license
├── package.json          # Package configuration
├── tsconfig.json         # TypeScript config
└── README.md             # This file
```

## Requirements

- Chrome extensions environment with `chrome.downloads` API available
- TypeScript 5.0+

## License

MIT

---

Built at [zovo.one](https://zovo.one) by [theluckystrike](https://github.com/theluckystrike)
