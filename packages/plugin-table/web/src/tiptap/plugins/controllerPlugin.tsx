import { findTable } from 'prosemirror-utils';
import { controllerDecorations } from '../decorations';
import { DecorationSet } from 'prosemirror-view';

export const controllerPlugin = (Plugin, PluginKey, editor) => {
  const key = new PluginKey('cell-states');
  return new Plugin({
    key,
    props: {
      decorations(state) {
        const selectedTable = findTable(state.selection);
        if (selectedTable) {
          return DecorationSet.create(state.doc, controllerDecorations(state, editor));
        }
      },
    },
  });
};
