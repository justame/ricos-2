import type { TableNode, TableRowNode } from 'ricos-content';
import { TIPTAP_TABLE_HEADER_CELL_TYPE } from 'ricos-content';
import { Node_Type, TableCellData_VerticalAlignment, TextStyle_TextAlignment } from 'ricos-schema';
import { ricosNodeVisitor, tiptapNodeVisitor } from '../tiptap-converters';
import { tableConverter, tableRowConverter } from './table-converters';

describe('TableNode converter', () => {
  const tiptapNode = {
    type: Node_Type.TABLE,
    attrs: {
      dimensions: {
        colsWidthRatio: [10, 10],
        rowsHeight: [47, 47],
        colsMinWidth: [120, 120],
      },
      rowHeader: true,
      columnHeader: true,
      id: '106',
    },
    content: [
      {
        type: Node_Type.TABLE_ROW,
        attrs: {
          id: '107',
          height: 47,
        },
        content: [
          {
            type: TIPTAP_TABLE_HEADER_CELL_TYPE,
            attrs: {
              cellStyle: {
                verticalAlignment: TableCellData_VerticalAlignment.TOP,
                backgroundColor: '#FF0000',
              },
              borderColors: {},
              id: '108',
              colwidth: [10],
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
            type: TIPTAP_TABLE_HEADER_CELL_TYPE,
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
              colwidth: [10],
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
      },
      {
        type: Node_Type.TABLE_ROW,
        attrs: {
          id: '112',
          height: 47,
        },
        content: [
          {
            type: TIPTAP_TABLE_HEADER_CELL_TYPE,
            attrs: {
              cellStyle: {
                verticalAlignment: TableCellData_VerticalAlignment.TOP,
              },
              borderColors: {},
              id: '113',
              colwidth: [10],
            },
            content: [
              {
                type: Node_Type.PARAGRAPH,
                attrs: {
                  textStyle: {
                    textAlignment: TextStyle_TextAlignment.AUTO,
                  },
                  indentation: 0,
                  id: '114',
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
              borderColors: {},
              id: '115',
              colwidth: [10],
            },
            content: [
              {
                type: Node_Type.PARAGRAPH,
                attrs: {
                  textStyle: {
                    textAlignment: TextStyle_TextAlignment.AUTO,
                  },
                  indentation: 0,
                  id: '116',
                },
                content: [],
              },
            ],
          },
        ],
      },
    ],
  };

  const tableNode: TableNode = {
    type: Node_Type.TABLE,
    id: '106',
    nodes: [
      {
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
      },
      {
        type: Node_Type.TABLE_ROW,
        id: '112',
        nodes: [
          {
            type: Node_Type.TABLE_CELL,
            id: '113',
            nodes: [
              {
                type: Node_Type.PARAGRAPH,
                id: '114',
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
              borderColors: {},
            },
          },
          {
            type: Node_Type.TABLE_CELL,
            id: '115',
            nodes: [
              {
                type: Node_Type.PARAGRAPH,
                id: '116',
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
              borderColors: {},
            },
          },
        ],
      },
    ],
    tableData: {
      dimensions: {
        colsWidthRatio: [10, 10],
        rowsHeight: [47, 47],
        colsMinWidth: [120, 120],
      },
      rowHeader: true,
      columnHeader: true,
    },
  };

  it('should convert TableNode to TiptapNode', () => {
    const actual = tableConverter.toTiptap.convert(tableNode, ricosNodeVisitor);
    expect(actual).toEqual(tiptapNode);
  });

  it('should convert TiptapNode to TableNode', () => {
    const actual = tableConverter.fromTiptap.convert(tiptapNode, tiptapNodeVisitor);
    expect(actual).toEqual(tableNode);
  });
});

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
