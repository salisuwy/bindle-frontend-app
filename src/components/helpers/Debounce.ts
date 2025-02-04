export default class Debounce {
  public callback: () => void;
  public threshold: number;
  private lastTrigger: number = 0;
  private timeout: any = 0;

  public constructor(callback: () => void, threshold: number = 200) {
    this.callback = callback;
    this.threshold = threshold;

    // Bind run method to the current instance
    this.run = this.run.bind(this);
  }

  public run(): void {
    const now: number = Date.now();
    const diff: number = now - this.lastTrigger;

    // Execute Immediately
    if (diff > this.threshold) {
      this.lastTrigger = now;
      this.callback();
    }

    // Cancel future event, if exists
    if (this.timeout !== 0) {
      clearTimeout(this.timeout);
      this.timeout = 0;
    }

    // Create future event
    this.timeout = setTimeout(() => {
      this.lastTrigger = Date.now();
      this.callback();
    }, this.threshold);
  }
}
