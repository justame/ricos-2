import type { ListItemNode, ParagraphNode } from 'ricos-content';
import type { Node } from 'ricos-schema';
import { Node_Type } from 'ricos-schema';
import { getListItemDirection } from '../utils/text-direction';
import type { TiptapNodeConverter, TiptapNode } from '../types';

const getParagraphText = (node: ParagraphNode) => node?.nodes?.[0]?.textData?.text;

const getParagraphTextAlignment = (node: ParagraphNode) =>
  node?.paragraphData?.textStyle?.textAlignment;

export const listItemConverter: TiptapNodeConverter = {
  toTiptap: {
    type: Node_Type.LIST_ITEM,
    convert: (node: ListItemNode, visit: (node: ListItemNode) => TiptapNode[]) => {
      const paragraphNode = node?.nodes?.[0];
      const text = getParagraphText(paragraphNode);
      const textAlignment = getParagraphTextAlignment(paragraphNode);
      const dir = getListItemDirection(textAlignment, text);
      return {
        type: Node_Type.LIST_ITEM,
        attrs: {
          ...(dir ? { dir } : {}),
          ...(textAlignment ? { textStyle: { textAlignment } } : {}),
          id: node.id,
        },
        content: visit(node),
      };
    },
  },
  fromTiptap: {
    type: Node_Type.LIST_ITEM,
    convert: (node: TiptapNode, visit: (node: TiptapNode) => Node[]) => {
      const { attrs = {} } = node;
      const { id } = attrs;
      return {
        type: Node_Type.LIST_ITEM,
        id,
        nodes: visit(node),
      };
    },
  },
};
