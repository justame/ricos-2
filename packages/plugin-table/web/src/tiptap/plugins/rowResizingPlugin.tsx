import { DecorationSet } from 'prosemirror-view';
import { findTable } from 'prosemirror-utils';
import { ResizeState } from './ResizeState';
import { rowResizeDecoration } from '../decorations';

export function rowResizingPlugin(Plugin, PluginKey, editor) {
  const key = new PluginKey('table-row-resizing');
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
          return DecorationSet.create(state.doc, rowResizeDecoration(state, editor, key));
        }
      },
      nodeViews: {},
    },
  });
  return plugin;
}
