import { TextSelection } from 'prosemirror-state';
import {
  nextCell,
  CellSelection,
  addColumnAfter,
  deleteColumn,
  cellAround,
} from 'prosemirror-tables';
import { findParentNodeOfType, isCellSelection, findTable } from 'prosemirror-utils';
import { TIPTAP_TABLE_TYPE, TIPTAP_TABLE_CELL_TYPE } from 'wix-rich-content-common';

export const keyboardShortcuts = {
  Enter: maybeToggleEditMode,

  ArrowLeft: arrow('horiz', -1),
  ArrowRight: arrow('horiz', 1),
  ArrowUp: arrow('vert', -1),
  ArrowDown: arrow('vert', 1),

  'Shift-ArrowLeft': shiftArrow('horiz', -1),
  'Shift-ArrowRight': shiftArrow('horiz', 1),
  'Shift-ArrowUp': shiftArrow('vert', -1),
  'Shift-ArrowDown': shiftArrow('vert', 1),

  'Mod-a': handleSelectAll,

  Tab: handleTab('horiz', 1),
  'Shift-Tab': handleTab('horiz', -1),

  'Alt-Ctrl-+': ({ editor: { state, view } }) => addColumnAfter(state, view.dispatch),
  'Alt-Ctrl-=': ({ editor: { state, view } }) => addColumnAfter(state, view.dispatch),
  'Alt-Ctrl--': ({ editor: { state, view } }) => deleteColumn(state, view.dispatch),

  'Shift-Space': selectRowRange,
  'Ctrl-Space': selectColRange,

  Backspace: handleDelete,
  'Mod-Backspace': handleDelete,
  Delete: handleDelete,
  'Mod-Delete': handleDelete,
};

// const key = new PluginKey('selectingCells');

function maybeSetSelection(state, dispatch, selection) {
  if (selection.eq(state.selection)) return false;
  if (dispatch) dispatch(state.tr.setSelection(selection).scrollIntoView());
  return true;
}

function arrow(axis, dir) {
  return ({ editor: { state, view } }) => {
    const sel = state.selection;
    if (isCellSelection(sel)) {
      const $head = nextCell(sel.$headCell, axis, dir);

      if ($head) {
        return maybeSetSelection(state, view.dispatch, new CellSelection($head));
      } else return true;
    } else {
      const end = atEndOfCell(view, axis, dir);
      if (end === null) return false;
      else return true;
    }
  };
}

function handleTab(axis, dir) {
  return ({ editor: { state, view } }) => {
    const sel = state.selection;
    const currentCell = cellAround(sel.$head);
    const $head = currentCell && nextCell(currentCell, axis, dir);
    if ($head) {
      return maybeSetSelection(state, view.dispatch, new CellSelection($head));
    } else return false;
  };
}

function shiftArrow(axis, dir) {
  return ({ editor: { state, view } }) => {
    let sel = state.selection;
    if (!isCellSelection(sel)) {
      const end = atEndOfCell(view, axis, dir);
      if (end === null) return false;
      sel = new CellSelection(state.doc.resolve(end));
    }
    const $head = nextCell(sel.$headCell, axis, dir);
    if (!$head) return false;
    return maybeSetSelection(state, view.dispatch, new CellSelection(sel.$anchorCell, $head));
  };
}

function maybeToggleEditMode({ editor }) {
  const sel = editor.state.selection;
  if (isCellSelection(sel)) {
    if (sel.ranges.length === 1) {
      editor.commands.setEditCell();
    }
    return true;
  } else {
    const $cell = findParentNodeOfType(editor.state.schema.nodes.TABLE_CELL)(
      editor.state.selection
    );
    if ($cell) {
      editor.commands.setCellSelection($cell.pos);
      return true;
    }
  }
}

function handleSelectAll({ editor }) {
  if (isCellSelection(editor.state.selection)) {
    editor.commands.selectWholeTable();
    return true;
  }
  const $cell = findParentNodeOfType(editor.state.schema.nodes.TABLE_CELL)(editor.state.selection);
  if ($cell) {
    editor.commands.setTextSelection({
      from: $cell.pos + 1,
      to: $cell.pos + $cell.node.nodeSize - 1,
    });
    return true;
  }
  return false;
}

function selectRowRange({ editor }) {
  if (isCellSelection(editor.state.selection)) {
    const selection = CellSelection.rowSelection(
      editor.state.selection.$headCell,
      editor.state.selection.$anchorCell
    );
    editor.view.dispatch(editor.state.tr.setSelection(selection));
    return true;
  }
  return false;
}

function selectColRange({ editor }) {
  if (isCellSelection(editor.state.selection)) {
    const selection = CellSelection.colSelection(
      editor.state.selection.$anchorCell,
      editor.state.selection.$headCell
    );
    editor.view.dispatch(editor.state.tr.setSelection(selection));
    return true;
  }
  return false;
}

// Check whether the cursor is at the end of a cell
function atEndOfCell(view, axis, dir) {
  if (!(view.state.selection instanceof TextSelection)) return null;
  const { $head } = view.state.selection;
  // eslint-disable-next-line fp/no-loops
  for (let d = $head.depth - 1; d >= 0; d--) {
    const parent = $head.node(d),
      index = dir < 0 ? $head.index(d) : $head.indexAfter(d);
    if (index !== (dir < 0 ? 0 : parent.childCount)) return null;
    if (parent.type.spec.tableRole === 'cell' || parent.type.spec.tableRole === 'header_cell') {
      const cellPos = $head.before(d);
      const dirStr = axis === 'vert' ? (dir > 0 ? 'down' : 'up') : dir > 0 ? 'right' : 'left';
      return view.endOfTextblock(dirStr) ? cellPos : null;
    }
  }
  return null;
}

function handleDelete({ editor }) {
  const { selection } = editor.state;

  if (!isCellSelection(selection)) {
    return false;
  }

  let cellCount = 0;
  const table = findTable(selection);

  table?.node.descendants(node => {
    if (node.type.name === TIPTAP_TABLE_TYPE) {
      return false;
    }

    if ([TIPTAP_TABLE_CELL_TYPE, 'tableHeader'].includes(node.type.name)) {
      cellCount += 1;
    }
  });

  const allCellsSelected = cellCount === selection.ranges.length;

  allCellsSelected ? editor.commands.deleteTable() : editor.commands.clearCell();

  return true;
}
