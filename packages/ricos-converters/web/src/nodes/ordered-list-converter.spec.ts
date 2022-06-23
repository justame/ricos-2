import type { OrderedListNode, ListItemNode } from 'ricos-content';
import { Node_Type } from 'ricos-schema';
import { ricosNodeVisitor, tiptapNodeVisitor } from '../tiptap-converters';
import { orderedListConverter } from './ordered-list-converter';

describe('OrderedList converter', () => {
  const tiptapNode = {
    type: Node_Type.ORDERED_LIST,
    attrs: {
      indentation: 2,
      id: '45',
    },
    content: [] as ListItemNode[],
  };

  const orderedListNode: OrderedListNode = {
    type: Node_Type.ORDERED_LIST,
    id: '45',
    nodes: [],
    orderedListData: {
      indentation: 2,
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
