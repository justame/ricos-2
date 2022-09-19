/* eslint-disable fp/no-loops */
import { Decoration } from 'prosemirror-view';
import styles from './controllers.scss';
import { TableQuery } from '../TableQuery';
import { TIPTAP_TABLE_TYPE } from 'ricos-content';
import {
  updateColumns,
  domCellAround,
  edgeCell,
  updateHandle,
  resetHandle,
} from '../plugins/resizeUtils';
import { CELL_MANUAL_MIN_WIDTH } from '../../consts';
import { TableMap } from 'prosemirror-tables';

const handleWidth = 6;
const cellMinWidth = CELL_MANUAL_MIN_WIDTH;
const lastColumnResizable = true;

export const columnResizeDecoration = (state, editor, key) => {
  const decorations: Decoration[] = [];
  const { selection } = state;
  const table = TableQuery.of(selection);

  const tableMap = table.map;
  for (let i = 0; i < tableMap.width; i += 1) {
    const resizerDiv = document.createElement('div');
    resizerDiv.classList.add(styles.colResize);
    resizerDiv.addEventListener('mousemove', e => handleMouseMove(editor.view, e, key));
    resizerDiv.addEventListener('mouseleave', () => resetHandle(editor.view, key));
    resizerDiv.addEventListener('mousedown', e => handleMouseDown(editor.view, e, key));

    decorations.push(Decoration.widget(table.getStartPos() + tableMap.map[i] + 1, resizerDiv));
  }
  return decorations;
};

function handleMouseMove(view, event, key) {
  const pluginState = key.getState(view.state);
  if (!pluginState.dragging) {
    const target = domCellAround(event.target);
    let cell = -1;
    if (target) {
      const { left, right } = target.getBoundingClientRect();
      if (event.clientX - left <= handleWidth) {
        cell = edgeCell(view, event, 'left');
      } else if (right - event.clientX <= handleWidth) {
        cell = edgeCell(view, event, 'right');
      }
    }
    if (cell !== pluginState.activeHandle) {
      if (!lastColumnResizable && cell !== -1) {
        const $cell = view.state.doc.resolve(cell);
        const table = $cell.node(-1),
          map = TableMap.get(table),
          start = $cell.start(-1);
        const col = map.colCount($cell.pos - start) + $cell.nodeAfter.attrs.colspan - 1;

        if (col === map.width - 1) {
          return;
        }
      }
      updateHandle(view, cell, key);
    }
  }
}

function handleMouseDown(view, event, key) {
  const pluginState = key.getState(view.state);

  if (pluginState.activeHandle === -1 || pluginState.dragging) return false;
  const cell = view.state.doc.nodeAt(pluginState.activeHandle);
  const width = currentColWidth(view, pluginState.activeHandle, cell.attrs);
  view.dispatch(
    view.state.tr.setMeta(key, {
      setDragging: { startX: event.clientX, startWidth: width },
    })
  );

  function finish(event) {
    window.removeEventListener('mouseup', finish);
    window.removeEventListener('mousemove', move);
    const pluginState = key.getState(view.state);
    if (pluginState.dragging) {
      updateColumnWidth(view, pluginState.activeHandle, draggedWidth(pluginState.dragging, event));
      view.dispatch(view.state.tr.setMeta(key, { setDragging: null }));
    }
  }
  function move(event) {
    if (!event.which) return finish(event);
    const pluginState = key.getState(view.state);
    const dragged = draggedWidth(pluginState.dragging, event);
    displayColumnWidth(view, pluginState.activeHandle, dragged);
  }

  window.addEventListener('mouseup', finish);
  window.addEventListener('mousemove', move);
  event.preventDefault();
  return true;
}

function currentColWidth(view, cellPos, { colspan, colwidth }) {
  const width = colwidth && colwidth[colwidth.length - 1];
  if (width) return width;
  const dom = view.domAtPos(cellPos);
  const node = dom.node.childNodes[dom.offset];
  let domWidth = node.offsetWidth,
    parts = colspan;
  if (colwidth)
    for (let i = 0; i < colspan; i++)
      if (colwidth[i]) {
        domWidth -= colwidth[i];
        parts--;
      }
  return domWidth / parts;
}

function draggedWidth(dragging, event) {
  const offset = event.clientX - dragging.startX;
  return Math.max(cellMinWidth, dragging.startWidth + offset);
}

function updateColumnWidth(view, cell, width) {
  const $cell = view.state.doc.resolve(cell);
  const table = $cell.node(-1);
  const map = TableMap.get(table);
  const start = $cell.start(-1);
  const col = map.colCount($cell.pos - start) + $cell.nodeAfter.attrs.colspan - 1;
  const tr = view.state.tr;
  for (let row = 0; row < map.height; row++) {
    const mapIndex = row * map.width + col;
    // Rowspanning cell that has already been handled
    if (row && map.map[mapIndex] === map.map[mapIndex - map.width]) continue;
    const pos = map.map[mapIndex];
    const { attrs } = table.nodeAt(pos);
    const index = attrs.colspan === 1 ? 0 : col - map.colCount(pos);
    if (attrs.colwidth && attrs.colwidth[index] === width) continue;
    const colwidth = attrs.colwidth ? attrs.colwidth.slice() : zeroes(attrs.colspan);
    colwidth[index] = width;
    tr.setNodeMarkup(start + pos, null, { ...attrs, colwidth });
  }
  if (tr.docChanged) view.dispatch(tr);
}

function displayColumnWidth(view, cell, width) {
  const $cell = view.state.doc.resolve(cell);
  const table = $cell.node(-1);
  const start = $cell.start(-1);
  const col = TableMap.get(table).colCount($cell.pos - start) + $cell.nodeAfter.attrs.colspan - 1;
  let dom = view.domAtPos($cell.start(-1)).node;
  while (dom.nodeName !== TIPTAP_TABLE_TYPE) {
    dom = dom.parentNode;
  }
  updateColumns(table, dom.firstChild, dom, cellMinWidth, col, width);
}

function zeroes(n) {
  const result: number[] = [];
  for (let i = 0; i < n; i++) result.push(0);
  return result;
}
