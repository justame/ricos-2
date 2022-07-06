import type { FileNode } from 'ricos-content';
import type { FileData } from 'ricos-schema';
import { Node_Type } from 'ricos-schema';
import type { TiptapNodeConverter, TiptapNode } from '../types';

export const fileUploadConverter: TiptapNodeConverter = {
  toTiptap: {
    type: Node_Type.FILE,
    convert: (node: FileNode) => ({
      type: Node_Type.FILE,
      attrs: {
        ...node.fileData,
        id: node.id,
      },
    }),
  },
  fromTiptap: {
    type: Node_Type.FILE,
    convert: (node: TiptapNode) => {
      const { id, ...data } = node.attrs || {};
      return {
        type: Node_Type.FILE,
        id,
        nodes: [],
        fileData: {
          ...(data as FileData),
        },
      };
    },
  },
};
