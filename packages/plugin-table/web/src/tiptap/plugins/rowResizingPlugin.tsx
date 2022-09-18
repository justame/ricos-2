import { Decoration, DecorationSet } from 'prosemirror-view';
import { findParentNodeClosestToPos, findTable } from 'prosemirror-utils';
import styles from './table.scss';
import { TIPTAP_TABLE_ROW_TYPE, TIPTAP_TABLE_CELL_TYPE } from 'ricos-content';
import { ResizeState } from './ResizeState';
import { domCellAround, edgeCell, updateHandle, resetHandle } from './resizeUtils';
import { ROW_DEFAULT_HEIGHT } from '../../consts';
import resizeStyles from '../decorations/controllers.scss';

const handleHeight = 5;
const rowMinHeight = ROW_DEFAULT_HEIGHT;

export function rowResizingPlugin(Plugin, PluginKey, editor) {
  const key = new PluginKey('table-row-resizing');
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
          findTable(view.state.selection) && handleMouseDown(view, event, editor, key);
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
      const { top, bottom } = target.getBoundingClientRect();
      if (event.clientY - top <= handleHeight) {
        cell = edgeCell(view, event, 'top', true);
      } else if (bottom - event.clientY <= handleHeight) {
        cell = edgeCell(view, event, 'bottom', true);
      }
    }

    if (cell !== pluginState.activeHandle) {
      updateHandle(view, cell, key);
    }
  }
}

function handleMouseDown(view, event, editor, key) {
  const pluginState = key.getState(view.state);
  if (pluginState.activeHandle === -1 || pluginState.dragging) return;
  const row = findParentNodeClosestToPos(
    view.state.doc.resolve(pluginState.activeHandle - 1),
    node => node.type.name === TIPTAP_TABLE_ROW_TYPE
  );

  const height = currentRowHeight(view, pluginState.activeHandle, row?.node?.attrs);
  view.dispatch(
    view.state.tr.setMeta(key, {
      setDragging: { startY: event.clientY, startHeight: height },
    })
  );

  function finish(event) {
    window.removeEventListener('mouseup', finish);
    window.removeEventListener('mousemove', move);
    const pluginState = key.getState(view.state);
    if (pluginState.dragging) {
      view.dispatch(view.state.tr.setMeta(key, { setDragging: null }));
    }
  }
  function move(event) {
    if (!event.which) return finish(event);
    const pluginState = key.getState(view.state);
    const dragged = draggedHeight(pluginState.dragging, event);
    displayRowHeight(view, pluginState.activeHandle, dragged, editor);
  }

  window.addEventListener('mouseup', finish);
  window.addEventListener('mousemove', move);
  event.preventDefault();
  return true;
}

function currentRowHeight(view, cellPos, rowAttrs) {
  if (rowAttrs?.height) return rowAttrs.height;
  const dom = view.domAtPos(cellPos);
  const node = dom.node.childNodes[dom.offset];
  const domHeight = node.offsetHeight;
  return domHeight;
}

function draggedHeight(dragging, event) {
  const offset = event.clientY - dragging.startY;
  return Math.max(rowMinHeight, dragging.startHeight + offset);
}

function displayRowHeight(view, cell, height, editor) {
  const row = findParentNodeClosestToPos(
    view.state.doc.resolve(cell),
    node => node.type.name === TIPTAP_TABLE_ROW_TYPE
  );
  row && editor.commands.setTableRowHeight(height, row.pos, row.node);
}

function handleDecorations(state, cell) {
  const decorations: Decoration[] = [];
  const $cell = state.doc.resolve(cell);
  $cell.parent.descendants((child, pos) => {
    if (child.type.name === TIPTAP_TABLE_CELL_TYPE) {
      const dom = document.createElement('div');
      dom.className = styles[resizeStyles.rowResize];
      decorations.push(Decoration.widget(cell + pos + 1, dom));
    }
  });
  return DecorationSet.create(state.doc, decorations);
}
