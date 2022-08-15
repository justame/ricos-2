import { Plugin } from 'prosemirror-state';
import { findTable } from 'prosemirror-utils';
import { addRowColDecorations } from '../decorations';
import { DecorationSet } from 'prosemirror-view';
import { TableMap } from 'prosemirror-tables';
import { tableAddRowColPluginKey as pluginKey } from './pluginsKeys';

export const addRowColPlugin = editor =>
  new Plugin({
    key: pluginKey,

    state: {
      init: () => {
        return {};
      },
      apply(tr, prev, oldState, newState) {
        const selectedTable = findTable(newState.selection);
        if (!selectedTable) return {};

        const map = TableMap.get(selectedTable.node);
        const decorations = addRowColDecorations(newState, editor);

        if (decorations?.length) {
          return {
            decorations: DecorationSet.create(newState.doc, decorations),
            selectedTable,
            selectedTableMap: selectedTable && map,
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
