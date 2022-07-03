import type { ParagraphNode } from 'ricos-content';
import type { ParagraphData, Node } from 'ricos-schema';
import { Node_Type } from 'ricos-schema';
import { getTextDirectionFromAlignment } from '../utils/text-direction';
import type { TiptapNodeConverter, TiptapNode } from '../types';

export const paragraphConverter: TiptapNodeConverter = {
  toTiptap: {
    type: Node_Type.PARAGRAPH,
    convert: (node: ParagraphNode, visit: (node: ParagraphNode) => TiptapNode[]) => {
      const { id, style, paragraphData } = node || {};
      const dir = getTextDirectionFromAlignment(paragraphData?.textStyle?.textAlignment);
      return {
        type: Node_Type.PARAGRAPH,
        attrs: {
          ...paragraphData,
          ...(dir ? { dir } : {}),
          ...(style ? { style } : {}),
          id,
        },
        content: visit(node),
      };
    },
  },
  fromTiptap: {
    type: Node_Type.PARAGRAPH,
    convert: (node: TiptapNode, visit: (node: TiptapNode) => Node[]) => {
      const { id, style, dir: _, ...data } = node.attrs || {};
      return {
        type: Node_Type.PARAGRAPH,
        id,
        nodes: visit(node),
        ...(style ? { style } : {}),
        paragraphData: {
          ...(data as ParagraphData),
        },
      };
    },
  },
};
