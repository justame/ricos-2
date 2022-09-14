import type { HtmlNode } from 'ricos-content';
import type { HTMLData } from 'ricos-schema';
import { Node_Type } from 'ricos-schema';
import type { TiptapNodeConverter, TiptapNode } from '../types';

export const htmlConverter: TiptapNodeConverter = {
  toTiptap: {
    types: [Node_Type.HTML],
    convert: (node: HtmlNode) => {
      return {
        type: Node_Type.HTML,
        attrs: {
          ...node.htmlData,
          id: node.id,
        },
      };
    },
  },
  fromTiptap: {
    types: [Node_Type.HTML],
    convert: (node: TiptapNode) => {
      const { id, ...data } = node.attrs || {};
      return {
        type: Node_Type.HTML,
        id,
        nodes: [],
        htmlData: {
          ...(data as HTMLData),
          source: node.attrs?.source || 'HTML',
        },
      };
    },
  },
};
