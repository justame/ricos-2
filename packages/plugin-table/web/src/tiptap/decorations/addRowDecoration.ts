import { Decoration } from 'prosemirror-view';
import styles from './addRowCol.scss';
import { addSvg } from './svgs';
import { TableQuery } from '../TableQuery';

export const addRowDecoration = (state, editor) => {
  const table = TableQuery.of(state.selection);
  const rowNum = table.getHeight();
  const addRowDiv = document.createElement('div');

  addRowDiv.innerHTML = addSvg;
  addRowDiv.classList.add(styles.tableAddRow);
  addRowDiv.addEventListener('mousedown', e => {
    e.stopPropagation();
    e.preventDefault();
    editor.chain().addRowAtIndex(rowNum).selectRowAtIndex(rowNum).run();
  });

  const rowDecoration = Decoration.widget(table.getStartPos(), addRowDiv);

  return rowDecoration;
};
