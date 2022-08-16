import type { NodeView } from 'prosemirror-view';
import type { Node as ProseMirrorNode } from 'prosemirror-model';
import { debounce } from 'lodash';
import styles from './table.scss';
import type { Editor } from '@tiptap/core';
import { updateColumns } from './resizeUtils';
export class TableView implements NodeView {
  node: ProseMirrorNode;

  cellMinWidth: number;

  table: Element;

  colgroup: Element;

  contentDOM: HTMLElement;

  editor: Editor;

  dom: Element;

  constructor(node: ProseMirrorNode, editor: Editor) {
    this.editor = editor;
    this.node = node;
    this.cellMinWidth = 65;
    this.dom = document.createElement('div');

    this.dom.className = styles.tableWrapper;

    this.table = this.dom.appendChild(document.createElement('table'));
    this.colgroup = this.table.appendChild(document.createElement('colgroup'));

    updateColumns(node, this.colgroup, this.table, this.cellMinWidth);

    this.contentDOM = this.table.appendChild(document.createElement('tbody'));

    window.addEventListener('resize', () =>
      handleResize(this.dom, this.node, this.colgroup, this.cellMinWidth)
    );
  }

  update(node: ProseMirrorNode) {
    if (node.type !== this.node.type) {
      return false;
    }

    this.node = node;

    updateColumns(node, this.colgroup, this.table, this.cellMinWidth);
    maybeUpdateColsWidthRatio(node, this.table, this.colgroup);
    return true;
  }

  ignoreMutation(mutation: MutationRecord | { type: 'selection'; target: Element }) {
    return (
      mutation.type === 'attributes' &&
      (mutation.target === this.table || this.colgroup.contains(mutation.target))
    );
  }

  destroy() {
    window.removeEventListener('resize', () =>
      handleResize(this.dom, this.node, this.colgroup, this.cellMinWidth)
    );
  }
}

function maybeUpdateColsWidthRatio(node, table, colgroup) {
  if (colgroup.children.length !== node.attrs.dimensions.colsWidthRatio?.length) {
    node.attrs.dimensions.colsWidthRatio = getColsWidthRatio(table, colgroup);
  }
}

export function getColsWidthRatio(table, colgroup) {
  const tableWidth = table.offsetWidth;
  const colsWidth = Array.from(colgroup.children).map((col: HTMLElement) => col.offsetWidth);
  return colsWidth.map(colWidth => colWidth / tableWidth);
}

const handleResize = debounce((tableWrapper, node, colgroup, cellMinWidth) => {
  const tableWidth = tableWrapper.offsetWidth - 48;
  const { colsWidthRatio } = node.attrs.dimensions;
  const shouldResize =
    colsWidthRatio && !colsWidthRatio.find(widthRatio => widthRatio * tableWidth < cellMinWidth);
  shouldResize &&
    Array.from(colgroup.children).forEach(
      (col: HTMLElement, index: number) =>
        (col.style.width =
          Math.max(Math.floor(colsWidthRatio[index] * tableWidth), cellMinWidth) + 'px')
    );
}, 60);
