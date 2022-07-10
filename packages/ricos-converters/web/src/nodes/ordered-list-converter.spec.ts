import type { OrderedListNode } from 'ricos-content';
import { Node_Type, TextStyle_TextAlignment } from 'ricos-schema';
import { ricosNodeVisitor, tiptapNodeVisitor } from '../tiptap-converters';
import { orderedListConverter } from './ordered-list-converter';

describe('OrderedList converter', () => {
  const tiptapNode = {
    type: Node_Type.ORDERED_LIST,
    attrs: {
      indentation: 4,
      id: '51',
    },
    content: [
      {
        type: Node_Type.LIST_ITEM,
        attrs: {
          dir: 'ltr',
          textStyle: {
            textAlignment: 'AUTO',
          },
          id: '52',
        },
        content: [
          {
            type: Node_Type.PARAGRAPH,
            attrs: {
              textStyle: {
                textAlignment: TextStyle_TextAlignment.AUTO,
              },
              indentation: 0,
              id: '53',
            },
            content: [
              {
                type: 'text',
                text: 'Nulla non varius ipsum, sit amet consectetur quam.',
                marks: [],
                attrs: {
                  id: '',
                },
              },
            ],
          },
        ],
      },
      {
        type: Node_Type.LIST_ITEM,
        attrs: {
          dir: 'ltr',
          textStyle: {
            textAlignment: 'AUTO',
          },
          id: '54',
        },
        content: [
          {
            type: Node_Type.PARAGRAPH,
            attrs: {
              textStyle: {
                textAlignment: TextStyle_TextAlignment.AUTO,
              },
              indentation: 0,
              id: '55',
            },
            content: [
              {
                type: 'text',
                text: 'Nunc scelerisque fringilla aliquet.',
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

  const orderedListNode: OrderedListNode = {
    type: Node_Type.ORDERED_LIST,
    id: '51',
    nodes: [
      {
        type: Node_Type.LIST_ITEM,
        id: '52',
        nodes: [
          {
            type: Node_Type.PARAGRAPH,
            id: '53',
            nodes: [
              {
                type: Node_Type.TEXT,
                id: '',
                nodes: [],
                textData: {
                  text: 'Nulla non varius ipsum, sit amet consectetur quam.',
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
      {
        type: Node_Type.LIST_ITEM,
        id: '54',
        nodes: [
          {
            type: Node_Type.PARAGRAPH,
            id: '55',
            nodes: [
              {
                type: Node_Type.TEXT,
                id: '',
                nodes: [],
                textData: {
                  text: 'Nunc scelerisque fringilla aliquet.',
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
    orderedListData: {
      indentation: 4,
    },
  };

  it('should convert OrderedListNode to TiptapNode', () => {
    const actual = orderedListConverter.toTiptap.convert(orderedListNode, ricosNodeVisitor);
    expect(actual).toEqual(tiptapNode);
  });

  it('should convert TiptapNode to OrderedListNode', () => {
    const actual = orderedListConverter.fromTiptap.convert(tiptapNode, tiptapNodeVisitor);
    expect(actual).toEqual(orderedListNode);
  });
});
