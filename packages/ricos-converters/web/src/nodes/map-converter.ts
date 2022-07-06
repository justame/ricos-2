import type { MapNode } from 'ricos-content';
import type { MapData } from 'ricos-schema';
import { Node_Type } from 'ricos-schema';
import type { TiptapNodeConverter, TiptapNode } from '../types';

export const mapConverter: TiptapNodeConverter = {
  toTiptap: {
    type: Node_Type.MAP,
    convert: (node: MapNode) => ({
      type: Node_Type.MAP,
      attrs: {
        ...node.mapData,
        id: node.id,
      },
    }),
  },
  fromTiptap: {
    type: Node_Type.MAP,
    convert: (node: TiptapNode) => {
      const { id, ...data } = node.attrs || {};
      return {
        type: Node_Type.MAP,
        id,
        nodes: [],
        mapData: {
          ...(data as MapData),
        },
      };
    },
  },
};
