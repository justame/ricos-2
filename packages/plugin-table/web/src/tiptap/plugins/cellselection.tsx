/* eslint-disable fp/no-loops */
// This file defines a ProseMirror selection subclass that models
// table cell selections. The table plugin needs to be active to wire
// in the user interaction part of table selections (so that you
// actually get such selections when you select across cells).

import { TextSelection, NodeSelection } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { TableMap, CellSelection } from 'prosemirror-tables';
import { isCellSelection } from 'prosemirror-utils';
import styles from './table.scss';

export function drawCellSelection(state) {
  if (!isCellSelection(state.selection)) return null;
  const cells: Decoration[] = [];
  state.selection.forEachCell((node, pos) => {
    cells.push(Decoration.node(pos, pos + node.nodeSize, { class: styles.selectedCell }));
  });
  return DecorationSet.create(state.doc, cells);
}

function isCellBoundarySelection({ $from, $to }) {
  if ($from.pos === $to.pos || $from.pos < $from.pos - 6) return false; // Cheap elimination
  let afterFrom = $from.pos,
    beforeTo = $to.pos,
    depth = $from.depth;
  for (; depth >= 0; depth--, afterFrom++) if ($from.after(depth + 1) < $from.end(depth)) break;
  for (let d = $to.depth; d >= 0; d--, beforeTo--) if ($to.before(d + 1) > $to.start(d)) break;
  return afterFrom === beforeTo && /row|table/.test($from.node(depth).type.spec.tableRole);
}

function isTextSelectionAcrossCells({ $from, $to }) {
  let fromCellBoundaryNode;
  let toCellBoundaryNode;

  for (let i = $from.depth; i > 0; i--) {
    const node = $from.node(i);
    if (node.type.spec.tableRole === 'cell' || node.type.spec.tableRole === 'header_cell') {
      fromCellBoundaryNode = node;
      break;
    }
  }

  for (let i = $to.depth; i > 0; i--) {
    const node = $to.node(i);
    if (node.type.spec.tableRole === 'cell' || node.type.spec.tableRole === 'header_cell') {
      toCellBoundaryNode = node;
      break;
    }
  }

  return fromCellBoundaryNode !== toCellBoundaryNode && $to.parentOffset === 0;
}

export function normalizeSelection(state, tr, allowTableNodeSelection = false) {
  const sel = (tr || state).selection;
  const doc = (tr || state).doc;
  let normalize, role;
  if (sel instanceof NodeSelection && (role = sel.node.type.spec.tableRole)) {
    if (role === 'cell' || role === 'header_cell') {
      normalize = CellSelection.create(doc, sel.from);
    } else if (role === 'row') {
      const $cell = doc.resolve(sel.from + 1);
      normalize = CellSelection.rowSelection($cell, $cell);
    } else if (!allowTableNodeSelection) {
      const map = TableMap.get(sel.node);
      const start = sel.from + 1;
      const lastCell = start + map.map[map.width * map.height - 1];
      normalize = CellSelection.create(doc, start + 1, lastCell);
    }
  } else if (sel instanceof TextSelection && isCellBoundarySelection(sel)) {
    normalize = TextSelection.create(doc, sel.from);
  } else if (sel instanceof TextSelection && isTextSelectionAcrossCells(sel)) {
    normalize = TextSelection.create(doc, sel.$from.start(), sel.$from.end());
  }
  if (normalize) {
    (tr || (tr = state.tr)).setSelection(normalize);
  }
  return tr;
}
