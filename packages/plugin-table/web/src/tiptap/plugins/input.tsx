/* eslint-disable fp/no-loops */
/* eslint-disable @typescript-eslint/no-explicit-any */
// This file defines a number of helpers for wiring up user input to
// table-related functionality.
import { Fragment } from 'prosemirror-model';
import type { ResolvedPos } from 'prosemirror-model';

import {
  TableMap,
  cellAround,
  inSameTable,
  isInTable,
  selectionCell,
  CellSelection,
  tableNodeTypes,
} from 'prosemirror-tables';
import { pastedCells, clipCells, insertCells } from '../utilities/copypaste'; //CAN TAKE FROM RPOSE!!
import { Transform } from 'prosemirror-transform';
import { isCellSelection } from 'prosemirror-utils';
import { tableEditingKey as key, cellStatesPluginKey } from './pluginsKeys';

export function handlePaste(view, _, slice) {
  if (!isInTable(view.state)) return false;
  let cells = pastedCells(slice);
  const sel = view.state.selection;
  if (isCellSelection(sel)) {
    if (!cells)
      cells = {
        width: 1,
        height: 1,
        rows: [Fragment.from(fitSlice(tableNodeTypes(view.state.schema).cell, slice))],
      };
    const table = sel.$anchorCell.node(-1);
    const start = sel.$anchorCell.start(-1);
    const rect = TableMap.get(table).rectBetween(
      sel.$anchorCell.pos - start,
      sel.$headCell.pos - start
    );
    cells = clipCells(cells, rect.right - rect.left, rect.bottom - rect.top);
    insertCells(view.state, view.dispatch, start, rect, cells);
    return true;
  } else if (cells) {
    const $cell = selectionCell(view.state);
    if ($cell) {
      const start = $cell.start(-1);
      insertCells(
        view.state,
        view.dispatch,
        start,
        TableMap.get($cell.node(-1)).findCell($cell.pos - start),
        cells
      );
      return true;
    }
  }
  return false;
}

export function handleMouseDown(view, startEvent, editor) {
  if (startEvent.ctrlKey || startEvent.metaKey) return;

  const startDOMCell = domInCell(view, startEvent.target);
  let $anchor;

  if (startEvent.shiftKey && isCellSelection(view.state.selection)) {
    // Adding to an existing cell selection
    setCellSelection(view.state.selection.$anchorCell, startEvent);
    startEvent.preventDefault();
  } else if (
    startEvent.shiftKey &&
    startDOMCell &&
    ($anchor = cellAround(view.state.selection.$anchor)) !== null &&
    cellUnderMouse(view, startEvent)?.pos !== $anchor.pos
  ) {
    // Adding to a selection that starts in another cell (causing a
    // cell selection to be created).
    setCellSelection($anchor, startEvent);
    startEvent.preventDefault();

    //should set cell selection
    // eslint-disable-next-line brace-style
  } else if (!startDOMCell) {
    // Not in a cell, let the default behavior happen.
    return;
  }

  // Create and dispatch a cell selection between the given anchor and
  // the position under the mouse.
  function setCellSelection($anchor, event) {
    let $head = cellUnderMouse(view, event);
    const starting = key.getState(view.state) === null || key.getState(view.state) === undefined;
    if (!$head || !inSameTable($anchor, $head)) {
      if (starting) $head = $anchor;
      else return;
    }
    const selection = new CellSelection($anchor, $head as ResolvedPos);
    if (starting || !view.state.selection.eq(selection)) {
      const tr = view.state.tr.setSelection(selection);
      if (starting) tr.setMeta(key, $anchor.pos);
      view.dispatch(tr);
    }
  }

  // Stop listening to mouse motion events.
  function stop() {
    view.root.removeEventListener('mouseup', stop);
    view.root.removeEventListener('dragstart', stop);
    view.root.removeEventListener('mousemove', move);
    if (key.getState(view.state)) view.dispatch(view.state.tr.setMeta(key, -1));
  }

  function move(event) {
    const anchor = key.getState(view.state);
    let $anchor;
    if (anchor !== null) {
      // Continuing an existing cross-cell selection
      $anchor = view.state.doc.resolve(anchor);
    } else if (domInCell(view, event.target) !== startDOMCell) {
      // Moving out of the initial cell -- start a new cell selection
      $anchor = cellUnderMouse(view, startEvent);
      if (!$anchor) return stop();
    }
    if ($anchor) setCellSelection($anchor, event);
  }
  view.root.addEventListener('mouseup', stop);
  view.root.addEventListener('dragstart', e => {
    e.preventDefault();
    stop();
  });
  view.root.addEventListener('mousemove', move);
}

function domInCell(view, dom) {
  for (; dom && dom !== view.dom; dom = dom.parentNode)
    if (dom.nodeName === 'TD' || dom.nodeName === 'TH') return dom;
}

function cellUnderMouse(view, event) {
  const mousePos = view.posAtCoords({ left: event.clientX, top: event.clientY });
  if (!mousePos) return null;
  return mousePos ? cellAround(view.state.doc.resolve(mousePos.pos)) : null;
}

export function fitSlice(nodeType, slice) {
  const node = nodeType.createAndFill();
  const tr = new Transform(node).replace(0, node.content.size, slice);
  return tr.doc;
}
