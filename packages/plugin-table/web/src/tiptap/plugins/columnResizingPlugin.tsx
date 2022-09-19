/* eslint-disable fp/no-loops */
import { DecorationSet } from 'prosemirror-view';
import { findTable } from 'prosemirror-utils';
import { ResizeState } from './ResizeState';
import { columnResizeDecoration } from '../decorations';

export function columnResizingPlugin(Plugin, PluginKey, editor) {
  const key = new PluginKey('table-column-resizing');
  const plugin = new Plugin({
    key,
    state: {
      init() {
        return new ResizeState(-1, false, key);
      },
      apply(tr, prev, oldState, newState) {
        if (!findTable(newState.selection)) return prev;

        return prev.apply(tr);
      },
    },
    props: {
      decorations(state) {
        if (findTable(state.selection)) {
          return DecorationSet.create(state.doc, columnResizeDecoration(state, editor, key));
        }
      },

      nodeViews: {},
    },
  });
  return plugin;
}
