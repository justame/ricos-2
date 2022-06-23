import type { DividerNode } from 'ricos-content';
import {
  DividerData_Alignment,
  DividerData_LineStyle,
  DividerData_Width,
  Node_Type,
  PluginContainerData_Alignment,
  PluginContainerData_Width_Type,
} from 'ricos-schema';
import { ricosNodeVisitor, tiptapNodeVisitor } from '../tiptap-converters';
import { dividerConverter } from './divider-converter';

describe('audio converter', () => {
  const tiptapNode = {
    type: Node_Type.DIVIDER,
    attrs: {
      lineStyle: DividerData_LineStyle.DOUBLE,
      width: DividerData_Width.MEDIUM,
      alignment: DividerData_Alignment.CENTER,
      containerData: {
        alignment: PluginContainerData_Alignment.CENTER,
        width: {
          size: PluginContainerData_Width_Type.CONTENT,
        },
        textWrap: false,
      },
      id: '18',
    },
  };

  const dividerNode: DividerNode = {
    type: Node_Type.DIVIDER,
    id: '18',
    nodes: [],
    dividerData: {
      containerData: {
        width: {
          size: PluginContainerData_Width_Type.CONTENT,
        },
        alignment: PluginContainerData_Alignment.CENTER,
        textWrap: false,
      },
      lineStyle: DividerData_LineStyle.DOUBLE,
      width: DividerData_Width.MEDIUM,
      alignment: DividerData_Alignment.CENTER,
    },
  };

  it('should convert DividerNode to TiptapNode', () => {
    const actual = dividerConverter.toTiptap.convert(dividerNode, ricosNodeVisitor);
    expect(actual).toEqual(tiptapNode);
  });

  it('should convert TiptapNode to DividerNode', () => {
    const actual = dividerConverter.fromTiptap.convert(tiptapNode, tiptapNodeVisitor);
    expect(actual).toEqual(dividerNode);
  });
});
