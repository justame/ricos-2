import type { AudioNode } from 'ricos-content';
import type { AudioData } from 'ricos-schema';
import { Node_Type } from 'ricos-schema';
import type { TiptapNodeConverter, TiptapNode } from '../types';

export const audioConverter: TiptapNodeConverter = {
  toTiptap: {
    types: [Node_Type.AUDIO],
    convert: (node: AudioNode) => ({
      type: Node_Type.AUDIO,
      attrs: {
        ...node.audioData,
        id: node.id,
      },
    }),
  },
  fromTiptap: {
    types: [Node_Type.AUDIO],
    convert: (node: TiptapNode) => {
      const { id, ...data } = node.attrs || {};
      return {
        type: Node_Type.AUDIO,
        id,
        nodes: [],
        audioData: {
          ...(data as AudioData),
        },
      };
    },
  },
};
