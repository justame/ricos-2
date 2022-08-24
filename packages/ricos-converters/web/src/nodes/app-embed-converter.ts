import type { AppEmbedNode } from 'ricos-content';
import type { AppEmbedData } from 'ricos-schema';
import { Node_Type } from 'ricos-schema';
import type { TiptapNodeConverter, TiptapNode } from '../types';

export const appEmbedConverter: TiptapNodeConverter = {
  toTiptap: {
    types: [Node_Type.APP_EMBED],
    convert: (node: AppEmbedNode) => ({
      type: Node_Type.APP_EMBED,
      attrs: {
        ...node.appEmbedData,
        id: node.id,
      },
    }),
  },
  fromTiptap: {
    types: [Node_Type.APP_EMBED],
    convert: (node: TiptapNode) => {
      const { id, ...data } = node.attrs || {};
      return {
        type: Node_Type.APP_EMBED,
        id,
        nodes: [],
        appEmbedData: {
          ...(data as AppEmbedData),
        },
      };
    },
  },
};
