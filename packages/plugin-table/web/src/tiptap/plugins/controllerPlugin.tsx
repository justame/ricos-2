import { findTable } from 'prosemirror-utils';
import {
  rowControllerDecorations,
  columnControllerDecoration,
  tableControllerDecorations,
} from '../decorations';
import { DecorationSet } from 'prosemirror-view';

export const controllerPlugin = (Plugin, PluginKey, editor) => {
  const key = new PluginKey('cell-states');
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
        if (prev.selection === newState.selection) {
          return prev;
        }
        const decorations = DecorationSet.create(newState.doc, [
          ...tableControllerDecorations(newState, editor, parentTable),
          ...columnControllerDecoration(newState, editor, parentTable),
          ...rowControllerDecorations(newState, editor, parentTable),
        ]);
        return { selection: newState.selection, decorations };
      },
    },
    props: {
      decorations(state) {
        return key.getState(state).decorations;
      },
    },
  });
};
