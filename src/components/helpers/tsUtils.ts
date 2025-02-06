export class DeferredPromise<T> {
  promise: Promise<T>;
  resolve!: (value: T) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reject!: (reason?: any) => void;
  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.reject = reject;
      this.resolve = resolve;
    });
  }
}
