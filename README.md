[![CI](https://github.com/theluckystrike/webext-downloads/actions/workflows/ci.yml/badge.svg)](https://github.com/theluckystrike/webext-downloads/actions)
[![npm](https://img.shields.io/npm/v/@anthropic/webext-downloads)](https://www.npmjs.com/package/@anthropic/webext-downloads)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

# @anthropic/webext-downloads

Typed download helpers for Chrome extensions. Part of [@zovo/webext](https://github.com/theluckystrike/webext).

## Features

- **Download files** — Simple API to initiate downloads from any URL
- **Download with custom filename** — Specify exact save location and filename
- **Progress tracking** — Monitor download state changes in real-time
- **Pause/Resume/Cancel** — Full control over active downloads
- **Search downloads** — Query downloads by status, filename, URL, and more
- **Erase history** — Clear download records from Chrome's history
- **Open downloaded file** — Launch the downloaded file in its default application
- **Show in folder** — Reveal the downloaded file in the system file manager
- **Event listeners** — Subscribe to `onCreated`, `onChanged`, and `onDeterminingFilename` events

## Installation

```bash
pnpm add @anthropic/webext-downloads
# or
npm install @anthropic/webext-downloads
```

## Quick Start

### Download a File

```typescript
import { downloadFile } from '@anthropic/webext-downloads';

// Download a file with a custom filename
const downloadId = await downloadFile({
  url: 'https://example.com/data.csv',
  filename: 'downloaded/data.csv',
});
console.log('Started download:', downloadId);
```

### Download with Options

```typescript
import { downloadFile, openDownload, showInFolder } from '@anthropic/webext-downloads';

// Download with "Save As" dialog
const downloadId = await downloadFile({
  url: 'https://example.com/report.pdf',
  filename: 'reports/monthly-report.pdf',
  saveAs: true, // Shows system save dialog
});

// After download completes, open or show in folder
await openDownload(downloadId);
// or
await showInFolder(downloadId);
```

### Cancel a Download

```typescript
import { downloadFile, cancelDownload } from '@anthropic/webext-downloads';

// Start a download
const downloadId = await downloadFile({
  url: 'https://example.com/large-file.zip',
});

// Cancel it before it completes
await cancelDownload(downloadId);
console.log('Download cancelled');
```

## Advanced Patterns

### Progress Bar with Percentage Tracking

Track download progress with real-time percentage updates:

```typescript
import { downloadFile, getDownloads, onDownloadChanged } from '@anthropic/webext-downloads';

interface DownloadProgress {
  id: number;
  url: string;
  filename: string;
  state: string;
  percentComplete: number;
  bytesReceived: number;
  totalBytes: number;
}

const activeDownloads = new Map<number, DownloadProgress>();

// Start tracking all download changes
const removeListener = onDownloadChanged((delta) => {
  const id = delta.id;
  
  // Get current download state
  getDownloads({ id }).then((items) => {
    if (items.length === 0) return;
    
    const item = items[0];
    const progress: DownloadProgress = {
      id: item.id,
      url: item.url,
      filename: item.filename,
      state: item.state,
      percentComplete: item.percentComplete ?? 0,
      bytesReceived: item.bytesReceived ?? 0,
      totalBytes: item.fileSize ?? 0,
    };
    
    activeDownloads.set(id, progress);
    
    // Log progress for this download
    console.log(`${progress.filename}: ${progress.percentComplete}%`);
    
    // Check if complete
    if (progress.state === 'complete') {
      console.log('Download finished!', progress.filename);
      activeDownloads.delete(id);
    } else if (progress.state === 'interrupted') {
      console.log('Download failed:', progress.filename);
      activeDownloads.delete(id);
    }
  });
});

// Start a download
const downloadId = await downloadFile({
  url: 'https://example.com/video.mp4',
});

// Later, stop listening
removeListener();
```

### Batch Download with Queue Management

Manage multiple concurrent downloads with a simple queue:

```typescript
import { downloadFile, onDownloadChanged, getDownloads } from '@anthropic/webext-downloads';

interface QueueItem {
  url: string;
  filename: string;
  id?: number;
  status: 'pending' | 'downloading' | 'complete' | 'error';
}

class DownloadQueue {
  private queue: QueueItem[] = [];
  private activeCount = 0;
  private maxConcurrent = 3;
  
  constructor(maxConcurrent = 3) {
    this.maxConcurrent = maxConcurrent;
  }
  
  add(url: string, filename: string): void {
    this.queue.push({ url, filename, status: 'pending' });
    this.processQueue();
  }
  
  private async processQueue(): Promise<void> {
    while (this.activeCount < this.maxConcurrent && this.queue.length > 0) {
      const item = this.queue.shift();
      if (!item) break;
      
      item.status = 'downloading';
      this.activeCount++;
      
      try {
        const downloadId = await downloadFile({ url: item.url, filename: item.filename });
        item.id = downloadId;
        console.log(`Started: ${item.filename}`);
      } catch (error) {
        item.status = 'error';
        console.error(`Failed to start: ${item.filename}`, error);
        this.activeCount--;
      }
    }
  }
  
  getStatus(): QueueItem[] {
    return [...this.queue];
  }
}

// Usage
const queue = new DownloadQueue(3);

// Add files to download queue
queue.add('https://example.com/file1.zip', 'downloads/file1.zip');
queue.add('https://example.com/file2.zip', 'downloads/file2.zip');
queue.add('https://example.com/file3.zip', 'downloads/file3.zip');
queue.add('https://example.com/file4.zip', 'downloads/file4.zip');
```

### Custom Filename Determination

Use `onDeterminingFilename` to customize filenames before download starts:

```typescript
import { onDeterminingFilename } from '@anthropic/webext-downloads';

// Note: This requires the downloads API's onDeterminingFilename
// which is available in the extension's background script

chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
  const url = downloadItem.url;
  
  // Extract filename from URL or generate custom name
  if (url.includes('api/data')) {
    const timestamp = new Date().toISOString().split('T')[0];
    suggest({ filename: `data/export-${timestamp}.csv` });
  } else {
    // Let Chrome decide
    suggest();
  }
});
```

### Download and Process Pattern

Download a file, then read and process its contents:

```typescript
import { downloadFile, showInFolder, getDownloads } from '@anthropic/webext-downloads';

async function downloadAndProcess<T>(
  url: string,
  filename: string,
  processor: (filePath: string) => Promise<T>
): Promise<T> {
  // Start download
  const downloadId = await downloadFile({ url, filename });
  
  // Wait for download to complete
  let attempts = 0;
  const maxAttempts = 100;
  
  while (attempts < maxAttempts) {
    const items = await getDownloads({ id: downloadId });
    const item = items[0];
    
    if (item?.state === 'complete') {
      // Get the actual file path
      const filePath = item.filename;
      console.log('Download complete:', filePath);
      
      // Process the downloaded file
      return await processor(filePath);
    } else if (item?.state === 'interrupted') {
      throw new Error('Download was interrupted');
    }
    
    await new Promise(r => setTimeout(r, 100));
    attempts++;
  }
  
  throw new Error('Download timed out');
}

// Usage: Download a JSON file and parse it
const data = await downloadAndProcess(
  'https://example.com/config.json',
  'config/settings.json',
  async (filePath) => {
    // Use chrome.downloads.open or fetch to read the file
    const response = await fetch(`file://${filePath}`);
    return await response.json();
  }
);

console.log('Processed data:', data);
```

## API Reference

### Functions

| Function | Description | Returns |
|----------|-------------|---------|
| `downloadFile(opts)` | Downloads a file from a URL | `Promise<number>` (download ID) |
| `cancelDownload(id)` | Cancels an active download | `Promise<void>` |
| `pauseDownload(id)` | Pauses a download | `Promise<void>` |
| `resumeDownload(id)` | Resumes a paused download | `Promise<void>` |
| `getDownloads(query?)` | Search for downloads | `Promise<DownloadItem[]>` |
| `openDownload(id)` | Open the downloaded file | `Promise<void>` |
| `showInFolder(id)` | Show file in system folder | `Promise<void>` |
| `onDownloadChanged(cb)` | Listen for download changes | `() => void` (unsubscribe) |
| `eraseHistory(id)` | Clear download from history | `Promise<void>` |

### Types

```typescript
interface DownloadOptions {
  url: string;
  filename?: string;
  saveAs?: boolean;
}
```

### Chrome Downloads API

This library wraps the Chrome `chrome.downloads` API. For full API details, see [Chrome Downloads API](https://developer.chrome.com/docs/extensions/reference/downloads/).

## Permissions

Add the `downloads` permission to your `manifest.json`:

```json
{
  "name": "My Extension",
  "permissions": [
    "downloads"
  ],
  "host_permissions": [
    "https://*/*",
    "http://*/*"
  ]
}
```

To open downloaded files or show them in folders, also add:

```json
{
  "permissions": [
    "downloads",
    "downloads.open"
  ]
}
```

> **Note**: The `downloads.open` permission is required for `openDownload()`. Without it, the function will reject with an error.

## Requirements

- Chrome extensions environment with `chrome.downloads` API available
- TypeScript 5.0+
- Chrome 31+ (for downloads API)

## Part of @zovo/webext

`@anthropic/webext-downloads` is part of the [@zovo/webext](https://github.com/theluckystrike/webext) collection of typed Chrome extension utilities:

- [`@anthropic/webext-storage`](https://github.com/theluckystrike/webext-storage) — Typed storage helpers
- [`@anthropic/webext-tabs`](https://github.com/theluckystrike/webext-tabs) — Tab management utilities
- [`@anthropic/webext-messaging`](https://github.com/theluckystrike/webext-messaging) — Type-safe messaging
- And more...

## License

MIT License — see [LICENSE](LICENSE) for details.

---

Built by [theluckystrike](https://github.com/theluckystrike) — [zovo.one](https://zovo.one)
