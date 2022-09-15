import { handlePaste, handleMouseDown } from './input';
import { drawCellSelection, normalizeSelection } from './cellselection';
import { fixTables } from 'prosemirror-tables';
import { isCellSelection } from '../utilities/is-selection-type';

// :: () → Plugin
//
// Creates a [plugin](http://prosemirror.net/docs/ref/#state.Plugin)
// that, when added to an editor, enables cell-selection, handles
// cell-based copy/paste, and makes sure tables stay well-formed (each
// row has the same width, and cells don't overlap).
//
// You should probably put this plugin near the end of your array of
// plugins, since it handles mouse and arrow key events in tables
// rather broadly, and other plugins, like the gap cursor or the
// column-width dragging plugin, might want to get a turn first to
// perform more specific behavior.
export function tableEditingPlugin(Plugin, PluginKey, editor) {
  const key = new PluginKey('selectingCells');
  return new Plugin({
    key,

    // This piece of state is used to remember when a mouse-drag
    // cell-selection is happening, so that it can continue even as
    // transactions (which might move its anchor cell) come in.
    state: {
      init() {
        return null;
      },
      apply(tr, cur) {
        const set = tr.getMeta(key);
        if (set !== null && set !== undefined) return set === -1 ? null : set;
        if (cur === null || !tr.docChanged) return cur;
        const { deleted, pos } = tr.mapping.mapResult(cur);
        return deleted ? null : pos;
      },
    },

    props: {
      decorations: drawCellSelection,

      handleDOMEvents: {
        mousedown: (view, event) => {
          handleMouseDown(view, event, key);
          return false;
        },
      },

      createSelectionBetween(view) {
        if (key.getState(view.state) === null) return null;
        return view.state.selection;
      },

      handleKeyDown: (view, event) => {
        if (
          isCellSelection(view.state.selection) &&
          !event.shiftKey &&
          !event.metaKey &&
          !event.ctrlKey
        ) {
          // maybe chain clearCell before set editing
          editor.commands.setEditCell();
        }
        return false;
      },

      handlePaste,
    },

    appendTransaction(_, oldState, state) {
      return normalizeSelection(state, fixTables(state, oldState));
    },
  });
}
