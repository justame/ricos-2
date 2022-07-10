import type { BulletedListNode } from 'ricos-content';
import { Node_Type, TextStyle_TextAlignment } from 'ricos-schema';
import { ricosNodeVisitor, tiptapNodeVisitor } from '../tiptap-converters';
import { bulletedListConverter } from './bulleted-list-converter';

describe('bulletedListNode converter', () => {
  const tiptapNode = {
    type: Node_Type.BULLETED_LIST,
    attrs: {
      indentation: 1,
      id: '57',
    },
    content: [
      {
        type: Node_Type.LIST_ITEM,
        attrs: {
          dir: 'ltr',
          textStyle: {
            textAlignment: 'AUTO',
          },
          id: '58',
        },
        content: [
          {
            type: Node_Type.PARAGRAPH,
            attrs: {
              textStyle: {
                textAlignment: TextStyle_TextAlignment.AUTO,
              },
              indentation: 0,
              id: '59',
            },
            content: [
              {
                type: 'text',
                text: 'non efficitur a',
                marks: [],
                attrs: {
                  id: '',
                },
              },
            ],
          },
        ],
      },
    ],
  };

  const bulletedListNode: BulletedListNode = {
    type: Node_Type.BULLETED_LIST,
    id: '57',
    nodes: [
      {
        type: Node_Type.LIST_ITEM,
        id: '58',
        nodes: [
          {
            type: Node_Type.PARAGRAPH,
            id: '59',
            nodes: [
              {
                type: Node_Type.TEXT,
                id: '',
                nodes: [],
                textData: {
                  text: 'non efficitur a',
                  decorations: [],
                },
              },
            ],
            paragraphData: {
              textStyle: {
                textAlignment: TextStyle_TextAlignment.AUTO,
              },
              indentation: 0,
            },
          },
        ],
      },
    ],
    bulletedListData: {
      indentation: 1,
    },
  };

  it('should convert BulletedListNode to TiptapNode', () => {
    const actual = bulletedListConverter.toTiptap.convert(bulletedListNode, ricosNodeVisitor);
    expect(actual).toEqual(tiptapNode);
  });

  it('should convert TiptapNode to BulletedListNode', () => {
    const actual = bulletedListConverter.fromTiptap.convert(tiptapNode, tiptapNodeVisitor);
    expect(actual).toEqual(bulletedListNode);
  });
});
