import type { ResolvedPos } from 'prosemirror-model';

export type SelectionRange = {
  $anchor: ResolvedPos;
  $head: ResolvedPos;
  // an array of column/row indexes
  indexes: number[];
};
