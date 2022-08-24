import type { VideoNode } from 'ricos-content';
import type { VideoData } from 'ricos-schema';
import { Node_Type } from 'ricos-schema';
import type { TiptapNodeConverter, TiptapNode } from '../types';

export const videoConverter: TiptapNodeConverter = {
  toTiptap: {
    types: [Node_Type.VIDEO],
    convert: (node: VideoNode) => ({
      type: Node_Type.VIDEO,
      attrs: {
        ...node.videoData,
        id: node.id,
      },
    }),
  },
  fromTiptap: {
    types: [Node_Type.VIDEO],
    convert: (node: TiptapNode) => {
      const { id, ...data } = node.attrs || {};
      return {
        type: Node_Type.VIDEO,
        id,
        nodes: [],
        videoData: {
          ...(data as VideoData),
        },
      };
    },
  },
};
