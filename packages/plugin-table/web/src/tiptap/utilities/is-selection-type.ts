//https://github.com/ahixon/atlassian-frontend-mirror/blob/56aed9b2a0dfb8052ad71fe1668a04342db3de30/editor/editor-tables/src/utils/is-selection-type.ts
/* eslint-disable no-redeclare */
import type { ResolvedPos } from 'prosemirror-model';
import type { NodeSelection, Selection, TextSelection } from 'prosemirror-state';

interface CellSelectionShape extends Selection {
  $anchorCell: ResolvedPos;
  $headCell: ResolvedPos;
  visible: boolean;
}

export function isSelectionType(
  selection: Selection,
  type: 'cell'
): selection is CellSelectionShape;

export function isSelectionType(selection: Selection, type: 'node'): selection is NodeSelection;

export function isSelectionType(selection: Selection, type: 'text'): selection is TextSelection;

export function isSelectionType(selection: Selection, type: string): boolean {
  if (!selection) {
    return false;
  }
  const serialized = selection.toJSON();
  return serialized.type === type;
}
