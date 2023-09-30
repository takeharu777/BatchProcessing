export class ConcurrencyLimiting {
  private _maxConcurrency: number;
  private _currentCount: number = 0;
  private _queue: (() => void)[] = [];

  constructor(maxConcurrency: number) {
    this._maxConcurrency = maxConcurrency;
  }

  get currentCount(): number {
    return this._currentCount;
  }

  async acquire(): Promise<void> {
    return new Promise((resolve) => {
      if (this._currentCount < this._maxConcurrency) {
        this._currentCount++;
        resolve();
      } else {
        this._queue.push(resolve);
      }
    });
  }

  release(): void {
    if (this._queue.length > 0) {
      const next = this._queue.shift();
      if (next) next();
    } else {
      this._currentCount--;
    }
  }
}

import { splitIntoChunks } from './ChunkedProcessing';

export async function limitedAsyncProcessor<T, R>(
  data: T[],
  asyncProcessor: (chunk: T[], start: number, end: number, size: number) => Promise<R>,
  chunkSize: number = 20
): Promise<R[]> {
  const concurrencyLimiter = new ConcurrencyLimiting(5);
  const chunks = splitIntoChunks(data, chunkSize);
  const results: R[] = [];

  for (const chunk of chunks) {
    await concurrencyLimiter.acquire();
    try {
      const result = await asyncProcessor(chunk.data, chunk.start, chunk.end, chunk.size);
      results.push(result);
    } finally {
      concurrencyLimiter.release();
    }
  }

  return results;
}