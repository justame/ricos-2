import type { OrderedListNode } from 'ricos-content';
import type { OrderedListData } from 'ricos-schema';
import { Node_Type } from 'ricos-schema';
import type { TiptapNodeConverter, TiptapNode } from '../types';

export const orderedListConverter: TiptapNodeConverter = {
  toTiptap: {
    types: [Node_Type.ORDERED_LIST],
    convert: (node: OrderedListNode, visit: (node: OrderedListNode) => TiptapNode[]) => ({
      type: Node_Type.ORDERED_LIST,
      attrs: {
        ...node.orderedListData,
        id: node.id,
      },
      content: visit(node),
    }),
  },

  fromTiptap: {
    types: [Node_Type.ORDERED_LIST],
    convert: (node: TiptapNode, visit: (node: TiptapNode) => OrderedListNode[]) => {
      const { id, ...data } = node.attrs || {};
      return {
        type: Node_Type.ORDERED_LIST,
        id,
        nodes: visit(node),
        orderedListData: {
          ...(data as OrderedListData),
        },
      };
    },
  },
};
