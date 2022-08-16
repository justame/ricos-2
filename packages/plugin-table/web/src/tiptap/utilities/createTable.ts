import type { Schema, Fragment, Node as ProsemirrorNode } from 'prosemirror-model';
import { createCell } from './createCell';
import { getTableNodeTypes } from './getTableNodeTypes';

export function createTable(
  schema: Schema,
  rowsCount: number,
  colsCount: number,
  withHeaderRow: boolean,
  cellContent?: Fragment | ProsemirrorNode
): ProsemirrorNode {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const types: Record<string, any> = getTableNodeTypes(schema);
  const headerCells: ProsemirrorNode[] = [];
  const cells: ProsemirrorNode[] = [];

  // eslint-disable-next-line fp/no-loops
  for (let index = 0; index < colsCount; index += 1) {
    const cell = createCell(types.cell, cellContent);

    if (cell) {
      cells.push(cell);
    }

    if (withHeaderRow) {
      const headerCell = createCell(types.header_cell, cellContent);

      if (headerCell) {
        headerCells.push(headerCell);
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows: any[] = [];

  // eslint-disable-next-line fp/no-loops
  for (let index = 0; index < rowsCount; index += 1) {
    rows.push(types.row.createChecked(null, withHeaderRow && index === 0 ? headerCells : cells));
  }

  return types.table.createChecked(null, rows);
}
