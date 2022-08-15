import { selectionCell, isInTable, CellSelection } from 'prosemirror-tables';

// :: (string, any) → (EditorState, dispatch: ?(tr: Transaction)) → bool
// Returns a command that sets the given attribute to the given value,
// and is only available when the currently selected cell doesn't
// already have that attribute set to that value.
export function setCellAttr(name, value) {
  return function (state, dispatch) {
    if (!isInTable(state)) return false;
    const $cell = selectionCell(state);
    if ($cell?.nodeAfter?.attrs[name] === value) return false;
    if (dispatch) {
      const tr = state.tr;
      if (state.selection instanceof CellSelection)
        state.selection.forEachCell((node, pos) => {
          if (node.attrs[name] !== value)
            tr.setNodeMarkup(pos, null, setAttr(node.attrs, name, value));
        });
      else tr.setNodeMarkup($cell?.pos, null, setAttr($cell?.nodeAfter?.attrs, name, value));
      dispatch(tr);
    }
    return true;
  };
}

function setAttr(attrs, name, value) {
  const result = {};
  // eslint-disable-next-line guard-for-in, fp/no-loops
  for (const prop in attrs) result[prop] = attrs[prop];
  result[name] = { ...(attrs[name] || {}), ...value };
  return result;
}
