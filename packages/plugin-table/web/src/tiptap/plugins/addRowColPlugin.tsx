import { findTable } from 'prosemirror-utils';
import { addRowColDecorations } from '../decorations';
import { DecorationSet } from 'prosemirror-view';
import { TableMap } from 'prosemirror-tables';

export const addRowColPlugin = (Plugin, PluginKey, editor) => {
  const key = new PluginKey('table-add-row-col');
  return new Plugin({
    key,

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
        const tablePluginState = state && key.getState(state);
        return tablePluginState.decorations;
      },
    },
  });
};
