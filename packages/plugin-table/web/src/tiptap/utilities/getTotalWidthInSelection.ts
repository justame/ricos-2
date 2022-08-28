import { selectedRect } from 'prosemirror-tables';
import { getRowsAndColsInSelection } from './getRowsAndColsInSelection';
import type { EditorView } from 'prosemirror-view';

export const getTotalWidthInSelection = (view: EditorView) => {
  const { state } = view;
  const rect = selectedRect(state);
  const { cols } = getRowsAndColsInSelection(state);
  let totalWidth = 0;
  const dom = view.domAtPos(rect.tableStart - 1);
  const tableNode = dom.node.childNodes[dom.offset].firstChild;
  if (tableNode) {
    const colsgroup = tableNode.firstChild;
    Array.from(colsgroup?.childNodes || []).forEach(
      (col: HTMLElement, index) => cols.includes(index) && (totalWidth += col.offsetWidth)
    );
  }
  return totalWidth;
};
