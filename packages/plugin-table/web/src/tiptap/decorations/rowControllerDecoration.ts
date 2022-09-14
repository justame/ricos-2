/* eslint-disable fp/no-loops */
import { getCellsInRow } from 'prosemirror-utils';
import { isRowSelected, isTableSelected } from '../utilities/is-selected';
import { TableMap, CellSelection } from 'prosemirror-tables';
import { Decoration } from 'prosemirror-view';
import styles from './controllers.scss';
import { dragAndDropSvg } from './svgs';
import {
  getDragPreviewElement,
  updateRowDragPreview,
  calculateRowDropIndex,
} from '../plugins/dragPreviewUtils';

export const rowControllerDecorations = (newState, editor, parentTable) => {
  const decorations: Decoration[] = [];
  const { selection } = newState;
  const parentStart = parentTable.start;

  const isAllCellsSelected = isTableSelected(selection);
  const tableMap = TableMap.get(parentTable.node);

  for (let i = 0; i < tableMap.height; i += 1) {
    const div = document.createElement('div');
    div.classList.add(styles.rowController);
    div.onmousedown = e => handleRowControllerMouseDown(i, e, editor, tableMap, parentTable);
    div.innerHTML = dragAndDropSvg;

    const resizerDiv = document.createElement('div');
    resizerDiv.classList.add(styles.rowResize);

    if (isAllCellsSelected) {
      div.classList.add(styles.allCellsSelected);
    } else if (isRowSelected(i)(selection)) {
      div.classList.add(styles.selected);
    }
    if (i === tableMap.height - 1) {
      div.classList.add(styles.last);
    }
    decorations.push(Decoration.widget(parentStart + tableMap.map[i * tableMap.width] + 1, div));
    decorations.push(
      Decoration.widget(parentStart + tableMap.map[i * tableMap.width] + 1, resizerDiv)
    );
  }

  return decorations;
};

function handleRowControllerMouseDown(i, event, editor, rowNum, parentTable) {
  event.stopPropagation();
  event.preventDefault();
  const { selection, doc, tr } = editor.state;
  if (selection.isRowSelection?.() && event.shiftKey) {
    // Adding to an existing rows selection
    const { $anchorCell, $headCell } = selection;
    const $head = $anchorCell.pos > $headCell.pos ? $headCell : $anchorCell;

    if (!$head) {
      return;
    }
    const $anchor = doc.resolve(getCellsInRow(i)(selection)?.[rowNum - 1].pos);

    const rowsSelection = new CellSelection($anchor, $head);
    if (!selection.eq(rowsSelection)) {
      editor.view.dispatch(tr.setSelection(rowsSelection));
    }
  } else {
    editor.commands.selectRowAtIndex(i);
  }

  const dragPreview = getDragPreviewElement(editor, parentTable.start);
  const rowsHeight = parentTable.node.attrs.dimensions.rowsHeight;
  const startTop = rowsHeight.slice(0, i).reduce((curr, height) => curr + height, 0);

  const startY = event.clientY;
  const totalHeight = rowsHeight.reduce((curr, height) => curr + height, 0);
  const dragPreviewHeight = rowsHeight[i];
  let dropIndex = i;

  function move(event) {
    if (dragPreview) {
      const dragging = event.clientY;
      const top = Math.min(startTop + dragging - startY, totalHeight - dragPreviewHeight + 20);
      dropIndex = calculateRowDropIndex(rowsHeight, top, dragPreviewHeight);
      updateRowDragPreview(parentTable, dragPreview, top, i);
    }
  }
  function finish() {
    dragPreview.style.height = '0px';
    editor.commands.reorderRows({ start: i, end: i }, dropIndex);
    window.removeEventListener('mouseup', finish);
    window.removeEventListener('mousemove', move);
  }

  window.addEventListener('mouseup', finish);
  window.addEventListener('mousemove', move);
}
