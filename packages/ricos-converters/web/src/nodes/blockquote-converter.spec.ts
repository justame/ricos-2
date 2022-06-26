import type { BlockquoteNode, TextNode } from 'ricos-content';
import { Node_Type, TextStyle_TextAlignment, Decoration_Type } from 'ricos-schema';
import { ricosNodeVisitor, tiptapNodeVisitor } from '../tiptap-converters';
import { blockquoteConverter } from './blockquote-converter';

describe('Blockquote converter', () => {
  const tiptapNode = {
    type: Node_Type.BLOCKQUOTE,
    content: [] as TextNode[],
    attrs: {
      id: 'foo',
      indentation: 2,
      textStyle: {
        textAlignment: TextStyle_TextAlignment.LEFT,
      },
      paragraphId: 'bar',
    },
  };

  const blockquoteNode: BlockquoteNode = {
    type: Node_Type.BLOCKQUOTE,
    id: 'foo',
    blockquoteData: {
      indentation: 2,
    },
    nodes: [
      {
        type: Node_Type.PARAGRAPH,
        id: 'bar',
        paragraphData: {
          indentation: 0,
          textStyle: {
            textAlignment: TextStyle_TextAlignment.LEFT,
          },
        },
        nodes: [],
      },
    ],
  };
  it('should convert BlockquoteNode to TiptapNode', () => {
    const actual = blockquoteConverter.toTiptap.convert(blockquoteNode, ricosNodeVisitor);
    expect(actual).toEqual(tiptapNode);
  });

  it('should convert TiptapNode to BlockquoteNode', () => {
    const actual = blockquoteConverter.fromTiptap.convert(tiptapNode, tiptapNodeVisitor);
    expect(actual).toEqual(blockquoteNode);
  });
});
