import { findTable } from 'prosemirror-utils';
import {
  rowHandlerDecoration,
  columnHandlerDecoration,
  tableHandlerDecoration,
  dragPreviewDecoration,
} from '../decorations';
import { DecorationSet } from 'prosemirror-view';

export const handlersPlugin = (Plugin, PluginKey, editor) => {
  const key = new PluginKey('table-handlers-plugin');
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
          ...dragPreviewDecoration(newState),
          ...tableHandlerDecoration(newState, editor),
          ...columnHandlerDecoration(newState, editor),
          ...rowHandlerDecoration(newState, editor),
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
