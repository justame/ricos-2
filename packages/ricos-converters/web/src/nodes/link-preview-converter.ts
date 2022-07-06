import type { LinkPreviewNode } from 'ricos-content';
import type { LinkPreviewData } from 'ricos-schema';
import { Node_Type } from 'ricos-schema';
import type { TiptapNodeConverter, TiptapNode } from '../types';

export const linkPreviewConverter: TiptapNodeConverter = {
  toTiptap: {
    type: Node_Type.LINK_PREVIEW,
    convert: (node: LinkPreviewNode) => ({
      type: Node_Type.LINK_PREVIEW,
      attrs: {
        ...node.linkPreviewData,
        id: node.id,
      },
    }),
  },
  fromTiptap: {
    type: Node_Type.LINK_PREVIEW,
    convert: (node: TiptapNode) => {
      const { id, ...data } = node.attrs || {};
      return {
        type: Node_Type.LINK_PREVIEW,
        id,
        nodes: [],
        linkPreviewData: {
          ...(data as LinkPreviewData),
        },
      };
    },
  },
};
