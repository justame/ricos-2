import { selectedRect } from 'prosemirror-tables';

export const getRowsAndColsInSelection = state => {
  const rect = selectedRect(state);
  const rows: number[] = [];
  const cols: number[] = [];

  state.selection.forEachCell?.((node, pos) => {
    const cell = rect.map.findCell(pos - rect.tableStart);
    !rows.includes(cell.top) && rows.push(cell.top);
    !cols.includes(cell.left) && cols.push(cell.left);
  });

  return { rows, cols };
};
