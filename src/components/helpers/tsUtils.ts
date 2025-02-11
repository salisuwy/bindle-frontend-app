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

export const typedKeys = <T extends object>(obj: T): (keyof T)[] => {
  return Object.keys(obj) as (keyof T)[];
};

export type OmitMethods<T> = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  [K in keyof T as T[K] extends Function ? never : K]: T[K];
};
