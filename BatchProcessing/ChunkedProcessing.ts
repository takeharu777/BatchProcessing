export type Chunk<T> = {
  data: T[];
  start: number;
  end: number;
  size: number;
};

export function splitIntoChunks<T>(
  data: T[],
  chunkSize: number = 20
): Chunk<T>[] {
  const chunks: Chunk<T>[] = [];

  for (let i = 0; i < data.length; i += chunkSize) {
    const start = i;
    const end = Math.min(i + chunkSize, data.length);
    const size = end - start;
    const chunkData = data.slice(start, end);

    chunks.push({
      data: chunkData,
      start: start,
      end: end,
      size: size
    });
  }

  return chunks;
}

export function createChunkedPromises<T, R>(
  data: T[],
  asyncProcessor: (chunk: T[], start: number, end: number, size: number) => Promise<R>,
  chunkSize: number = 20
): Promise<R>[] {
  const dataChunks = splitIntoChunks(data, chunkSize);
  const promises: Promise<R>[] = [];

  for (const chunk of dataChunks) {
    const promise = asyncProcessor(chunk.data, chunk.start, chunk.end, chunk.size);
    promises.push(promise);
  }

  return promises;
}

export async function processInChunks<T, R>(
  data: T[],
  asyncProcessor: (chunk: T[], start: number, end: number, size: number) => Promise<R>,
  chunkSize: number = 20
): Promise<R[]> {
  const chunkPromises = createChunkedPromises(data, asyncProcessor, chunkSize);
  return await Promise.all(chunkPromises);
}