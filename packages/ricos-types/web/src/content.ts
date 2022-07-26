export interface IContent<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolve(contentResolver): any;

  update(content: T): void;

  isEmpty(): boolean;
}
