import { findTable } from 'prosemirror-utils';
import { addRowColDecorations } from '../decorations';
import { DecorationSet } from 'prosemirror-view';

export const addRowColPlugin = (Plugin, PluginKey, editor) => {
  const key = new PluginKey('table-add-row-col');
  return new Plugin({
    key,
    state: {
      init: () => {
        return {};
      },
      apply(tr, prev, oldState, newState) {
        const parentTable = findTable(newState.selection);
        if (!parentTable) {
          return {};
        }
        if (findTable(oldState.selection) && parentTable) {
          return prev;
        }
        const decorations = DecorationSet.create(
          newState.doc,
          addRowColDecorations(newState, editor)
        );
        return { decorations };
      },
    },
    props: {
      decorations(state) {
        return key.getState(state).decorations;
      },
    },
  });
};
