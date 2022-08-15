import type { NodeType, Fragment, Node as ProsemirrorNode, Schema } from 'prosemirror-model';

export function createCell(
  cellType: NodeType,
  cellContent?: Fragment<Schema> | ProsemirrorNode<Schema>
): ProsemirrorNode | null | undefined {
  if (cellContent) {
    return cellType.createChecked(null, cellContent);
  }

  return cellType.createAndFill();
}
