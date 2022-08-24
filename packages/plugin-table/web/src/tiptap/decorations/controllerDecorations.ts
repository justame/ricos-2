/* eslint-disable fp/no-loops */
import { findTable, getCellsInColumn, getCellsInRow } from 'prosemirror-utils';
import { isColumnSelected, isRowSelected, isTableSelected } from '../utilities/is-selected';
import { TableMap, CellSelection } from 'prosemirror-tables';
import { Decoration } from 'prosemirror-view';
import styles from './controllers.scss';

export const controllerDecorations = (newState, editor) => {
  const decorations: Decoration[] = [];
  const { selection } = newState;
  const parentTable = findTable(selection);
  if (!parentTable) return [];
  const parentStart = parentTable.start;

  const tableMap = TableMap.get(parentTable.node);
  for (let i = 0; i < tableMap.width; i += 1) {
    const div = document.createElement('div');
    div.classList.add(styles.colController);
    div.addEventListener('mousedown', e => handleColControllerClick(i, e, editor, tableMap));

    const resizerDiv = document.createElement('div');
    resizerDiv.classList.add(styles.colResize);

    if (isColumnSelected(i)(selection)) div.classList.add(styles.selected);
    if (i === tableMap.width - 1) div.classList.add(styles.last);
    decorations.push(Decoration.widget(parentStart + tableMap.map[i] + 1, div));
    decorations.push(Decoration.widget(parentStart + tableMap.map[i] + 1, resizerDiv));
  }

  for (let i = 0; i < tableMap.height; i += 1) {
    const div = document.createElement('div');
    div.classList.add(styles.rowController);
    div.addEventListener('mousedown', e => handleRowControllerClick(i, e, editor, tableMap));

    const resizerDiv = document.createElement('div');
    resizerDiv.classList.add(styles.rowResize);

    if (isRowSelected(i)(selection)) div.classList.add(styles.selected);
    if (i === tableMap.height - 1) div.classList.add(styles.last);
    decorations.push(Decoration.widget(parentStart + tableMap.map[i * tableMap.width] + 1, div));
    decorations.push(
      Decoration.widget(parentStart + tableMap.map[i * tableMap.width] + 1, resizerDiv)
    );
  }

  const div = document.createElement('div');
  div.classList.add(styles.tableController);
  div.addEventListener('mousedown', e => handleSelectTableClick(e, editor));
  if (isTableSelected(selection)) div.classList.add(styles.selected);

  decorations.push(Decoration.widget(parentStart + tableMap.map[0] + 1, div));

  return decorations;
};

function move(event) {
  if (!event.which) return finish(event);
  // let pluginState = pluginKey.getState(view.state);
  const dragged = draggedDiff(event.target.left, event);
  const dragPreview = document.getElementsByClassName('table-drag-preview')[0] as HTMLElement;
  dragPreview.style.height = '100%';
  dragPreview.style.width = event.target.width + 'px';

  dragPreview.style.left = dragged + 'px';

  // dragPreview.style.left = dragged + 'px';
}

function finish(event) {
  const dragPreview = document.getElementsByClassName('table-drag-preview')[0] as HTMLElement;
  dragPreview.style.height = '0px';
  dragPreview.style.width = '0px';

  document.removeEventListener('mouseup', finish);
  document.removeEventListener('mousemove', move);
  // let pluginState = pluginKey.getState(view.state);
  // if (pluginState.dragging) {
  //   updateColumnWidth(
  //     view,
  //     pluginState.activeHandle,
  //     draggedWidth(pluginState.dragging, event)
  //   );
  //   view.dispatch(view.state.tr.setMeta(pluginKey, { setDragging: null }));
  // }
}

function draggedDiff(startX, event) {
  return event.clientX - startX;
}

function handleColControllerClick(i, event, editor, map) {
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
}

function handleRowControllerClick(i, event, editor, map) {
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
    const $anchor = doc.resolve(getCellsInRow(i)(selection)?.[map.width - 1].pos);

    const rowsSelection = new CellSelection($anchor, $head);
    if (!selection.eq(rowsSelection)) {
      editor.view.dispatch(tr.setSelection(rowsSelection));
    }
  } else editor.commands.selectRowAtIndex(i);
}

function handleSelectTableClick(event, editor) {
  event.stopPropagation();
  event.preventDefault();
  editor.commands.selectWholeTable();
}
