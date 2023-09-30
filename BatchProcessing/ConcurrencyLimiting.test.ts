import { ConcurrencyLimiting } from './ConcurrencyLimiting';

describe('ConcurrencyLimiting', () => {
  it('should limit concurrent async operations', async () => {
    const concurrencyLimiting = new ConcurrencyLimiting(2);
    const delays = [100, 200, 300, 400];

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const tasks = delays.map(async delayDuration => {
      await concurrencyLimiting.acquire();
      expect(concurrencyLimiting.currentCount).toBeLessThanOrEqual(2); // ConcurrencyLimitingのカレントカウントが2以下であることを確認
      await delay(delayDuration);
      concurrencyLimiting.release();
    });

    await Promise.all(tasks);
  });
});