import type { HeadingNode } from 'ricos-content';
import { Node_Type, TextStyle_TextAlignment } from 'ricos-schema';
import { ricosNodeVisitor, tiptapNodeVisitor } from '../tiptap-converters';
import { headingConverter } from './heading-converter';

describe('Heading converter', () => {
  const tiptapNode = {
    type: Node_Type.HEADING,
    attrs: {
      level: 3,
      textStyle: {
        textAlignment: TextStyle_TextAlignment.JUSTIFY,
      },
      indentation: 0,
      style: {
        paddingTop: '0px',
        paddingBottom: '0px',
      },
      id: '85',
    },
    content: [
      {
        type: 'text',
        text: 'Donec sit amet sapien quis velit ultrices sollicitudin id facilisis ligula.',
        marks: [],
        attrs: {
          id: '',
        },
      },
    ],
  };

  const headingNode: HeadingNode = {
    type: Node_Type.HEADING,
    id: '85',
    nodes: [
      {
        type: Node_Type.TEXT,
        id: '',
        nodes: [],
        textData: {
          text: 'Donec sit amet sapien quis velit ultrices sollicitudin id facilisis ligula.',
          decorations: [],
        },
      },
    ],
    style: {
      paddingTop: '0px',
      paddingBottom: '0px',
    },
    headingData: {
      level: 3,
      textStyle: {
        textAlignment: TextStyle_TextAlignment.JUSTIFY,
      },
      indentation: 0,
    },
  };

  it('should convert HeadingNode to TiptapNode', () => {
    const actual = headingConverter.toTiptap.convert(headingNode, ricosNodeVisitor);
    expect(actual).toEqual(tiptapNode);
  });

  it('should convert TiptapNode to HeadingNode', () => {
    const actual = headingConverter.fromTiptap.convert(tiptapNode, tiptapNodeVisitor);
    expect(actual).toEqual(headingNode);
  });
});
