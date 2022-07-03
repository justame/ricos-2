import type { BulletedListNode, ListItemNode } from 'ricos-content';
import type { BulletedListData } from 'ricos-schema';
import { Node_Type } from 'ricos-schema';
import type { TiptapNodeConverter, TiptapNode } from '../types';

export const bulletedListConverter: TiptapNodeConverter = {
  toTiptap: {
    type: Node_Type.BULLETED_LIST,
    convert: (node: BulletedListNode, visit: (node: BulletedListNode) => TiptapNode[]) => ({
      type: Node_Type.BULLETED_LIST,
      attrs: {
        id: node.id,
        ...node.bulletedListData,
      },
      content: visit(node),
    }),
  },
  fromTiptap: {
    type: Node_Type.BULLETED_LIST,
    convert: (node: TiptapNode, visit: (node: TiptapNode) => ListItemNode[]) => {
      const { attrs = {} } = node;
      const { id, ...data } = attrs;
      return {
        type: Node_Type.BULLETED_LIST,
        id,
        nodes: visit(node),
        bulletedListData: {
          ...(data as BulletedListData),
        },
      };
    },
  },
};
