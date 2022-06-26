import type { Node as TiptapNode } from 'prosemirror-model';
import type { EditorState } from '@wix/draft-js';
export interface IContentResolver<T> {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolve: (content: T) => any;
}

export class TiptapContentResolver implements IContentResolver<TiptapNode[]> {
  // eslint-disable-next-line no-useless-constructor
  private constructor(readonly id, readonly resolve) {}

  static create(
    id: string,
    resolve: IContentResolver<TiptapNode[]>['resolve']
  ): IContentResolver<TiptapNode[]> {
    return new TiptapContentResolver(id, resolve);
  }
}

export class DraftContentResolver implements IContentResolver<EditorState> {
  // eslint-disable-next-line no-useless-constructor
  private constructor(readonly id, readonly resolve) {}

  static create(
    id: string,
    resolve: IContentResolver<EditorState>['resolve']
  ): IContentResolver<EditorState> {
    return new DraftContentResolver(id, resolve);
  }
}
