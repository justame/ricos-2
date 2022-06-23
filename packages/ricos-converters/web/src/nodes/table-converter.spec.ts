import type { TableRowNode } from 'ricos-content';
import { Node_Type, TableCellData_VerticalAlignment, TextStyle_TextAlignment } from 'ricos-schema';
import { ricosNodeVisitor, tiptapNodeVisitor } from '../tiptap-converters';
import { tableRowConverter } from './table-converters';

describe('TableRowNode converter', () => {
  const tiptapNode = {
    type: Node_Type.TABLE_ROW,
    attrs: {
      id: '107',
    },
    content: [
      {
        type: Node_Type.TABLE_CELL,
        attrs: {
          cellStyle: {
            verticalAlignment: TableCellData_VerticalAlignment.TOP,
            backgroundColor: '#FF0000',
          },
          borderColors: {},
          id: '108',
        },
        content: [
          {
            type: Node_Type.PARAGRAPH,
            attrs: {
              textStyle: {
                textAlignment: TextStyle_TextAlignment.AUTO,
              },
              indentation: 0,
              id: '109',
            },
            content: [],
          },
        ],
      },
      {
        type: Node_Type.TABLE_CELL,
        attrs: {
          cellStyle: {
            verticalAlignment: TableCellData_VerticalAlignment.TOP,
          },
          borderColors: {
            left: '#3A54B4',
            right: '#3A54B4',
            top: '#3A54B4',
            bottom: '#3A54B4',
          },
          id: '110',
        },
        content: [
          {
            type: Node_Type.PARAGRAPH,
            attrs: {
              textStyle: {
                textAlignment: TextStyle_TextAlignment.AUTO,
              },
              indentation: 0,
              id: '111',
            },
            content: [],
          },
        ],
      },
    ],
  };

  const tableRowNode: TableRowNode = {
    type: Node_Type.TABLE_ROW,
    id: '107',
    nodes: [
      {
        type: Node_Type.TABLE_CELL,
        id: '108',
        nodes: [
          {
            type: Node_Type.PARAGRAPH,
            id: '109',
            nodes: [],
            paragraphData: {
              textStyle: {
                textAlignment: TextStyle_TextAlignment.AUTO,
              },
              indentation: 0,
            },
          },
        ],
        tableCellData: {
          cellStyle: {
            verticalAlignment: TableCellData_VerticalAlignment.TOP,
            backgroundColor: '#FF0000',
          },
          borderColors: {},
        },
      },
      {
        type: Node_Type.TABLE_CELL,
        id: '110',
        nodes: [
          {
            type: Node_Type.PARAGRAPH,
            id: '111',
            nodes: [],
            paragraphData: {
              textStyle: {
                textAlignment: TextStyle_TextAlignment.AUTO,
              },
              indentation: 0,
            },
          },
        ],
        tableCellData: {
          cellStyle: {
            verticalAlignment: TableCellData_VerticalAlignment.TOP,
          },
          borderColors: {
            left: '#3A54B4',
            right: '#3A54B4',
            top: '#3A54B4',
            bottom: '#3A54B4',
          },
        },
      },
    ],
  };

  it('should convert TableRowNode to TiptapNode', () => {
    const actual = tableRowConverter.toTiptap.convert(tableRowNode, ricosNodeVisitor);
    expect(actual).toEqual(tiptapNode);
  });

  it('should convert TiptapNode to TableRowNode', () => {
    const actual = tableRowConverter.fromTiptap.convert(tiptapNode, tiptapNodeVisitor);
    expect(actual).toEqual(tableRowNode);
  });
});
