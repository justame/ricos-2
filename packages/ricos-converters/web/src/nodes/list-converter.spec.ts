import type { ListItemNode, ParagraphNode } from 'ricos-content';
import { Node_Type } from 'ricos-schema';
import { ricosNodeVisitor, tiptapNodeVisitor } from '../tiptap-converters';
import { listItemConverter } from './list-converters';

describe('ListItem converter', () => {
  const tiptapNode = {
    type: Node_Type.LIST_ITEM,
    attrs: {
      id: '82',
    },
    content: [] as ParagraphNode[],
  };

  const listItemNode: ListItemNode = {
    type: Node_Type.LIST_ITEM,
    id: '82',
    nodes: [],
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
