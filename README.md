[![CI](https://github.com/theluckystrike/webext-downloads/actions/workflows/ci.yml/badge.svg)](https://github.com/theluckystrike/webext-downloads/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@theluckystrike/webext-downloads)](https://www.npmjs.com/package/@theluckystrike/webext-downloads)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

# @theluckystrike/webext-downloads

> Typed download helpers for Chrome extensions — download, track progress, pause/resume, and manage download history. Part of @zovo/webext.

## Features

- 📥 **Download Files** — Initiate downloads with custom filenames and save dialog options
- ⏸️ **Pause & Resume** — Control download lifecycle with pause and resume capabilities
- ❌ **Cancel Downloads** — Cancel in-progress downloads at any time
- 🔍 **Search Downloads** — Query download history with flexible filters
- 📂 **Open & Show** — Open downloaded files or reveal them in the file manager
- 🔔 **Event Listeners** — Subscribe to download state changes in real-time
- 🛡️ **TypeScript** — Full type safety with comprehensive type definitions

## Installation

```bash
npm install @theluckystrike/webext-downloads
```

```bash
pnpm add @theluckystrike/webext-downloads
```

## Quick Start

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

## Advanced Usage

### Progress Bar Implementation

Track download progress using event listeners:

```typescript
const downloadProgress = new Map<number, number>();

onDownloadChanged((delta) => {
  if (delta.state?.current === 'in_progress') {
    const id = delta.id;
    // Query the download to get bytes downloaded/total
    getDownloads({ id }).then((items) => {
      if (items[0]) {
        const { bytesReceived, totalBytes } = items[0];
        const percent = (bytesReceived / totalBytes) * 100;
        downloadProgress.set(id, percent);
        console.log(`Download ${id}: ${percent.toFixed(1)}%`);
      }
    });
  }
  
  if (delta.state?.current === 'complete') {
    console.log(`Download ${delta.id} completed!`);
    downloadProgress.delete(delta.id);
  }
});
```

### Batch Download Queue

Process multiple downloads sequentially:

```typescript
async function downloadQueue(urls: string[]): Promise<number[]> {
  const results: number[] = [];
  
  for (const url of urls) {
    try {
      const id = await downloadFile({ url });
      results.push(id);
    } catch (error) {
      console.error(`Failed to download ${url}:`, error);
    }
  }
  
  return results;
}

// Usage
const files = await downloadQueue([
  'https://example.com/file1.pdf',
  'https://example.com/file2.pdf',
  'https://example.com/file3.pdf',
]);
```

### Custom Filename with Path

Specify both filename and directory:

```typescript
const downloadId = await downloadFile({
  url: 'https://example.com/data.csv',
  filename: 'Downloads/my-app/data.csv',
});
```

### Download → Parse Pipeline

Download and process files automatically:

```typescript
import { downloadFile, getDownloads } from '@theluckystrike/webext-downloads';

async function downloadAndProcess<T>(
  url: string,
  processFn: (content: string) => T
): Promise<T> {
  // Start download
  const downloadId = await downloadFile({ url });
  
  // Wait for completion
  await new Promise<void>((resolve) => {
    const removeListener = onDownloadChanged((delta) => {
      if (delta.id === downloadId && delta.state?.current === 'complete') {
        removeListener();
        resolve();
      }
    });
  });
  
  // Get the file path
  const items = await getDownloads({ id: downloadId });
  const filePath = items[0]?.filename;
  
  // Process the file (requires additional file reading logic)
  console.log(`File saved to: ${filePath}`);
  
  return processFn('processed content');
}
```

## API Reference

| Function | Description | Returns |
|----------|-------------|---------|
| `downloadFile(opts)` | Downloads a file with optional filename and save dialog | `Promise<number>` |
| `cancelDownload(id)` | Cancels an in-progress download | `Promise<void>` |
| `pauseDownload(id)` | Pauses a download | `Promise<void>` |
| `resumeDownload(id)` | Resumes a paused download | `Promise<void>` |
| `getDownloads(query?)` | Searches download history | `Promise<DownloadItem[]>` |
| `onDownloadChanged(cb)` | Subscribes to download state changes | `() => void` |
| `openDownload(id)` | Opens the downloaded file | `Promise<void>` |
| `showInFolder(id)` | Shows file in system file manager | `Promise<void>` |

### Types

```typescript
interface DownloadOptions {
  url: string;
  filename?: string;
  saveAs?: boolean;
}
```

## Permissions

Add these permissions to your `manifest.json`:

```json
{
  "permissions": [
    "downloads"
  ],
  "optional_host_permissions": [
    "<all_urls>"
  ]
}
```

To open downloaded files, also add:

```json
{
  "permissions": [
    "downloads",
    "downloads.open"
  ]
}
```

> **Note:** The `downloads.open` permission requires Manifest V3 and is only available in Chrome 117+.

## Requirements

- Chrome extensions environment with `chrome.downloads` API available
- TypeScript 5.0+
- Node.js 18+ (for development)

## Related Packages

Part of the @zovo/webext family:

- [`@theluckystrike/webext-tabs`](https://github.com/theluckystrike/webext-tabs) — Typed tab management
- [`@theluckystrike/webext-storage`](https://github.com/theluckystrike/webext-storage) — Type-safe storage wrapper
- [`@theluckystrike/webext-notifications`](https://github.com/theluckystrike/webext-notifications) — Desktop notifications

## License

MIT

---

Built by [theluckystrike](https://github.com/theluckystrike) — [zovo.one](https://zovo.one)
