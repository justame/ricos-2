import type { CellSelectionShape } from './utilities/is-selection-type';
import { findTable } from 'prosemirror-utils';
import type { ContentNodeWithPos } from 'prosemirror-utils';
import { TableMap } from 'prosemirror-tables';
import type { EditorView } from 'prosemirror-view';
import type { Rect } from 'prosemirror-tables';
import { isCellSelection } from './utilities/is-selection-type';
import type { Selection } from 'prosemirror-state';

export class TableQuery {
  selection: Selection;

  table: ContentNodeWithPos;

  map: TableMap;

  static of(selection: Selection): TableQuery {
    return new TableQuery(selection);
  }

  private constructor(selection: Selection) {
    this.selection = selection;
    this.table = findTable(selection) as ContentNodeWithPos;
    this.map = TableMap.get(this.table.node);
  }

  getStartPos() {
    return this.table.start;
  }

  getHeight() {
    return this.map.height;
  }

  getWidth() {
    return this.map.width;
  }

  getMap() {
    return this.map.map;
  }

  getNode() {
    return this.table.node;
  }

  getRowsIndexesInSelection() {
    const rows: number[] = [];
    if (isCellSelection(this.selection)) {
      (this.selection as CellSelectionShape).forEachCell?.((node, pos) => {
        const cell = this.map.findCell(pos - this.getStartPos());
        !rows.includes(cell.top) && rows.push(cell.top);
      });
    }
    return rows;
  }

  getColsIndexesInSelection() {
    const cols: number[] = [];
    if (isCellSelection(this.selection)) {
      (this.selection as CellSelectionShape).forEachCell?.((node, pos) => {
        const cell = this.map.findCell(pos - this.getStartPos());
        !cols.includes(cell.left) && cols.push(cell.left);
      });
    }
    return cols;
  }

  getDomWidthInSelection(view: EditorView) {
    const cols = this.getColsIndexesInSelection();
    let totalWidth = 0;
    const dom = view.domAtPos(this.getStartPos() - 1);
    const tableNode = dom.node.childNodes[dom.offset].firstChild;
    if (tableNode) {
      const colsgroup = tableNode.firstChild;
      Array.from(colsgroup?.childNodes || []).forEach(
        (col: HTMLElement, index) => cols.includes(index) && (totalWidth += col.offsetWidth)
      );
    }
    return totalWidth;
  }

  getCellNeighbors(cellPos: number): {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
  } {
    const cellRelativePos = cellPos - this.getStartPos();
    const map = this.getMap();
    const cellIndex = map.indexOf(cellRelativePos);
    const width = this.getWidth();
    const height = this.getHeight();
    const neighbors: { left?; right?; top?; bottom? } = {};
    cellIndex % width !== 0 && (neighbors.left = map[cellIndex - 1]);
    cellIndex + (1 % width) !== 0 && (neighbors.right = map[cellIndex + 1]);
    cellIndex >= width && (neighbors.top = map[cellIndex - width]);
    cellIndex < height * width - width && (neighbors.bottom = map[cellIndex + width]);
    return neighbors;
  }

  private isRectSelected(rect: Rect) {
    const map = this.map;
    const start = this.getStartPos();
    const cells = map.cellsInRect(rect);
    if (isCellSelection(this.selection)) {
      const selectedCells = map.cellsInRect(
        map.rectBetween(
          (this.selection as CellSelectionShape).$anchorCell.pos - start,
          (this.selection as CellSelectionShape).$headCell.pos - start
        )
      );
      // eslint-disable-next-line fp/no-loops
      for (let i = 0, count = cells.length; i < count; i++) {
        if (selectedCells.indexOf(cells[i]) === -1) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  isColumnSelected(columnIndex: number) {
    const map = this.map;
    return this.isRectSelected({
      left: columnIndex,
      right: columnIndex + 1,
      top: 0,
      bottom: map.height,
    });
  }

  isRowSelected(rowIndex: number) {
    const map = this.map;
    return this.isRectSelected({
      left: 0,
      right: map.width,
      top: rowIndex,
      bottom: rowIndex + 1,
    });
  }

  isTableSelected() {
    const map = this.map;
    return this.isRectSelected({
      left: 0,
      right: map.width,
      top: 0,
      bottom: map.height,
    });
  }

  // TODO: query element by id
  getDragPreviewElement(view: EditorView): HTMLElement {
    const dom = view.domAtPos(this.getStartPos());
    return dom.node.childNodes[dom.offset] as HTMLElement;
  }

  getColumnWidth(view: EditorView): number[] {
    const dom = view.domAtPos(this.getStartPos());
    return dom.node?.parentElement
      ? Array.from(dom.node.parentElement.children[0].children)?.map(
          (node: HTMLElement) => node.offsetWidth
        )
      : [];
  }
}
