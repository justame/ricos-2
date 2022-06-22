import type { Node, Node_Type } from 'ricos-schema';
import toCamelCase from 'to-camel-case';
import { linkButtonConverter, actionButtonConverter } from './nodes/button-converters';
import { blockquoteConverter } from './nodes/blockquote-converter';
import {
  collapsibleItemBodyConverter,
  collapsibleItemConverter,
  collapsibleItemTitleConverter,
} from './nodes/collapsible-list-converters';
import { dividerConverter } from './nodes/divider-converter';
import { headingConverter } from './nodes/heading-converter';
import { imageConverter } from './nodes/image-converter';
import { listItemConverter } from './nodes/list-converters';
import { paragraphConverter } from './nodes/paragraph-converter';
import { tableRowConverter } from './nodes/table-converters';
import { textConverter } from './nodes/text-converter';
import { codeBlockConverter } from './nodes/code-block-converter';
import { audioConverter } from './nodes/audio-converter';
import { embedConverter } from './nodes/embed-converter';
import { fileUploadConverter } from './nodes/file-upload-converter';
import { galleryConverter } from './nodes/gallery-converter';
import { gifConverter } from './nodes/gif-converter';
import { mapConverter } from './nodes/map-converter';
import { videoConverter } from './nodes/video-converter';
import { pollConverter } from './nodes/poll-converter';
import { htmlConverter } from './nodes/html-converter';
import { linkPreviewConverter } from './nodes/link-preview-converter';
import { orderedListConverter } from './nodes/ordered-list-converter';
import { bulletedListConverter } from './nodes/bulleted-list-converter';
import type { TiptapNode, TiptapNodeConverter } from './types';

export const getUnsupportedToTiptap = (node: Node): TiptapNodeConverter['toTiptap'] => {
  const dataProp = Object.keys(node).find(p => p.endsWith(`${toCamelCase(node.type)}Data`));
  return {
    type: node.type,
    convert: (node: Node, visit: (node: Node) => TiptapNode[]) => {
      const content = visit(node);
      return {
        type: node.type,
        attrs: {
          ...(dataProp ? node[dataProp] : {}),
          id: node.id,
        },
        ...(content.length > 0 ? { content } : {}),
      };
    },
  };
};

export const getUnsupportedFromTiptap = (node: TiptapNode): TiptapNodeConverter['fromTiptap'] => {
  const { id, ...data } = node.attrs || {};
  return {
    type: node.type,
    convert: (node: TiptapNode, visit: (node: TiptapNode) => Node[]) => ({
      type: node.type as Node_Type,
      id,
      [`${toCamelCase(node.type)}Data`]: { ...data },
      nodes: visit(node),
    }),
  };
};

export const nodeConverters = [
  imageConverter,
  dividerConverter,
  textConverter,
  paragraphConverter,
  blockquoteConverter,
  headingConverter,
  linkButtonConverter,
  actionButtonConverter,
  listItemConverter,
  collapsibleItemConverter,
  collapsibleItemTitleConverter,
  collapsibleItemBodyConverter,
  tableRowConverter,
  codeBlockConverter,
  audioConverter,
  embedConverter,
  fileUploadConverter,
  galleryConverter,
  gifConverter,
  mapConverter,
  videoConverter,
  pollConverter,
  htmlConverter,
  linkPreviewConverter,
  orderedListConverter,
  bulletedListConverter,
];
