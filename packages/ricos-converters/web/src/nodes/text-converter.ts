import type { TextNode } from 'ricos-content';
import { Node_Type } from 'ricos-schema';
import { markConverters } from '../mark-converters';
import { TiptapMarkBidiTransfoms } from '../tiptap-mark-transforms';
import type { TiptapNodeConverter, TiptapNode } from '../types';

export const textConverter: TiptapNodeConverter = {
  toTiptap: {
    types: [Node_Type.TEXT],
    convert: (node: TextNode) => {
      if (node.textData.text === '\n') {
        return {
          type: 'hardBreak',
          text: '\n',
          marks: [],
          attrs: {
            id: '',
          },
        };
      }
      const transforms = new TiptapMarkBidiTransfoms(markConverters).toTiptap();
      return {
        type: 'text',
        text: node.textData.text,
        marks: node.textData.decorations.map(d => transforms.byType(d).convert(d)),
        attrs: {
          id: '',
        },
      };
    },
  },
  fromTiptap: {
    types: ['hardBreak', 'text'],
    convert: (node: TiptapNode) => {
      const transforms = new TiptapMarkBidiTransfoms(markConverters).fromTiptap();
      if (node.type === 'hardBreak') {
        return {
          type: Node_Type.TEXT,
          id: '',
          nodes: [],
          textData: {
            text: '\n',
            decorations: [],
          },
        };
      }
      return {
        type: Node_Type.TEXT,
        id: '',
        nodes: [],
        textData: {
          text: node.text || '',
          decorations: node.marks?.map(mark => transforms.byType(mark).convert(mark)) || [],
        },
      };
    },
  },
};
