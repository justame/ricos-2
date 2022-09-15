import { Decoration } from 'prosemirror-view';
import styles from './addRowCol.scss';
import { addSvg } from './svgs';
import { TableQuery } from '../TableQuery';

export const addColDecoration = (state, editor) => {
  const table = TableQuery.of(state.selection);
  const colNum = table.getWidth();
  const addColDiv = document.createElement('div');

  addColDiv.innerHTML = addSvg;
  addColDiv.classList.add(styles.tableAddCol);
  addColDiv.addEventListener('mousedown', e => {
    e.stopPropagation();
    e.preventDefault();
    editor.chain().addColumnAtIndex(colNum).selectColumnAtIndex(colNum).run();
  });

  const colDecoration = Decoration.widget(table.getStartPos(), addColDiv);

  return colDecoration;
};
