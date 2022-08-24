import type { HeadingNode } from 'ricos-content';
import type { Node, HeadingData } from 'ricos-schema';
import { Node_Type } from 'ricos-schema';
import type { TiptapNodeConverter, TiptapNode } from '../types';

export const headingConverter: TiptapNodeConverter = {
  toTiptap: {
    types: [Node_Type.HEADING],
    convert: (node: HeadingNode, visit: (node: HeadingNode) => TiptapNode[]) => {
      const { id, style, headingData } = node || {};
      return {
        type: Node_Type.HEADING,
        attrs: {
          ...headingData,
          ...(style ? { style } : {}),
          id,
        },
        content: visit(node),
      };
    },
  },
  fromTiptap: {
    types: [Node_Type.HEADING],
    convert: (node: TiptapNode, visit: (node: TiptapNode) => Node[]) => {
      const { id, style, ...data } = node.attrs || {};
      return {
        type: Node_Type.HEADING,
        id,
        nodes: visit(node),
        ...(style ? { style } : {}),
        headingData: {
          ...(data as HeadingData),
        },
      };
    },
  },
};
