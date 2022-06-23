import type { OrderedListNode } from 'ricos-content';
import type { OrderedListData } from 'ricos-schema';
import { Node_Type } from 'ricos-schema';
import type { TiptapNodeConverter, TiptapNode } from '../types';

export const orderedListConverter: TiptapNodeConverter = {
  toTiptap: {
    type: Node_Type.ORDERED_LIST,
    convert: (node: OrderedListNode) => ({
      type: Node_Type.ORDERED_LIST,
      attrs: {
        ...node.orderedListData,
        id: node.id,
      },
      content: [] as [],
    }),
  },

  fromTiptap: {
    type: Node_Type.ORDERED_LIST,
    convert: (node: TiptapNode) => {
      const { id, ...data } = node.attrs || {};
      return {
        type: Node_Type.ORDERED_LIST,
        id,
        nodes: [],
        orderedListData: {
          ...(data as OrderedListData),
        },
      };
    },
  },
};
