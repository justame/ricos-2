/* eslint-disable fp/no-loops */
import { Decoration, DecorationSet } from 'prosemirror-view';
import { TableMap } from 'prosemirror-tables';
import { getColsWidthRatio } from './TableView';
import { findTable } from 'prosemirror-utils';
import styles from './table.scss';
import { ResizeState } from './ResizeState';
import { TIPTAP_TABLE_TYPE } from 'ricos-content';
import { updateColumns, domCellAround, edgeCell, updateHandle, resetHandle } from './resizeUtils';
import { CELL_MANUAL_MIN_WIDTH } from '../../consts';
import resizeStyles from '../decorations/controllers.scss';

const handleWidth = 6;
const cellMinWidth = CELL_MANUAL_MIN_WIDTH;
const lastColumnResizable = true;

export function columnResizingPlugin(Plugin, PluginKey) {
  const key = new PluginKey('table-column-resizing');
  const plugin = new Plugin({
    key,
    state: {
      init() {
        return new ResizeState(-1, false, key);
      },
      apply(tr, prev, oldState, newState) {
        if (!findTable(newState.selection)) return prev;

        return prev.apply(tr);
      },
    },
    props: {
      handleDOMEvents: {
        mousemove(view, event) {
          findTable(view.state.selection) && handleMouseMove(view, event, key);
          return false;
        },
        mouseleave(view) {
          findTable(view.state.selection) && resetHandle(view, key);
          return false;
        },
        mousedown(view, event) {
          findTable(view.state.selection) && handleMouseDown(view, event, key);
          return false;
        },
      },

      decorations(state) {
        const pluginState = key.getState(state);
        if (pluginState.dragging) return handleDecorations(state, pluginState.activeHandle);
      },

      nodeViews: {},
    },
  });
  return plugin;
}

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

function handleDecorations(state, cell) {
  const decorations: Decoration[] = [];
  const $cell = state.doc.resolve(cell);
  const table = $cell.node(-1);
  const map = TableMap.get(table);
  const start = $cell.start(-1);
  const col = map.colCount($cell.pos - start) + $cell.nodeAfter.attrs.colspan;
  for (let row = 0; row < map.height; row++) {
    const index = col + row * map.width - 1;
    // For positions that are have either a different cell or the end
    // of the table to their right, and either the top of the table or
    // a different cell above them, add a decoration
    if (
      (col === map.width || map.map[index] !== map.map[index + 1]) &&
      (row === 0 || map.map[index - 1] !== map.map[index - 1 - map.width])
    ) {
      const cellPos = map.map[index];
      const pos = start + cellPos + table.nodeAt(cellPos).nodeSize - 1;
      const dom = document.createElement('div');
      dom.className = styles[resizeStyles.colResize];
      decorations.push(Decoration.widget(pos, dom));
    }
  }
  return DecorationSet.create(state.doc, decorations);
}
