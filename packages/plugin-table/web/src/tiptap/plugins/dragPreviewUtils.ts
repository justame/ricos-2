/* eslint-disable fp/no-loops */
import type { Editor } from '@tiptap/core';
import type { ContentNodeWithPos } from 'prosemirror-utils';

export function getDragPreviewElement(editor: Editor, tableStartPos: number): HTMLElement {
  const dom = editor.view.domAtPos(tableStartPos);
  return dom.node.childNodes[dom.offset] as HTMLElement;
}

export function updateRowDragPreview(
  parentTable: ContentNodeWithPos,
  dragPreview: HTMLElement,
  top: number,
  rowDraggedIndex: number
) {
  const rowsHeight = parentTable.node.attrs.dimensions.rowsHeight;
  const previewHeight = rowsHeight[rowDraggedIndex];
  dragPreview.style.width = '100%';
  dragPreview.style.height = `${previewHeight}px`;
  dragPreview.style.left = '0px';
  dragPreview.style.top = `${top}px`;
}

export function calculateRowDropIndex(
  rowsHeight: number[],
  top: number,
  previewHeight: number
): number {
  let dropIndex = 0;
  rowsHeight.forEach((_, index) => {
    const prevTotalHeight = rowsHeight.slice(0, index).reduce((curr, height) => curr + height, 0);
    if (
      index < rowsHeight.length - 1 &&
      top + previewHeight / 2 > prevTotalHeight &&
      top + previewHeight / 2 < prevTotalHeight + (rowsHeight[index + 1] || 0)
    ) {
      dropIndex = index;
    }
  });
  return dropIndex;
}

export function updateColumnDragPreview(
  dragPreview: HTMLElement,
  left: number,
  previewWidth: number
) {
  dragPreview.style.height = '100%';
  dragPreview.style.width = `${previewWidth}px`;
  dragPreview.style.top = '0px';
  dragPreview.style.left = `${left}px`;
}

export function calculateColumnDropIndex(
  colsWidth: number[],
  left: number,
  previewWidth: number
): number {
  let dropIndex = 0;
  colsWidth.forEach((_, index) => {
    const prevTotalWidth = colsWidth.slice(0, index).reduce((curr, width) => curr + width, 0);
    if (
      index < colsWidth.length - 1 &&
      left + previewWidth + previewWidth / 2 > prevTotalWidth &&
      left + previewWidth + previewWidth / 2 < prevTotalWidth + (colsWidth[index + 1] || 0)
    ) {
      dropIndex = index;
    }
  });
  return dropIndex;
}

export function getTableColumnWidth(editor: Editor, tableStartPos: number): number[] {
  const dom = editor.view.domAtPos(tableStartPos);
  return dom.node?.parentElement
    ? Array.from(dom.node.parentElement.children[0].children)?.map(
        (node: HTMLElement) => node.offsetWidth
      )
    : [];
}
