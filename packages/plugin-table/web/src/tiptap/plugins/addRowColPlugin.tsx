import { findTable } from 'prosemirror-utils';
import { addRowColDecorations } from '../decorations';
import { DecorationSet } from 'prosemirror-view';

export const addRowColPlugin = (Plugin, PluginKey, editor) => {
  const key = new PluginKey('table-add-row-col');
  return new Plugin({
    key,
    props: {
      decorations(state) {
        const selectedTable = findTable(state.selection);
        if (selectedTable) {
          const decorations = addRowColDecorations(state, editor);
          return decorations && DecorationSet.create(state.doc, decorations);
        }
      },
    },
  });
};
