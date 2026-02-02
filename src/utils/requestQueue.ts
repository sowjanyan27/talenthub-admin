type Task<T> = () => Promise<T>;

interface QueueItem<T> {
  task: Task<T>;
  resolve: (value: T) => void;
  reject: (reason: unknown) => void;
}

export class RequestQueue {
  private queue: QueueItem<unknown>[] = [];
  private running = 0;
  private readonly concurrency: number;
  private readonly delayMs: number;


  constructor(concurrency = 2, delayMs = 1000) {
    this.concurrency = concurrency;
    this.delayMs = delayMs;
  }

  enqueue<T>(task: Task<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({ task, resolve, reject } as QueueItem<unknown>);
      this.flush();
    });
  }

  get pending() {
    return this.queue.length;
  }

  get active() {
    return this.running;
  }

  private async flush() {
    while (this.running < this.concurrency && this.queue.length > 0) {
      const item = this.queue.shift()!;
      this.running++;
      this.run(item);

      if (this.queue.length > 0) {
        await new Promise((r) => setTimeout(r, this.delayMs));
      }
    }
  }

  private async run(item: QueueItem<unknown>) {
    try {
      const result = await item.task();
      item.resolve(result);
    } catch (err) {
      item.reject(err);
    } finally {
      this.running--;
      this.flush();
    }
  }
}

export const apiQueue = new RequestQueue(2, 1000);
