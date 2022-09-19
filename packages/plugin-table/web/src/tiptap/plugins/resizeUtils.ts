/* eslint-disable fp/no-loops */
import { TableMap, cellAround } from 'prosemirror-tables';

export function updateHandle(view, value, key) {
  view.dispatch(view.state.tr.setMeta(key, { setHandle: value }));
}

export function resetHandle(view, key) {
  const pluginState = key.getState(view.state);
  if (pluginState.activeHandle > -1 && !pluginState.dragging) updateHandle(view, -1, key);
}

export function domCellAround(target) {
  // eslint-disable-next-line fp/no-loops
  while (target && target.nodeName !== 'TD' && target.nodeName !== 'TH')
    // eslint-disable-next-line no-param-reassign
    target = target.classList.contains('ProseMirror') ? null : target.parentNode;
  return target;
}

export function edgeCell(view, event, side, isVertical = false) {
  const found = view.posAtCoords({ left: event.clientX, top: event.clientY });
  if (!found) return -1;
  const { inside } = found;
  const $cell = cellAround(view.state.doc.resolve(inside + 1));
  if (!$cell) return -1;
  const direction = isVertical ? 'bottom' : 'right';
  if (side === direction) return $cell.pos;
  const map = TableMap.get($cell.node(-1));
  const start = $cell.start(-1);
  const index = map.map.indexOf($cell.pos - start);
  return index % map.width === 0 ? -1 : start + map.map[index - 1];
}

export function updateColumns(node, colgroup, table, cellMinWidth, overrideCol?, overrideValue?) {
  let totalWidth = 0,
    fixedWidth = true;
  let nextDOM = colgroup.firstChild;
  const row = node.firstChild;
  for (let i = 0, col = 0; i < row.childCount; i++) {
    const { colspan, colwidth } = row.child(i).attrs;
    for (let j = 0; j < colspan; j++, col++) {
      const hasWidth = overrideCol === col ? overrideValue : colwidth && colwidth[j];
      const cssWidth = hasWidth ? hasWidth + 'px' : '';
      totalWidth += hasWidth || cellMinWidth;
      if (!hasWidth) fixedWidth = false;
      if (!nextDOM) {
        const col = document.createElement('col');
        col.style.width = cssWidth;
        colgroup.appendChild(col);
      } else {
        if (nextDOM.style.width !== cssWidth) {
          nextDOM.style.width = cssWidth;
        }
        nextDOM = nextDOM.nextSibling;
      }
    }
  }

  while (nextDOM) {
    const after = nextDOM.nextSibling;
    nextDOM.parentNode.removeChild(nextDOM);
    nextDOM = after;
  }

  if (fixedWidth) {
    table.style.width = totalWidth + 'px';
    table.style.minWidth = '';
  } else {
    table.style.width = '';
    table.style.minWidth = totalWidth + 'px';
  }
}
