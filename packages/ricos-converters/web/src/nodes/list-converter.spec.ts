import type { ListItemNode } from 'ricos-content';
import { Node_Type, TextStyle_TextAlignment } from 'ricos-schema';
import { ricosNodeVisitor, tiptapNodeVisitor } from '../tiptap-converters';
import { listItemConverter } from './list-converters';

describe('ListItem converter', () => {
  const tiptapNode = {
    type: Node_Type.LIST_ITEM,
    attrs: {
      dir: 'ltr',
      textStyle: {
        textAlignment: 'AUTO',
      },
      id: '53',
    },
    content: [
      {
        type: Node_Type.PARAGRAPH,
        attrs: {
          textStyle: {
            textAlignment: TextStyle_TextAlignment.AUTO,
          },
          indentation: 0,
          id: '54',
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
  };

  const listItemNode: ListItemNode = {
    type: Node_Type.LIST_ITEM,
    id: '53',
    nodes: [
      {
        type: Node_Type.PARAGRAPH,
        id: '54',
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
  };

  it('should convert ListItemNode to TiptapNode', () => {
    const actual = listItemConverter.toTiptap.convert(listItemNode, ricosNodeVisitor);
    expect(actual).toEqual(tiptapNode);
  });

  it('should convert TiptapNode to ListItemNode', () => {
    const actual = listItemConverter.fromTiptap.convert(tiptapNode, tiptapNodeVisitor);
    expect(actual).toEqual(listItemNode);
  });
});
