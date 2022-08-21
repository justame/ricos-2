import { cellEditingDecorations } from '../decorations';
import { DecorationSet } from 'prosemirror-view';
import { cellAround, isInTable } from 'prosemirror-tables';
import { isCellSelection } from 'prosemirror-utils';
import { TRANSACTION_META_KEYS } from '../consts';

export const cellStatesPlugin = (Plugin, PluginKey, editor) => {
  const key = new PluginKey('cell-states');
  return new Plugin({
    key,
    state: {
      init: () => {
        return {};
      },
      apply(tr, prev, oldState, newState) {
        if (!isInTable(newState)) return {};
        if (isCellSelection(newState.selection)) return {};

        const { pos: editCell } = tr.getMeta(TRANSACTION_META_KEYS.EDITING_CELL) || {};
        const { pos: selectCell } = tr.getMeta(TRANSACTION_META_KEYS.SELECTED_CELL) || {};
        if (newState.selection.ranges.length > 1) return {};
        else if (selectCell) {
          return {
            selectCell,
          };
        } else if (editCell) {
          const editDecorations = cellEditingDecorations(editCell);
          return {
            decorations: DecorationSet.create(newState.doc, editDecorations),
            editCell,
          };
        }
        return prev;
      },
    },

    props: {
      handleClick: view => {
        const $anchor = cellAround(view.state.selection.$anchor);
        if ($anchor !== null) {
          const cellState = key.getState(view.state);
          if (cellState?.editCell?.pos === $anchor.pos) return false;
          editor.commands.setCellSelection($anchor.pos);
          return true;
        }
        return false;
      },

      handleDoubleClick: view => {
        const $anchor = cellAround(view.state.selection.$anchor);
        if ($anchor !== null) {
          editor.commands.setEditCell();
          return true;
        }
        return false;
      },

      decorations(state) {
        const tablePluginState = state && key.getState(state);
        return tablePluginState.decorations;
      },
    },
  });
};
