import type { GalleryNode } from 'ricos-content';
import type { GalleryData } from 'ricos-schema';
import { Node_Type } from 'ricos-schema';
import type { TiptapNodeConverter, TiptapNode } from '../types';

export const galleryConverter: TiptapNodeConverter = {
  toTiptap: {
    type: Node_Type.GALLERY,
    convert: (node: GalleryNode) => ({
      type: Node_Type.GALLERY,
      attrs: {
        ...node.galleryData,
        id: node.id,
      },
    }),
  },
  fromTiptap: {
    type: Node_Type.GALLERY,
    convert: (node: TiptapNode) => {
      const { id, ...data } = node.attrs || {};
      return {
        type: Node_Type.GALLERY,
        id,
        nodes: [],
        galleryData: {
          ...(data as GalleryData),
        },
      };
    },
  },
};
