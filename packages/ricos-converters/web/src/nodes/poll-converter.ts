import type { PollNode } from 'ricos-content';
import type { PollData } from 'ricos-schema';
import { Node_Type } from 'ricos-schema';
import type { TiptapNodeConverter, TiptapNode } from '../types';

export const pollConverter: TiptapNodeConverter = {
  toTiptap: {
    type: Node_Type.POLL,
    convert: (node: PollNode) => ({
      type: Node_Type.POLL,
      attrs: {
        ...node.pollData,
        id: node.id,
      },
    }),
  },
  fromTiptap: {
    type: Node_Type.POLL,
    convert: (node: TiptapNode) => {
      const { id, ...data } = node.attrs || {};
      return {
        type: Node_Type.POLL,
        id,
        nodes: [],
        pollData: {
          ...(data as PollData),
        },
      };
    },
  },
};
