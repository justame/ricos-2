import { TIPTAP_TABLE_TYPE, TIPTAP_TABLE_ROW_TYPE } from 'ricos-content';
import tableDataDefaults from 'ricos-schema/dist/statics/table.defaults.json';
import type { ExtensionProps, NodeConfig, RicosExtension } from 'ricos-types';
import { getExtensionField, callOrReturn } from '@tiptap/core';
import { TextSelection, Selection } from 'prosemirror-state';
import {
  addRowColPlugin,
  controllerPlugin,
  columnResizingPlugin,
  rowResizingPlugin,
  tableEditingPlugin,
  TableView,
} from './plugins';
import { createTable } from './utilities/createTable';
import { getCellNeighbors } from './utilities/getCellNeighbors';
import { keyboardShortcuts } from './utilities/keyboardShortcuts';
import {
  addColumnAt,
  selectColumn,
  selectRow,
  selectTable,
  removeColumnAt,
  removeRowAt,
  addRowAt,
  findTable,
} from 'prosemirror-utils';
import {
  goToNextCell,
  addColumnBefore,
  addColumnAfter,
  addColumn,
  deleteColumn,
  addRowBefore,
  addRowAfter,
  addRow,
  deleteRow,
  deleteTable,
  mergeCells,
  splitCell,
  toggleHeader,
  fixTables,
  CellSelection,
  selectedRect,
  cellAround,
  TableMap,
} from 'prosemirror-tables';
import { TRANSACTION_META_KEYS } from './consts';
import { setCellAttr } from './utilities/commands';
import { getRowsAndColsInSelection } from './utilities/getRowsAndColsInSelection';
import { getTotalWidthInSelection } from './utilities/getTotalWidthInSelection';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    table: {
      /**
       * delete table in selection
       */
      deleteTable: () => ReturnType;
    };
  }
}

export const tableExtension = {
  type: 'node' as const,
  groups: ['react', 'shortcuts-enabled'],
  reconfigure: (
    config: NodeConfig,
    _extensions: RicosExtension[],
    _props: ExtensionProps,
    settings: Record<string, unknown>
  ) => ({
    ...config,
    addOptions: () => ({
      ...settings,
      View: TableView,
    }),
  }),
  name: TIPTAP_TABLE_TYPE,
  createExtensionConfig({ Plugin, PluginKey }) {
    return {
      name: this.name,
      group: 'block',
      selectable: true,
      draggable: true,
      content: `${TIPTAP_TABLE_ROW_TYPE}+`,
      tableRole: 'table',
      contentDOM: document.createElement('tbody'),
      addAttributes: () => tableDataDefaults,
      parseHTML() {
        return [{ tag: 'table' }];
      },

      renderHTML({ HTMLAttributes }) {
        return ['table', HTMLAttributes, ['tbody', 0]];
      },

      addProseMirrorPlugins() {
        return [
          controllerPlugin(Plugin, PluginKey, this.editor),
          addRowColPlugin(Plugin, PluginKey, this.editor),
          columnResizingPlugin(Plugin, PluginKey),
          rowResizingPlugin(Plugin, PluginKey, this.editor),
          tableEditingPlugin(Plugin, PluginKey, this.editor),
        ];
      },

      extendNodeSchema(extension) {
        const context = {
          name: extension.name,
          options: extension.options,
          storage: extension.storage,
        };

        return {
          tableRole: callOrReturn(getExtensionField(extension, 'tableRole', context)),
        };
      },

      addNodeView() {
        return ({ node, editor }) => new TableView(node, editor);
      },

      addCommands() {
        return {
          insertTable:
            ({ rows = 3, cols = 3, withHeaderRow = true } = {}) =>
            ({ tr, dispatch, editor }) => {
              const node = createTable(editor.schema, rows, cols, withHeaderRow);

              if (dispatch) {
                const offset = tr.selection.anchor + 1;

                tr.replaceSelectionWith(node)
                  .scrollIntoView()
                  .setSelection(TextSelection.near(tr.doc.resolve(offset)));
              }

              return true;
            },
          addColumnBefore:
            () =>
            ({ state, dispatch }) => {
              return addColumnBefore(state, dispatch);
            },
          addColumnAfter:
            () =>
            ({ state, dispatch }) => {
              return addColumnAfter(state, dispatch);
            },
          addColumn:
            (rect, index) =>
            ({ dispatch, tr }) => {
              return dispatch(addColumn(tr, rect, index));
            },
          deleteColumn:
            () =>
            ({ state, dispatch }) => {
              return deleteColumn(state, dispatch);
            },
          addRowBefore:
            () =>
            ({ state, dispatch }) => {
              return addRowBefore(state, dispatch);
            },
          addRowAfter:
            () =>
            ({ state, dispatch }) => {
              return addRowAfter(state, dispatch);
            },
          addRow:
            (rect, index) =>
            ({ dispatch, tr }) => {
              return dispatch(addRow(tr, rect, index));
            },
          deleteRow:
            () =>
            ({ state, dispatch }) => {
              return deleteRow(state, dispatch);
            },
          deleteTable:
            () =>
            ({ state, dispatch }) => {
              return deleteTable(state, dispatch);
            },
          mergeCells:
            () =>
            ({ state, dispatch }) => {
              return mergeCells(state, dispatch);
            },
          splitCell:
            () =>
            ({ state, dispatch }) => {
              return splitCell(state, dispatch);
            },
          toggleHeaderColumn:
            () =>
            ({ chain }) => {
              chain()
                .toggleTableAttribute('columnHeader')
                .command(({ state, dispatch }) => {
                  toggleHeader('column')(state, dispatch);
                  return true;
                })
                .run();
            },
          toggleHeaderRow:
            () =>
            ({ chain }) => {
              chain()
                .toggleTableAttribute('rowHeader')
                .command(({ state, dispatch }) => {
                  toggleHeader('row')(state, dispatch);
                  return true;
                })
                .run();
            },
          mergeOrSplit:
            () =>
            ({ state, dispatch }) => {
              if (mergeCells(state, dispatch)) {
                return true;
              }

              return splitCell(state, dispatch);
            },
          setCellAttribute:
            (name, value) =>
            ({ state, dispatch }) => {
              return setCellAttr(name, value)(state, dispatch);
            },
          toggleTableAttribute:
            name =>
            ({ state, dispatch }) => {
              const parentTable = findTable(state.selection);
              if (parentTable) {
                const { tr } = state;
                const table = parentTable.node;
                tr.setNodeMarkup(parentTable.pos, undefined, {
                  ...table.attrs,
                  [name]: !table.attrs[name],
                });
                dispatch(tr);
              }
              return true;
            },
          goToNextCell:
            () =>
            ({ state, dispatch }) => {
              return goToNextCell(1)(state, dispatch);
            },
          goToPreviousCell:
            () =>
            ({ state, dispatch }) => {
              return goToNextCell(-1)(state, dispatch);
            },
          fixTables:
            () =>
            ({ state, dispatch }) => {
              if (dispatch) {
                fixTables(state);
              }

              return true;
            },
          setCellSelection:
            pos =>
            ({ tr, dispatch }) => {
              if (dispatch) {
                const selection = CellSelection.create(tr.doc, pos);
                tr.setMeta(TRANSACTION_META_KEYS.SELECTED_CELL, { pos });
                tr.setSelection(selection);
              }
              return true;
            },
          selectColumnAtIndex:
            index =>
            ({ tr, dispatch }) => {
              tr.setMeta(TRANSACTION_META_KEYS.SELECT_COLUMN, index);
              dispatch(selectColumn(index)(tr));
            },
          selectColumn:
            () =>
            ({ state, commands }) => {
              const rect = selectedRect(state);
              return commands.selectColumnAtIndex(rect.left);
            },
          deleteColumnAtIndex:
            index =>
            ({ tr, dispatch }) => {
              dispatch(removeColumnAt(index)(tr));
            },
          addColumnAtIndex:
            index =>
            ({ tr, dispatch }) => {
              dispatch(addColumnAt(index)(tr));
            },
          selectRowAtIndex:
            index =>
            ({ tr, dispatch }) => {
              tr.setMeta(TRANSACTION_META_KEYS.SELECT_ROW, index);
              dispatch(selectRow(index)(tr));
            },
          selectRow:
            () =>
            ({ state, commands }) => {
              const rect = selectedRect(state);
              return commands.selectRowAtIndex(rect.top);
            },
          deleteRowAtIndex:
            index =>
            ({ tr, dispatch }) => {
              dispatch(removeRowAt(index)(tr));
            },
          addRowAtIndex:
            index =>
            ({ tr, dispatch }) => {
              dispatch(addRowAt(index)(tr));
            },
          selectWholeTable:
            () =>
            ({ tr, dispatch }) => {
              dispatch(selectTable(tr));
            },
          setTableRowHeight:
            (height, pos, node) =>
            ({ tr, dispatch }) => {
              tr.setNodeMarkup(pos, undefined, { ...node.attrs, height });
              dispatch(tr);
            },
          distributeRows:
            () =>
            ({ tr, dispatch, state }) => {
              const rect = selectedRect(state);
              const { rows } = getRowsAndColsInSelection(state);
              const table = rect.table;
              const totalHeight = [...table.attrs.dimensions.rowsHeight]
                .splice(rows[0], rows[rows.length - 1])
                .reduce((curr, acc) => curr + acc, 0);
              const newHeight = totalHeight / rows.length;
              const rowsHeight = table.attrs.dimensions.rowsHeight.map((height, index) =>
                index >= rows[0] && index <= rows[rows.length - 1] ? newHeight : height
              );
              table.content.forEach((node, pos, index) => {
                rows.includes(index) &&
                  tr.setNodeMarkup(pos + rect.tableStart, undefined, {
                    ...node.attrs,
                    height: newHeight,
                  });
              });
              tr.setNodeMarkup(rect.tableStart - 1, undefined, {
                ...table.attrs,
                dimensions: { ...table.attrs.dimensions, rowsHeight },
              });
              dispatch(tr);
            },
          distributeColumns:
            () =>
            ({ tr, dispatch, state, view }) => {
              const rect = selectedRect(state);
              const { cols } = getRowsAndColsInSelection(state);
              const totalWidth = getTotalWidthInSelection(view);
              const rowNum = rect.map.height;
              const colNum = rect.map.width;
              const rowsIndexes = Array(rowNum).fill(0);
              rowsIndexes.forEach((_, row) =>
                cols.forEach(col => {
                  const mapIndex = row * colNum + col;
                  tr.setNodeMarkup(rect.tableStart + rect.map.map[mapIndex], null, {
                    colwidth: [totalWidth / cols.length],
                  });
                })
              );

              dispatch(tr);
            },
          setEditCell:
            () =>
            ({ tr, dispatch, state }) => {
              const $anchor = cellAround(state.selection.$anchor);
              if ($anchor) {
                tr.setMeta(TRANSACTION_META_KEYS.EDITING_CELL, { pos: $anchor });
                const selection = Selection.near($anchor, 1);
                tr.setSelection(selection);
                dispatch(tr);
              }
            },
          clearCell:
            () =>
            ({ tr, dispatch, state }) => {
              //FIX!!! the tr is not updated with new node size
              state.selection.forEachCell((node, pos) => {
                dispatch(tr.replaceWith(pos + 1, pos + node.nodeSize, ''));
              });
            },
          setCellBorderColor:
            color =>
            ({ chain }) => {
              chain()
                .focus()
                .setCellAttribute('borderColors', {
                  borderTop: color,
                  borderRight: color,
                  borderBottom: color,
                  borderLeft: color,
                })
                .run();
            },
          setOutsiderCellsBorderColor:
            color =>
            ({ state, dispatch, tr }) => {
              const map = TableMap.get(state.selection.$headCell.node(-1));
              const start = state.selection.$anchorCell.start(-1);

              state.selection.forEachCell((node, pos) => {
                const cellNeighbors = getCellNeighbors(map, start, pos);
                const isNeighborInSelection = neighbor =>
                  cellNeighbors[neighbor] &&
                  state.selection.ranges.find(
                    sel => sel.$from.pos - start - 1 === cellNeighbors[neighbor]
                  );

                const borders: {
                  borderTop?: string;
                  borderBottom?: string;
                  borderLeft?: string;
                  borderRight?: string;
                } = {};
                !isNeighborInSelection('top') && (borders.borderTop = color);
                !isNeighborInSelection('bottom') && (borders.borderBottom = color);
                !isNeighborInSelection('left') && (borders.borderLeft = color);
                !isNeighborInSelection('right') && (borders.borderRight = color);

                tr.setNodeMarkup(pos, null, {
                  ...node.attrs,
                  borderColors: { ...node.attrs.borderColors, ...borders },
                });
              });
              dispatch(tr);
            },
        };
      },

      addKeyboardShortcuts() {
        return keyboardShortcuts;
      },
    };
  },
};
