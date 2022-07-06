import type { CodeBlockNode } from 'ricos-content';
import type { CodeBlockData, Node } from 'ricos-schema';
import { Node_Type } from 'ricos-schema';
import type { TiptapNodeConverter, TiptapNode } from '../types';

export const codeBlockConverter: TiptapNodeConverter = {
  toTiptap: {
    type: Node_Type.CODE_BLOCK,
    convert: (node: CodeBlockNode, visit: (node: CodeBlockNode) => TiptapNode[]) => ({
      type: Node_Type.CODE_BLOCK,
      attrs: {
        ...node.codeBlockData,
        id: node.id,
      },
      content: visit(node),
    }),
  },
  fromTiptap: {
    type: Node_Type.CODE_BLOCK,
    convert: (node: TiptapNode, visit: (node: TiptapNode) => Node[]) => {
      const { id, ...data } = node.attrs || {};
      return {
        type: Node_Type.CODE_BLOCK,
        id,
        nodes: visit(node),
        codeBlockData: {
          ...(data as CodeBlockData),
        },
      };
    },
  },
};
