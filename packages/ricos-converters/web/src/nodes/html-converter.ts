import type { HtmlNode } from 'ricos-content';
import type { HTMLData } from 'ricos-schema';
import { Node_Type } from 'ricos-schema';
import type { TiptapNodeConverter, TiptapNode } from '../types';

export const htmlConverter: TiptapNodeConverter = {
  toTiptap: {
    type: Node_Type.HTML,
    convert: (node: HtmlNode) => ({
      type: Node_Type.HTML,
      attrs: {
        ...node.htmlData,
        id: node.id,
      },
    }),
  },
  fromTiptap: {
    type: Node_Type.HTML,
    convert: (node: TiptapNode) => {
      const { id, ...data } = node.attrs || {};
      return {
        type: Node_Type.HTML,
        id,
        nodes: [],
        htmlData: {
          ...(data as HTMLData),
        },
      };
    },
  },
};
