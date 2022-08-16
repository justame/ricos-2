import type { NodeType, Fragment, Node as ProsemirrorNode } from 'prosemirror-model';

export function createCell(
  cellType: NodeType,
  cellContent?: Fragment | ProsemirrorNode
): ProsemirrorNode | null | undefined {
  if (cellContent) {
    return cellType.createChecked(null, cellContent);
  }

  return cellType.createAndFill();
}
