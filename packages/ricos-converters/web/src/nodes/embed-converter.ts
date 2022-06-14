import type { EmbedNode } from 'ricos-content';
import type { EmbedData } from 'ricos-schema';
import { Node_Type } from 'ricos-schema';
import type { TiptapNodeConverter, TiptapNode } from '../types';

export const embedConverter: TiptapNodeConverter = {
  toTiptap: {
    type: Node_Type.EMBED,
    convert: (node: EmbedNode) => ({
      type: Node_Type.EMBED,
      attrs: {
        ...node.embedData,
        id: node.id,
      },
    }),
  },
  fromTiptap: {
    type: Node_Type.EMBED,
    convert: (node: TiptapNode) => {
      const { id, ...data } = node.attrs || {};
      return {
        type: Node_Type.EMBED,
        id,
        nodes: [],
        embedData: {
          ...data,
        },
      };
    },
  },
};
