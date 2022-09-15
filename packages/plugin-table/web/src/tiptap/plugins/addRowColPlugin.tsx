import { findTable } from 'prosemirror-utils';
import { addColDecoration, addRowDecoration } from '../decorations';
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
        const newParentTable = findTable(newState.selection);
        const oldParentTable = findTable(oldState.selection);

        if (!newParentTable) {
          return {};
        }
        if (oldParentTable?.start === newParentTable.start) {
          return prev;
        }
        const decorations = DecorationSet.create(newState.doc, [
          addRowDecoration(newState, editor),
          addColDecoration(newState, editor),
        ]);
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
