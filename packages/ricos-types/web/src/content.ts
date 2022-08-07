export interface IContent<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolve(contentResolver): any;

  update(content: T, editor?): void;

  forceUpdate(): void;

  isEmpty(): boolean;
}
