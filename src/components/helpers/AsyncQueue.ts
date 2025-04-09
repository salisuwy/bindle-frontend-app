export class AsyncQueue {
  private queue: (() => Promise<void>)[] = [];
  private processing = false;

  /**
   * Add a task to the queue
   * @param task The async function to execute
   * @returns A promise that resolves when the task completes
   */
  async enqueue(task: () => Promise<void>): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // Wrap the original task to handle completion
      const wrappedTask = async () => {
        try {
          await task();
          resolve();
        } catch (error) {
          reject(error);
        }
      };

      // Add to queue
      this.queue.push(wrappedTask);

      // Start processing if not already running
      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  /**
   * Process tasks in the queue sequentially
   */
  private async processQueue(): Promise<void> {
    if (this.processing) return;

    this.processing = true;

    try {
      while (this.queue.length > 0) {
        const task = this.queue.shift();
        if (task) {
          await task();
        }
      }
    } finally {
      this.processing = false;
    }
  }

  /**
   * Check if the queue is currently processing tasks
   */
  isProcessing(): boolean {
    return this.processing;
  }

  /**
   * Get the number of pending tasks in the queue
   */
  get pendingCount(): number {
    return this.queue.length;
  }

  /**
   * Clear all pending tasks from the queue
   */
  clear(): void {
    this.queue = [];
  }
}
