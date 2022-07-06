import type { GifNode } from 'ricos-content';
import type { GIFData } from 'ricos-schema';
import { Node_Type } from 'ricos-schema';
import type { TiptapNodeConverter, TiptapNode } from '../types';

export const gifConverter: TiptapNodeConverter = {
  toTiptap: {
    type: Node_Type.GIF,
    convert: (node: GifNode) => ({
      type: Node_Type.GIF,
      attrs: {
        ...node.gifData,
        id: node.id,
      },
    }),
  },
  fromTiptap: {
    type: Node_Type.GIF,
    convert: (node: TiptapNode) => {
      const { id, ...data } = node.attrs || {};
      return {
        type: Node_Type.GIF,
        id,
        nodes: [],
        gifData: {
          ...(data as GIFData),
        },
      };
    },
  },
};
