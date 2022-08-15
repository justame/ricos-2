import { findTable } from 'prosemirror-utils';
import { Decoration } from 'prosemirror-view';
import styles from '../plugins/table.scss';

export const dragDecorations = state => {
  const parentTable = findTable(state.selection);
  if (!parentTable) return null;
  const parentStart = parentTable.start;

  const div = document.createElement('div');
  div.classList.add(styles['table-drag-preview']);

  const dragDecoration = Decoration.widget(parentStart, div);

  return dragDecoration;
};
