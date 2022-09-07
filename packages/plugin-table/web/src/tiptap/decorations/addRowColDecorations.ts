import { findTable } from 'prosemirror-utils';
import { TableMap } from 'prosemirror-tables';
import { Decoration } from 'prosemirror-view';
import styles from './addRowCol.scss';
import { addSvg } from './svgs';

export const addRowColDecorations = (state, editor) => {
  const parentTable = findTable(state.selection);
  if (!parentTable) return null;
  const parentStart = parentTable.start;
  const map = TableMap.get(parentTable.node);

  const addRowDiv = document.createElement('div');
  addRowDiv.innerHTML = addSvg;
  addRowDiv.classList.add(styles.tableAddRow);
  addRowDiv.addEventListener('mousedown', e => {
    e.stopPropagation();
    e.preventDefault();

    editor.chain().addRowAtIndex(map.height).selectRowAtIndex(map.height).run();
  });
  const rowDecoration = Decoration.widget(parentStart, addRowDiv);

  const addColDiv = document.createElement('div');
  addColDiv.innerHTML = addSvg;

  addColDiv.classList.add(styles.tableAddCol);
  addColDiv.addEventListener('mousedown', e => {
    e.stopPropagation();
    e.preventDefault();

    editor.chain().addColumnAtIndex(map.width).selectColumnAtIndex(map.width).run();
  });
  const colDecoration = Decoration.widget(parentStart, addColDiv);

  return [rowDecoration, colDecoration];
};
