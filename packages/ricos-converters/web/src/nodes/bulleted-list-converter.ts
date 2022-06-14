import type { BulletedListNode } from 'ricos-content';
import type { BulletedListData } from 'ricos-schema';
import { Node_Type } from 'ricos-schema';
import type { TiptapNodeConverter, TiptapNode } from '../types';

export const bulletedListConverter: TiptapNodeConverter = {
  toTiptap: {
    type: Node_Type.BULLETED_LIST,
    convert: (node: BulletedListNode) => ({
      type: Node_Type.BULLETED_LIST,
      attrs: {
        ...node.bulletedListData,
        id: node.id,
      },
    }),
  },
  fromTiptap: {
    type: Node_Type.BULLETED_LIST,
    convert: (node: TiptapNode) => {
      const { id, ...data } = node.attrs || {};
      return {
        type: Node_Type.BULLETED_LIST,
        id,
        nodes: [],
        bulletedListData: {
          ...(data as BulletedListData),
        },
      };
    },
  },
};
