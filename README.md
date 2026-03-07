# @anthropic/webext-downloads

Typed download helpers for Chrome extensions.

## Installation

```bash
pnpm add @anthropic/webext-downloads
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
} from '@anthropic/webext-downloads';

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

## API

### `downloadFile(opts)`

Downloads a file using the Chrome downloads API.

- `opts.url` (required): The URL to download
- `opts.filename` (optional): The filename to save as
- `opts.saveAs` (optional): Show the "Save As" dialog

Returns: `Promise<number>` - The download ID

### `cancelDownload(id)`

Cancels a download.

- `id`: The download ID to cancel

Returns: `Promise<void>`

### `pauseDownload(id)`

Pauses a download.

- `id`: The download ID to pause

Returns: `Promise<void>`

### `resumeDownload(id)`

Resumes a paused download.

- `id`: The download ID to resume

Returns: `Promise<void>`

### `getDownloads(query?)`

Gets downloads matching the query.

- `query` (optional): Query parameters (see Chrome downloads API)

Returns: `Promise<DownloadItem[]>`

### `onDownloadChanged(cb)`

Sets up a listener for download state changes.

- `cb`: Callback function called when download state changes

Returns: `Function` - Call to remove the listener

### `openDownload(id)`

Opens the downloaded file.

- `id`: The download ID to open

Returns: `Promise<void>`

### `showInFolder(id)`

Shows the downloaded file in the file manager.

- `id`: The download ID to show in folder

Returns: `Promise<void>`

## Requirements

- Chrome extensions environment with `chrome.downloads` API available
- TypeScript 5.0+

## License

MIT
