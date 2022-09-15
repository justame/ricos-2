//https://github.com/ahixon/atlassian-frontend-mirror/blob/56aed9b2a0dfb8052ad71fe1668a04342db3de30/editor/editor-tables/src/utils/is-selection-type.ts
/* eslint-disable no-redeclare */
import type { ResolvedPos } from 'prosemirror-model';
import type { Selection } from 'prosemirror-state';

export interface CellSelectionShape extends Selection {
  $anchorCell: ResolvedPos;
  $headCell: ResolvedPos;
  visible: boolean;
  forEachCell;
}

export function isSelectionType(
  selection: Selection,
  type: 'cell'
): selection is CellSelectionShape;

export function isSelectionType(selection: Selection, type: string): boolean {
  if (!selection) {
    return false;
  }
  const serialized = selection.toJSON();
  return serialized.type === type;
}

export function isCellSelection(selection: Selection) {
  return isSelectionType(selection, 'cell');
}
