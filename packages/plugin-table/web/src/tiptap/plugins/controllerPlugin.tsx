import { Plugin } from 'prosemirror-state';
import { findTable } from 'prosemirror-utils';
import { controllerDecorations, dragDecorations } from '../decorations';
import { DecorationSet } from 'prosemirror-view';
import { TableMap } from 'prosemirror-tables';
import { tableControllersPluginKey as pluginKey } from './pluginsKeys';
import { TRANSACTION_META_KEYS } from '../consts';

export const controllerPlugin = editor =>
  new Plugin({
    key: pluginKey,

    state: {
      init: () => {
        return {};
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      apply(tr, prev: any, oldState, newState) {
        const selectedTable = findTable(newState.selection);
        if (!selectedTable) return {};

        const selectedColumn = tr.getMeta(TRANSACTION_META_KEYS.SELECT_COLUMN);
        const selectedRow = tr.getMeta(TRANSACTION_META_KEYS.SELECT_ROW);
        if (
          selectedColumn === prev.selectedColumn &&
          selectedRow === prev.selectedRow &&
          oldState.selection.ranges.length === newState.selection.ranges.length &&
          prev.selectedTable &&
          prev.selectedTable.pos === selectedTable.pos &&
          prev.selectedTable.node.nodeSize === selectedTable.node.nodeSize
        ) {
          return prev;
        }
        const controllersDecorations = controllerDecorations(newState, editor);

        const dragDecoration = dragDecorations(newState);
        if (controllersDecorations && dragDecoration) {
          return {
            decorations: DecorationSet.create(newState.doc, [
              ...controllersDecorations,
              dragDecoration,
            ]),
            selectedTable,
            selectedTableMap: selectedTable && TableMap.get(selectedTable.node),
            selectedColumn,
            selectedRow,
          };
        }
        return prev;
      },
    },

    props: {
      decorations(state) {
        const tablePluginState = state && pluginKey.getState(state);
        return tablePluginState.decorations;
      },
    },
  });
