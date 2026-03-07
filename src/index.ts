export interface DownloadOptions {
  url: string;
  filename?: string;
  saveAs?: boolean;
}

/**
 * Downloads a file using the Chrome downloads API.
 * @param opts - Download options
 * @returns Promise resolving to the download ID
 */
export async function downloadFile(opts: DownloadOptions): Promise<number> {
  return new Promise((resolve, reject) => {
    if (!chrome?.downloads?.download) {
      reject(new Error('chrome.downloads API is not available'));
      return;
    }

    const options: chrome.downloads.DownloadOptions = {
      url: opts.url,
    };

    if (opts.filename) {
      options.filename = opts.filename;
    }
    if (opts.saveAs) {
      options.saveAs = true;
    }

    chrome.downloads.download(options, (downloadId) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(downloadId);
      }
    });
  });
}

/**
 * Cancels a download.
 * @param id - The download ID to cancel
 */
export async function cancelDownload(id: number): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!chrome?.downloads?.cancel) {
      reject(new Error('chrome.downloads API is not available'));
      return;
    }

    chrome.downloads.cancel(id, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve();
      }
    });
  });
}

/**
 * Pauses a download.
 * @param id - The download ID to pause
 */
export async function pauseDownload(id: number): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!chrome?.downloads?.pause) {
      reject(new Error('chrome.downloads API is not available'));
      return;
    }

    chrome.downloads.pause(id, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve();
      }
    });
  });
}

/**
 * Resumes a paused download.
 * @param id - The download ID to resume
 */
export async function resumeDownload(id: number): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!chrome?.downloads?.resume) {
      reject(new Error('chrome.downloads API is not available'));
      return;
    }

    chrome.downloads.resume(id, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve();
      }
    });
  });
}

/**
 * Gets downloads matching the query.
 * @param query - Optional query parameters
 * @returns Promise resolving to array of download items
 */
export async function getDownloads(
  query?: chrome.downloads.DownloadQuery
): Promise<chrome.downloads.DownloadItem[]> {
  return new Promise((resolve, reject) => {
    if (!chrome?.downloads?.search) {
      reject(new Error('chrome.downloads API is not available'));
      return;
    }

    chrome.downloads.search(query || {}, (items) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(items);
      }
    });
  });
}

/**
 * Sets up a listener for download state changes.
 * @param cb - Callback function called when download state changes
 * @returns Function to remove the listener
 */
export function onDownloadChanged(
  cb: (delta: chrome.downloads.DownloadDelta) => void
): () => void {
  if (!chrome?.downloads?.onChanged) {
    throw new Error('chrome.downloads API is not available');
  }

  chrome.downloads.onChanged.addListener(cb);

  return () => {
    chrome.downloads.onChanged.removeListener(cb);
  };
}

/**
 * Opens the downloaded file.
 * @param id - The download ID to open
 */
export async function openDownload(id: number): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!chrome?.downloads?.open) {
      reject(new Error('chrome.downloads API is not available'));
      return;
    }

    chrome.downloads.open(id, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve();
      }
    });
  });
}

/**
 * Shows the downloaded file in the file manager.
 * @param id - The download ID to show in folder
 */
export async function showInFolder(id: number): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!chrome?.downloads?.show) {
      reject(new Error('chrome.downloads API is not available'));
      return;
    }

    // chrome.downloads.show() returns a boolean and doesn't take a callback
    try {
      chrome.downloads.show(id);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}
