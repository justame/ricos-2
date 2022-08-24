import type { TableRowNode } from 'ricos-content';
import type { Node } from 'ricos-schema';
import { Node_Type } from 'ricos-schema';
import type { TiptapNodeConverter, TiptapNode } from '../types';

export const tableRowConverter: TiptapNodeConverter = {
  toTiptap: {
    types: [Node_Type.TABLE_ROW],
    convert: (node: TableRowNode, visit: (node: TableRowNode) => TiptapNode[]) => ({
      type: Node_Type.TABLE_ROW,
      attrs: {
        id: node.id,
      },
      content: visit(node),
    }),
  },
  fromTiptap: {
    types: [Node_Type.TABLE_ROW],
    convert: (node: TiptapNode, visit: (node: TiptapNode) => Node[]) => {
      const { attrs = {} } = node;
      const { id } = attrs;
      return {
        type: Node_Type.TABLE_ROW,
        id,
        nodes: visit(node),
      };
    },
  },
};
