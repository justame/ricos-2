import type { CodeBlockNode } from 'ricos-content';
import { Node_Type, TextStyle_TextAlignment } from 'ricos-schema';
import { ricosNodeVisitor, tiptapNodeVisitor } from '../tiptap-converters';
import { codeBlockConverter } from './code-block-converter';

describe('CodeBlock converter', () => {
  const tiptapNode = {
    type: Node_Type.CODE_BLOCK,
    attrs: {
      textStyle: {
        textAlignment: 'AUTO',
      },
      id: '20',
    },
    content: [
      {
        type: 'text',
        text: 'songs = pd.read_csv(SONGS_FILE)',
        marks: [],
        attrs: {
          id: '',
        },
      },
    ],
  };

  const codeBlockNode: CodeBlockNode = {
    type: Node_Type.CODE_BLOCK,
    id: '20',
    nodes: [
      {
        type: Node_Type.TEXT,
        id: '',
        nodes: [],
        textData: {
          text: 'songs = pd.read_csv(SONGS_FILE)',
          decorations: [],
        },
      },
    ],
    codeBlockData: {
      textStyle: {
        textAlignment: TextStyle_TextAlignment.AUTO,
      },
    },
  };

  it('should convert CodeBlock to TiptapNode', () => {
    const actual = codeBlockConverter.toTiptap.convert(codeBlockNode, ricosNodeVisitor);
    expect(actual).toEqual(tiptapNode);
  });

  it('should convert TiptapNode to CodeBlock', () => {
    const actual = codeBlockConverter.fromTiptap.convert(tiptapNode, tiptapNodeVisitor);
    expect(actual).toEqual(codeBlockNode);
  });
});
