/* eslint-disable fp/no-loops */
import { getCellsInColumn } from 'prosemirror-utils';
import { isColumnSelected, isTableSelected } from '../utilities/is-selected';
import { TableMap, CellSelection } from 'prosemirror-tables';
import { Decoration } from 'prosemirror-view';
import styles from './controllers.scss';
import { dragAndDropSvg } from './svgs';
import {
  getDragPreviewElement,
  updateColumnDragPreview,
  calculateColumnDropIndex,
  getTableColumnWidth,
} from '../plugins/dragPreviewUtils';

export const columnControllerDecoration = (newState, editor, parentTable) => {
  const decorations: Decoration[] = [];
  const { selection } = newState;
  const parentStart = parentTable.start;

  const isAllCellsSelected = isTableSelected(selection);

  const tableMap = TableMap.get(parentTable.node);
  for (let i = 0; i < tableMap.width; i += 1) {
    const div = document.createElement('div');
    div.classList.add(styles.colController);
    div.innerHTML = dragAndDropSvg;
    div.onmousedown = e => handleColControllerMouseDown(i, e, editor, tableMap, parentTable);

    const resizerDiv = document.createElement('div');
    resizerDiv.classList.add(styles.colResize);

    if (isAllCellsSelected) {
      div.classList.add(styles.allCellsSelected);
    } else if (isColumnSelected(i)(selection)) {
      div.classList.add(styles.selected);
    }
    if (i === tableMap.width - 1) {
      div.classList.add(styles.last);
    }
    decorations.push(Decoration.widget(parentStart + tableMap.map[i] + 1, div));
    decorations.push(Decoration.widget(parentStart + tableMap.map[i] + 1, resizerDiv));
  }
  return decorations;
};

function handleColControllerMouseDown(i, event, editor, map, parentTable) {
  event.stopPropagation();
  event.preventDefault();
  const { selection, doc, tr } = editor.state;
  if (selection.isColSelection?.() && event.shiftKey) {
    // Adding to an existing cols selection
    const { $anchorCell, $headCell } = selection;
    const $head = $anchorCell.pos > $headCell.pos ? $headCell : $anchorCell;

    if (!$head) {
      return;
    }
    const $anchor = doc.resolve(getCellsInColumn(i)(selection)?.[map.height - 1].pos);
    const colsSelection = new CellSelection($anchor, $head);
    if (!selection.eq(colsSelection)) {
      editor.view.dispatch(tr.setSelection(colsSelection));
    }
  } else editor.commands.selectColumnAtIndex(i);

  const dom = editor.view.domAtPos(parentTable.start);

  const dragPreview = getDragPreviewElement(editor, parentTable.start);
  const colsWidth = getTableColumnWidth(editor, parentTable.start);
  const startLeft = colsWidth.slice(0, i).reduce((curr, width) => curr + width, 0);
  const startX = event.clientX;
  const totalWidth = dom.node.offsetWidth;
  const dragPreviewWidth = colsWidth[i];
  let dropIndex = i;

  function move(event) {
    if (dragPreview) {
      const dragging = event.clientX;
      const left = Math.min(startLeft + dragging - startX, totalWidth - dragPreviewWidth + 20);
      dropIndex = calculateColumnDropIndex(colsWidth, left, dragPreviewWidth);
      updateColumnDragPreview(dragPreview, left, dragPreviewWidth);
    }
  }

  function finish() {
    dragPreview.style.height = '0px';
    editor.commands.reorderColumns({ start: i, end: i }, dropIndex);
    window.removeEventListener('mouseup', finish);
    window.removeEventListener('mousemove', move);
  }

  window.addEventListener('mouseup', finish);
  window.addEventListener('mousemove', move);
}
