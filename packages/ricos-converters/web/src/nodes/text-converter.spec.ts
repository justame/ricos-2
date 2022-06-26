import type { TextNode } from 'ricos-content';
import { Decoration_Type, FontSizeData_fontType, Node_Type } from 'ricos-schema';
import { ricosNodeVisitor, tiptapNodeVisitor } from '../tiptap-converters';
import { textConverter } from './text-converter';

describe('Text converter', () => {
  const tiptapNode = {
    type: Node_Type.TEXT,
    text: 'Lorem ipsum dolor sit amet',
    marks: [
      {
        type: Decoration_Type.BOLD,
        fontWeightValue: 700,
      },
      {
        type: Decoration_Type.FONT_SIZE,
        attrs: {
          unit: FontSizeData_fontType.PX,
          value: 20,
        },
      },
    ],
    attrs: {
      id: '',
    },
  };

  const textNode: TextNode = {
    type: Node_Type.TEXT,
    id: '',
    nodes: [],
    textData: {
      text: 'Lorem ipsum dolor sit amet',
      decorations: [
        {
          type: Decoration_Type.BOLD,
          fontWeightValue: 700,
        },
        {
          type: Decoration_Type.FONT_SIZE,
          fontSizeData: {
            unit: FontSizeData_fontType.PX,
            value: 20,
          },
        },
      ],
    },
  };

  it('should convert TextNode to TiptapNode', () => {
    const actual = textConverter.toTiptap.convert(textNode, ricosNodeVisitor);
    expect(actual).toEqual(tiptapNode);
  });

  it('should convert TiptapNode to TextNode', () => {
    const actual = textConverter.fromTiptap.convert(tiptapNode, tiptapNodeVisitor);
    expect(actual).toEqual(textNode);
  });
});
