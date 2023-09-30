import {
  splitIntoChunks,
  createChunkedPromises,
  processInChunks
} from './ChunkedProcessing';

describe('ChunkedProcessing', () => {
  const sampleData = Array.from({ length: 103 }, (_, i) => i);

  const asyncProcessor = async (chunk: number[], start: number, end: number, size: number) => {
    return chunk.map(item => item * 2);
  };

  it('should split data into chunks', () => {
    const chunks = splitIntoChunks(sampleData, 20);
    expect(chunks.length).toBe(6);
    expect(chunks[0].data.length).toBe(20);
    expect(chunks[5].data.length).toBe(3);
  });

  it('should create chunked promises', async () => {
    const promises = createChunkedPromises(sampleData, asyncProcessor, 20);
    const results = await Promise.all(promises);
    expect(results.flat().length).toBe(103);
  });

  it('should process data in chunks', async () => {
    const results = await processInChunks(sampleData, asyncProcessor, 20);
    expect(results.flat().length).toBe(103);
  });
});