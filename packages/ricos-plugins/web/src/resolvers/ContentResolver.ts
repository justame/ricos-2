import type { Node as TiptapNode } from 'prosemirror-model';
import type { IContentResolver } from 'ricos-types';

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
