import type { DividerNode } from 'ricos-content';
import type { DividerData } from 'ricos-schema';
import { Node_Type } from 'ricos-schema';
import type { TiptapNodeConverter, TiptapNode } from '../types';

export const dividerConverter: TiptapNodeConverter = {
  toTiptap: {
    types: [Node_Type.DIVIDER],
    convert: (node: DividerNode) => ({
      type: Node_Type.DIVIDER,
      attrs: {
        ...node.dividerData,
        id: node.id,
      },
    }),
  },
  fromTiptap: {
    types: [Node_Type.DIVIDER],
    convert: (node: TiptapNode) => {
      const { id, ...data } = node.attrs || {};
      return {
        type: Node_Type.DIVIDER,
        id,
        nodes: [],
        dividerData: {
          ...(data as DividerData),
        },
      };
    },
  },
};
