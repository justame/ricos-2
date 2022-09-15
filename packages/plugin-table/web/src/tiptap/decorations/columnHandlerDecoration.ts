/* eslint-disable fp/no-loops */
import { getCellsInColumn } from 'prosemirror-utils';
import { CellSelection } from 'prosemirror-tables';
import { Decoration } from 'prosemirror-view';
import styles from './controllers.scss';
import { dragAndDropSvg } from './svgs';
import { updateColumnDragPreview, calculateColumnDropIndex } from '../plugins/dragPreviewUtils';
import { TableQuery } from '../TableQuery';

export const columnHandlerDecoration = (state, editor) => {
  const decorations: Decoration[] = [];
  const { selection } = state;
  const table = TableQuery.of(selection);

  const isAllCellsSelected = table.isTableSelected();

  const tableMap = table.map;
  for (let i = 0; i < tableMap.width; i += 1) {
    const div = document.createElement('div');
    div.classList.add(styles.colController);
    div.innerHTML = dragAndDropSvg;
    div.addEventListener('mousedown', e => handleColControllerMouseDown(i, e, editor, table));

    const resizerDiv = document.createElement('div');
    resizerDiv.classList.add(styles.colResize);

    if (isAllCellsSelected) {
      div.classList.add(styles.allCellsSelected);
    } else if (table.isColumnSelected(i)) {
      div.classList.add(styles.selected);
    }
    if (i === tableMap.width - 1) {
      div.classList.add(styles.last);
    }
    decorations.push(Decoration.widget(table.getStartPos() + tableMap.map[i] + 1, div));
    decorations.push(Decoration.widget(table.getStartPos() + tableMap.map[i] + 1, resizerDiv));
  }
  return decorations;
};

function handleColControllerMouseDown(i: number, event: MouseEvent, editor, table: TableQuery) {
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
    const $anchor = doc.resolve(getCellsInColumn(i)(selection)?.[table.getHeight() - 1].pos);
    const colsSelection = new CellSelection($anchor, $head);
    if (!selection.eq(colsSelection)) {
      editor.view.dispatch(tr.setSelection(colsSelection));
    }
  } else editor.commands.selectColumnAtIndex(i);

  const startPos = table.getStartPos();
  const dom = editor.view.domAtPos(startPos);

  const dragPreview = table.getDragPreviewElement(editor.view);
  const colsWidth = table.getColumnWidth(editor.view);
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
    dragPreview && (dragPreview.style.height = '0px');
    editor.commands.reorderColumns({ start: i, end: i }, dropIndex);
    window.removeEventListener('mouseup', finish);
    window.removeEventListener('mousemove', move);
  }

  window.addEventListener('mouseup', finish);
  window.addEventListener('mousemove', move);
}
