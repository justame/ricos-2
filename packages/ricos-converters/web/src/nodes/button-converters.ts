import type { ButtonNode } from 'ricos-content';
import { TIPTAP_LINK_BUTTON_TYPE, TIPTAP_ACTION_BUTTON_TYPE } from 'ricos-content';
import type { ButtonData } from 'ricos-schema';
import { Node_Type } from 'ricos-schema';
import type { TiptapNodeConverter, TiptapNode } from '../types';

const toTiptapButtonConvert = (node: ButtonNode): TiptapNode => ({
  type: node.buttonData.type === 'LINK' ? TIPTAP_LINK_BUTTON_TYPE : TIPTAP_ACTION_BUTTON_TYPE,
  attrs: {
    ...node.buttonData,
    id: node.id,
  },
});

const fromTiptapButtonConvert = (node: TiptapNode): ButtonNode => {
  const { id, ...data } = node.attrs || {};
  return {
    type: Node_Type.BUTTON,
    id,
    nodes: [],
    buttonData: {
      ...(data as ButtonData),
    },
  };
};

export const linkButtonConverter: TiptapNodeConverter = {
  toTiptap: {
    types: [Node_Type.BUTTON],
    convert: toTiptapButtonConvert,
  },
  fromTiptap: {
    types: [TIPTAP_LINK_BUTTON_TYPE],
    convert: fromTiptapButtonConvert,
  },
};

export const actionButtonConverter: TiptapNodeConverter = {
  toTiptap: {
    types: [Node_Type.BUTTON],
    convert: toTiptapButtonConvert,
  },
  fromTiptap: {
    types: [TIPTAP_ACTION_BUTTON_TYPE],
    convert: fromTiptapButtonConvert,
  },
};
