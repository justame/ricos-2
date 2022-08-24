import type { ImageNode } from 'ricos-content';
import { Node_Type } from 'ricos-schema';
import type { TiptapNodeConverter, TiptapNode } from '../types';

export const imageConverter: TiptapNodeConverter = {
  toTiptap: {
    types: [Node_Type.IMAGE],
    convert: (node: ImageNode) => ({
      type: Node_Type.IMAGE,
      attrs: {
        ...node.imageData,
        id: node.id,
      },
    }),
  },
  fromTiptap: {
    types: [Node_Type.IMAGE],
    convert: (node: TiptapNode) => {
      const { id, ...data } = node.attrs || {};
      return {
        type: Node_Type.IMAGE,
        id,
        nodes: [],
        imageData: {
          ...data,
        },
      };
    },
  },
};
