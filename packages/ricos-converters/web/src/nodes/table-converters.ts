import type { TableRowNode, TableNode, TableCellNode } from 'ricos-content';
import { TIPTAP_TABLE_HEADER_CELL_TYPE } from 'ricos-content';
import type { Node, TableData, TableCellData } from 'ricos-schema';
import { Node_Type } from 'ricos-schema';
import type { TiptapNodeConverter, TiptapNode } from '../types';

export const tableConverter: TiptapNodeConverter = {
  toTiptap: {
    types: [Node_Type.TABLE],
    convert: (node: TableNode, visit: (node: TableRowNode | TableCellNode) => TiptapNode[]) => ({
      type: Node_Type.TABLE,
      attrs: {
        id: node.id,
        ...node.tableData,
      },
      content: node.nodes.map((rowNode, rowIndex) => ({
        type: Node_Type.TABLE_ROW,
        attrs: { id: rowNode.id, height: node.tableData.dimensions?.rowsHeight?.[rowIndex] },
        content: rowNode.nodes.map((colNode, colIndex) => ({
          type:
            (rowIndex === 0 && node.tableData.rowHeader) ||
            (colIndex === 0 && node.tableData.columnHeader)
              ? TIPTAP_TABLE_HEADER_CELL_TYPE
              : Node_Type.TABLE_CELL,
          attrs: {
            ...colNode.tableCellData,
            id: colNode.id,
            colwidth: [node.tableData.dimensions?.colsWidthRatio?.[colIndex]],
          },
          content: visit(colNode),
        })),
      })),
    }),
  },
  fromTiptap: {
    types: [Node_Type.TABLE],
    convert: (node: TiptapNode, visit: (node: TiptapNode) => Node[]) => {
      const { attrs = {} } = node;
      const { id, dimensions, ...data } = attrs;
      return {
        type: Node_Type.TABLE,
        id,
        tableData: {
          ...(data as TableData),
          dimensions: {
            ...dimensions,
            rowsHeight: node.content?.map(node => node.attrs?.height),
            colsWidthRatio: node.content?.[0].content?.map(node => node.attrs?.colwidth?.[0]),
          },
        },
        nodes: visit(node),
      };
    },
  },
};

export const tableRowConverter: TiptapNodeConverter = {
  toTiptap: {
    types: [Node_Type.TABLE_ROW],
    convert: (node: TableRowNode, visit: (node: TableRowNode) => TiptapNode[]) => ({
      type: Node_Type.TABLE_ROW,
      attrs: {
        id: node.id,
      },
      content: visit(node),
    }),
  },
  fromTiptap: {
    types: [Node_Type.TABLE_ROW],
    convert: (node: TiptapNode, visit: (node: TiptapNode) => Node[]) => {
      const { attrs = {} } = node;
      const { id } = attrs;
      return {
        type: Node_Type.TABLE_ROW,
        id,
        nodes: visit(node),
      };
    },
  },
};

export const tableHeaderCellConverter: TiptapNodeConverter = {
  toTiptap: {
    types: [Node_Type.TABLE_CELL],
    convert: (node: TableCellNode, visit: (node: TableCellNode) => TiptapNode[]) => ({
      type: Node_Type.TABLE_CELL,
      attrs: {
        id: node.id,
        ...node.tableCellData,
      },
      content: visit(node),
    }),
  },
  fromTiptap: {
    types: [TIPTAP_TABLE_HEADER_CELL_TYPE, Node_Type.TABLE_CELL],
    convert: (node: TiptapNode, visit: (node: TiptapNode) => Node[]) => {
      const { attrs = {} } = node;
      const { id, colwidth, ...data } = attrs;
      return {
        type: Node_Type.TABLE_CELL,
        id,
        tableCellData: {
          ...(data as TableCellData),
        },
        nodes: visit(node),
      };
    },
  },
};
