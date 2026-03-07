import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  downloadFile,
  cancelDownload,
  pauseDownload,
  resumeDownload,
  getDownloads,
  onDownloadChanged,
  openDownload,
  showInFolder,
} from '../index';

declare const chrome: any;

const mockDownloadItem: chrome.downloads.DownloadItem = {
  id: 1,
  url: 'https://example.com/file.pdf',
  filename: '/downloads/file.pdf',
  mime: 'application/pdf',
  startTime: '2024-01-01T00:00:00.000Z',
  endTime: '2024-01-01T00:01:00.000Z',
  estimatedEndTime: '2024-01-01T00:01:00.000Z',
  state: 'complete',
  paused: false,
  canResume: false,
  error: undefined,
  bytesReceived: 1000,
  totalBytes: 1000,
  fileSize: 1000,
  exists: true,
} as any;

// Helper to check if chrome API is available
const hasChromeDownloads = () => {
  return typeof chrome !== 'undefined' && chrome?.downloads != null;
};

describe('downloadFile', () => {
  beforeEach(() => {
    globalThis.chrome = {
      downloads: {
        download: vi.fn((opts, cb) => cb(1)),
      },
      runtime: {
        lastError: undefined,
      },
    } as any;
  });

  afterEach(() => {
    // Reset to undefined
    (globalThis as any).chrome = undefined;
  });

  it('should download a file with url only', async () => {
    const id = await downloadFile({ url: 'https://example.com/file.pdf' });
    expect(id).toBe(1);
    expect(chrome.downloads.download).toHaveBeenCalledWith(
      { url: 'https://example.com/file.pdf' },
      expect.any(Function)
    );
  });

  it('should download a file with filename', async () => {
    await downloadFile({ url: 'https://example.com/file.pdf', filename: 'custom.pdf' });
    expect(chrome.downloads.download).toHaveBeenCalledWith(
      { url: 'https://example.com/file.pdf', filename: 'custom.pdf' },
      expect.any(Function)
    );
  });

  it('should download a file with saveAs option', async () => {
    await downloadFile({ url: 'https://example.com/file.pdf', saveAs: true });
    expect(chrome.downloads.download).toHaveBeenCalledWith(
      { url: 'https://example.com/file.pdf', saveAs: true },
      expect.any(Function)
    );
  });

  it('should throw when API is unavailable', async () => {
    // First remove chrome
    (globalThis as any).chrome = undefined;
    // Need to re-require to test again with undefined chrome
    // Since the function is already loaded, we test the behavior
    expect(hasChromeDownloads()).toBe(false);
    await expect(downloadFile({ url: 'https://example.com/file.pdf' })).rejects.toThrow(
      'chrome.downloads API is not available'
    );
  });
});

describe('cancelDownload', () => {
  beforeEach(() => {
    globalThis.chrome = {
      downloads: {
        cancel: vi.fn((id, cb) => cb()),
      },
      runtime: {
        lastError: undefined,
      },
    } as any;
  });

  afterEach(() => {
    (globalThis as any).chrome = undefined;
  });

  it('should cancel a download', async () => {
    await cancelDownload(1);
    expect(chrome.downloads.cancel).toHaveBeenCalledWith(1, expect.any(Function));
  });

  it('should throw when API is unavailable', async () => {
    (globalThis as any).chrome = undefined;
    expect(hasChromeDownloads()).toBe(false);
    await expect(cancelDownload(1)).rejects.toThrow('chrome.downloads API is not available');
  });
});

describe('pauseDownload', () => {
  beforeEach(() => {
    globalThis.chrome = {
      downloads: {
        pause: vi.fn((id, cb) => cb()),
      },
      runtime: {
        lastError: undefined,
      },
    } as any;
  });

  afterEach(() => {
    (globalThis as any).chrome = undefined;
  });

  it('should pause a download', async () => {
    await pauseDownload(1);
    expect(chrome.downloads.pause).toHaveBeenCalledWith(1, expect.any(Function));
  });
});

describe('resumeDownload', () => {
  beforeEach(() => {
    globalThis.chrome = {
      downloads: {
        resume: vi.fn((id, cb) => cb()),
      },
      runtime: {
        lastError: undefined,
      },
    } as any;
  });

  afterEach(() => {
    (globalThis as any).chrome = undefined;
  });

  it('should resume a download', async () => {
    await resumeDownload(1);
    expect(chrome.downloads.resume).toHaveBeenCalledWith(1, expect.any(Function));
  });
});

describe('getDownloads', () => {
  beforeEach(() => {
    globalThis.chrome = {
      downloads: {
        search: vi.fn((query, cb) => cb([mockDownloadItem])),
      },
      runtime: {
        lastError: undefined,
      },
    } as any;
  });

  afterEach(() => {
    (globalThis as any).chrome = undefined;
  });

  it('should get all downloads with empty query', async () => {
    const items = await getDownloads();
    expect(items).toEqual([mockDownloadItem]);
    expect(chrome.downloads.search).toHaveBeenCalledWith({}, expect.any(Function));
  });

  it('should get downloads with query params', async () => {
    const items = await getDownloads({ query: ['pdf'], limit: 10 });
    expect(items).toEqual([mockDownloadItem]);
    expect(chrome.downloads.search).toHaveBeenCalledWith(
      { query: ['pdf'], limit: 10 },
      expect.any(Function)
    );
  });
});

describe('onDownloadChanged', () => {
  beforeEach(() => {
    globalThis.chrome = {
      downloads: {
        onChanged: {
          addListener: vi.fn(),
          removeListener: vi.fn(),
        },
      },
    } as any;
  });

  afterEach(() => {
    (globalThis as any).chrome = undefined;
  });

  it('should add and remove listener', () => {
    const cb = vi.fn();
    const removeListener = onDownloadChanged(cb);
    expect(chrome.downloads.onChanged.addListener).toHaveBeenCalledWith(cb);
    removeListener();
    expect(chrome.downloads.onChanged.removeListener).toHaveBeenCalledWith(cb);
  });

  it('should throw when API is unavailable', () => {
    (globalThis as any).chrome = undefined;
    expect(hasChromeDownloads()).toBe(false);
    expect(() => onDownloadChanged(vi.fn())).toThrow(
      'chrome.downloads API is not available'
    );
  });
});

describe('openDownload', () => {
  beforeEach(() => {
    globalThis.chrome = {
      downloads: {
        open: vi.fn((id, cb) => cb()),
      },
      runtime: {
        lastError: undefined,
      },
    } as any;
  });

  afterEach(() => {
    (globalThis as any).chrome = undefined;
  });

  it('should open a download', async () => {
    await openDownload(1);
    expect(chrome.downloads.open).toHaveBeenCalledWith(1, expect.any(Function));
  });
});

describe('showInFolder', () => {
  beforeEach(() => {
    globalThis.chrome = {
      downloads: {
        show: vi.fn((id) => true),
      },
      runtime: {
        lastError: undefined,
      },
    } as any;
  });

  afterEach(() => {
    (globalThis as any).chrome = undefined;
  });

  it('should show download in folder', async () => {
    await showInFolder(1);
    expect(chrome.downloads.show).toHaveBeenCalledWith(1);
  });
});
