/* eslint-disable fp/no-loops */
import { isTableSelected } from '../utilities/is-selected';
import { TableMap } from 'prosemirror-tables';
import { Decoration } from 'prosemirror-view';
import styles from './controllers.scss';
import { selectTableSvg } from './svgs';

export const tableControllerDecorations = (newState, editor, parentTable) => {
  const decorations: Decoration[] = [];
  const { selection } = newState;
  const parentStart = parentTable.start;

  const isAllCellsSelected = isTableSelected(selection);

  const dragPreview = document.createElement('div');
  dragPreview.classList.add(styles.tableDragPreview);
  decorations.push(Decoration.widget(parentStart, dragPreview));

  const tableMap = TableMap.get(parentTable.node);

  const tableController = document.createElement('div');
  tableController.classList.add(styles.tableController);
  tableController.innerHTML = selectTableSvg;
  tableController.onmousedown = e => handleSelectTableClick(e, editor);
  if (isAllCellsSelected) tableController.classList.add(styles.selected);

  decorations.push(Decoration.widget(parentStart + tableMap.map[0] + 1, tableController));

  return decorations;
};

function handleSelectTableClick(event, editor) {
  event.stopPropagation();
  event.preventDefault();
  editor.commands.selectWholeTable();
}
