import type { CodeBlockNode } from 'ricos-content';
import type { CodeBlockData } from 'ricos-schema';
import { Node_Type } from 'ricos-schema';
import type { TiptapNodeConverter, TiptapNode } from '../types';

export const codeBlockConverter: TiptapNodeConverter = {
  toTiptap: {
    type: Node_Type.CODE_BLOCK,
    convert: (node: CodeBlockNode) => ({
      type: Node_Type.CODE_BLOCK,
      attrs: {
        ...node.codeBlockData,
        id: node.id,
      },
    }),
  },
  fromTiptap: {
    type: Node_Type.CODE_BLOCK,
    convert: (node: TiptapNode) => {
      const { id, ...data } = node.attrs || {};
      return {
        type: Node_Type.CODE_BLOCK,
        id,
        nodes: [],
        codeBlockData: {
          ...(data as CodeBlockData),
        },
      };
    },
  },
};
