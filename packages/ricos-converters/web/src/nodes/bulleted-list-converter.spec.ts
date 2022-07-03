import type { BulletedListNode } from 'ricos-content';
import { Node_Type } from 'ricos-schema';
import { ricosNodeVisitor, tiptapNodeVisitor } from '../tiptap-converters';
import { bulletedListConverter } from './bulleted-list-converter';

describe('bulletedListNode converter', () => {
  const tiptapNode = {
    type: Node_Type.BULLETED_LIST,
    attrs: {
      indentation: 2,
      id: '1',
    },
    content: [],
  };

  const bulletedListNode: BulletedListNode = {
    type: Node_Type.BULLETED_LIST,
    id: '1',
    nodes: [],
    bulletedListData: {
      indentation: 2,
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
