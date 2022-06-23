export interface IContentResolver<T> {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolve: (content: T) => any;
}
