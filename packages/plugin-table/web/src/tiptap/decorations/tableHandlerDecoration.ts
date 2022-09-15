/* eslint-disable fp/no-loops */
import { Decoration } from 'prosemirror-view';
import styles from './controllers.scss';
import { selectTableSvg } from './svgs';
import { TableQuery } from '../TableQuery';

export const tableHandlerDecoration = (state, editor) => {
  const { selection } = state;
  const table = TableQuery.of(selection);
  const parentStart = table.getStartPos();
  const isAllCellsSelected = table.isTableSelected();

  const tableController = document.createElement('div');
  tableController.classList.add(styles.tableController);
  tableController.innerHTML = selectTableSvg;
  tableController.addEventListener('mousedown', e => handleSelectTableClick(e, editor));
  if (isAllCellsSelected) tableController.classList.add(styles.selected);

  return [Decoration.widget(parentStart + table.getMap()[0] + 1, tableController)];
};

function handleSelectTableClick(event, editor) {
  event.stopPropagation();
  event.preventDefault();
  editor.commands.selectWholeTable();
}
