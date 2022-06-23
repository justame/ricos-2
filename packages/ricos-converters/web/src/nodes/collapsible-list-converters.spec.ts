import type { CollapsibleListNode } from 'ricos-content';
import {
  CollapsibleListData_Direction,
  CollapsibleListData_InitialExpandedItems,
  PluginContainerData_Alignment,
  TextStyle_TextAlignment,
} from 'ricos-schema';
import { Node_Type } from 'ricos-schema';
import { ricosNodeVisitor, tiptapNodeVisitor } from '../tiptap-converters';
import { collapsibleListConverter } from './collapsible-list-converters';

describe('collapsibeListNode converter', () => {
  const tiptapNode = {
    type: Node_Type.COLLAPSIBLE_LIST,
    attrs: {
      initialExpandedItems: CollapsibleListData_InitialExpandedItems.FIRST,
      direction: CollapsibleListData_Direction.LTR,
      containerData: {
        alignment: TextStyle_TextAlignment.CENTER,
        textWrap: true,
      },
      expandOnlyOne: false,
      id: '95',
    },

    content: [] as [],
  };

  const collapsibleListNode: CollapsibleListNode = {
    type: Node_Type.COLLAPSIBLE_LIST,
    id: '95',
    nodes: [],
    collapsibleListData: {
      containerData: {
        alignment: PluginContainerData_Alignment.CENTER,
        textWrap: true,
      },
      expandOnlyOne: false,
      initialExpandedItems: CollapsibleListData_InitialExpandedItems.FIRST,
      direction: CollapsibleListData_Direction.LTR,
    },
  };

  it('should convert CollapsibleListNode to TiptapNode', () => {
    const actual = collapsibleListConverter.toTiptap.convert(collapsibleListNode, ricosNodeVisitor);
    expect(actual).toEqual(tiptapNode);
  });

  it('should convert TiptapNode to CollapsibleListNode', () => {
    const actual = collapsibleListConverter.fromTiptap.convert(tiptapNode, tiptapNodeVisitor);
    expect(actual).toEqual(collapsibleListNode);
  });
});
