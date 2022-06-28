import type { BlockquoteNode, ParagraphNode, TextNode } from 'ricos-content';
import type { Node, ParagraphData } from 'ricos-schema';
import { Node_Type } from 'ricos-schema';
import { getTextDirectionFromAlignment } from '../utils/text-direction';
import type { TiptapNode, TiptapNodeConverter } from '../types';

type ParagraphFields = {
  paragraphData: ParagraphData;
  paragraphId: string;
};

const toParagraphFields = (node: ParagraphNode): ParagraphFields => {
  const { id: paragraphId, paragraphData } = node;
  return { paragraphData, paragraphId };
};

const toParagraphNode =
  (fields: ParagraphFields) =>
  (nodes: TextNode[]): ParagraphNode => {
    return {
      id: fields.paragraphId,
      type: Node_Type.PARAGRAPH,
      paragraphData: fields.paragraphData,
      nodes,
    };
  };

export const blockquoteConverter: TiptapNodeConverter = {
  toTiptap: {
    type: Node_Type.BLOCKQUOTE,
    convert: (node: BlockquoteNode, visit: (node: ParagraphNode) => TiptapNode[]) => {
      const {
        id,
        style,
        blockquoteData: { indentation },
      } = node || {};
      const { paragraphData, paragraphId } = toParagraphFields(node.nodes[0]);
      const dir = getTextDirectionFromAlignment(paragraphData?.textStyle?.textAlignment);
      return {
        type: Node_Type.BLOCKQUOTE,
        attrs: {
          paragraphId,
          textStyle: paragraphData.textStyle,
          indentation,
          ...(dir ? { dir } : {}),
          ...(style ? { style } : {}),
          id,
        },
        // skip internal paragraph, go to text nodes
        content: visit(node.nodes[0]),
      };
    },
  },
  fromTiptap: {
    type: Node_Type.BLOCKQUOTE,
    convert: (node: TiptapNode, visit: (node: TiptapNode) => Node[]) => {
      const { id, style, paragraphId, textStyle, indentation } = node.attrs || {};
      const paragraphNode = toParagraphNode({
        paragraphData: { indentation: 0, textStyle },
        paragraphId,
      })(visit(node) as TextNode[]);
      return {
        type: Node_Type.BLOCKQUOTE,
        id,
        nodes: [paragraphNode],
        ...(style ? { style } : {}),
        blockquoteData: {
          indentation,
        },
      };
    },
  },
};
