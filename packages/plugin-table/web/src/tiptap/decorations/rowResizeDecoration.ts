/* eslint-disable fp/no-loops */
import { Decoration } from 'prosemirror-view';
import styles from './controllers.scss';
import { TableQuery } from '../TableQuery';
import { domCellAround, edgeCell, updateHandle, resetHandle } from '../plugins/resizeUtils';
import { ROW_DEFAULT_HEIGHT } from '../../consts';
import { findParentNodeClosestToPos } from 'prosemirror-utils';
import { TIPTAP_TABLE_ROW_TYPE } from 'ricos-content';

const resizerHeight = 5;

export const rowResizeDecoration = (state, editor, key) => {
  const decorations: Decoration[] = [];
  const { selection } = state;
  const table = TableQuery.of(selection);
  const tableMap = table.map;

  for (let i = 0; i < tableMap.height; i += 1) {
    const resizerDiv = document.createElement('div');
    resizerDiv.classList.add(styles.rowResize);
    resizerDiv.addEventListener('mousemove', e => handleMouseMove(editor.view, e, key));
    resizerDiv.addEventListener('mouseleave', () => resetHandle(editor.view, key));
    resizerDiv.addEventListener('mousedown', e => handleMouseDown(editor.view, e, editor, key));
    decorations.push(
      Decoration.widget(table.getStartPos() + tableMap.map[i * tableMap.width] + 1, resizerDiv)
    );
  }

  return decorations;
};

function handleMouseMove(view, event, key) {
  const pluginState = key.getState(view.state);

  if (!pluginState.dragging) {
    const target = domCellAround(event.target);
    let cell = -1;
    if (target) {
      const { top, bottom } = target.getBoundingClientRect();
      if (event.clientY - top <= resizerHeight) {
        cell = edgeCell(view, event, 'top', true);
      } else if (bottom - event.clientY <= resizerHeight) {
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
  if (pluginState.activeHandle === -1 || pluginState.dragging) {
    return;
  }
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
  if (rowAttrs?.height) {
    return rowAttrs.height;
  }
  const dom = view.domAtPos(cellPos);
  const node = dom.node.childNodes[dom.offset];
  const domHeight = node.offsetHeight;
  return domHeight;
}

function draggedHeight(dragging, event) {
  const offset = event.clientY - dragging.startY;
  return Math.max(ROW_DEFAULT_HEIGHT, dragging.startHeight + offset);
}

function displayRowHeight(view, cell, height, editor) {
  const row = findParentNodeClosestToPos(
    view.state.doc.resolve(cell),
    node => node.type.name === TIPTAP_TABLE_ROW_TYPE
  );
  row && editor.commands.setTableRowHeight(height, row.pos, row.node);
}
