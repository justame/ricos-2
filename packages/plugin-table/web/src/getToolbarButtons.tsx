import React from 'react';
import type { ToolbarButton } from 'ricos-types';
import {
  decorateComponentWithProps,
  PLUGIN_TOOLBAR_BUTTON_ID,
} from 'wix-rich-content-editor-common';
import {
  TABLE_BUTTONS,
  TABLE_BUTTONS_DATA_HOOKS,
  TABLE_BUTTONS_MODALS_ID,
  CATEGORY,
  TABLE_COLOR_PICKER,
} from './consts';
import {
  FormattingButton,
  BackgroundColorButton,
  BorderButton,
  ContextButton,
  HeaderButton,
  VerticalAlignmentButton,
} from './toolbar/buttons';
import { BorderPanel, ContextPanel, VerticalAlignmentPanel } from './toolbar/modals';
import { TIPTAP_TABLE_CELL_TYPE } from 'wix-rich-content-common';
import { TableColorPicker } from './modals/TableColorPicker';
import { DEFAULT_PALETTE_BG } from './TableToolbar/CellFormattingButtonProps';
import { findTable } from 'prosemirror-utils';
import { TableQuery } from './tiptap/TableQuery';

export const getToolbarButtons = (config, services): ToolbarButton[] => {
  return [
    {
      id: TABLE_BUTTONS.FORMATTING,
      dataHook: TABLE_BUTTONS_DATA_HOOKS.FORMATTING,
      renderer: toolbarItem => <FormattingButton toolbarItem={toolbarItem} />,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
    },
    {
      id: TABLE_BUTTONS.VERTICAL_ALIGNMENT,
      dataHook: TABLE_BUTTONS_DATA_HOOKS.VERTICAL_ALIGNMENT,
      attributes: {
        cellAlignment: getCellAlignmentResolver,
      },
      modal: {
        id: TABLE_BUTTONS_MODALS_ID.VERTICAL_ALIGNMENT,
        Component: VerticalAlignmentPanel,
      },
      command: ({ verticalAlignment, editorCommands }) => {
        editorCommands.chain().focus().setCellAttribute('cellStyle', { verticalAlignment }).run();
      },
      renderer: toolbarItem => <VerticalAlignmentButton toolbarItem={toolbarItem} />,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
    },
    {
      id: TABLE_BUTTONS.BACKGROUND_COLOR,
      dataHook: TABLE_BUTTONS_DATA_HOOKS.BACKGROUND_COLOR,
      command: ({ backgroundColor, editorCommands }) => {
        editorCommands.chain().focus().setCellAttribute('cellStyle', { backgroundColor }).run();
      },
      attributes: {
        cellBackgroundColor: getCellBackgroundColorResolver,
      },
      modal: {
        id: TABLE_COLOR_PICKER,
        Component: decorateComponentWithProps(TableColorPicker, { palette: DEFAULT_PALETTE_BG }),
      },
      renderer: toolbarItem => <BackgroundColorButton toolbarItem={toolbarItem} />,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
    },
    {
      id: TABLE_BUTTONS.BORDER,
      dataHook: TABLE_BUTTONS_DATA_HOOKS.BORDER,
      command: ({ borders, outsideBorders, editorCommands }) => {
        borders
          ? editorCommands.chain().focus().setCellBorderColor(borders).run()
          : editorCommands.chain().focus().setOutsiderCellsBorderColor(outsideBorders).run();
      },
      attributes: {
        cellBorderColor: getCellBorderColorResolver,
        selectedCategory: getSelectionCategoryResolver,
      },
      modal: {
        id: TABLE_BUTTONS_MODALS_ID.BORDER,
        Component: BorderPanel,
      },
      renderer: toolbarItem => <BorderButton toolbarItem={toolbarItem} />,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
    },
    {
      id: TABLE_BUTTONS.ROW_HEADER,
      dataHook: TABLE_BUTTONS_DATA_HOOKS.ROW_HEADER,
      attributes: {
        visible: isFirstRowSelectedResolver,
      },
      command: ({ editorCommands }) => {
        editorCommands.chain().focus().toggleHeaderRow().run();
      },
      renderer: toolbarItem => <HeaderButton type={'row'} toolbarItem={toolbarItem} />,
    },
    {
      id: TABLE_BUTTONS.COLUMN_HEADER,
      dataHook: TABLE_BUTTONS_DATA_HOOKS.COLUMN_HEADER,
      attributes: {
        visible: isFirstColumnSelectedResolver,
      },
      command: ({ editorCommands }) => {
        editorCommands.chain().focus().toggleHeaderColumn().run();
      },
      renderer: toolbarItem => <HeaderButton type={'column'} toolbarItem={toolbarItem} />,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
      attributes: {
        visible: isFirstColumnOrRowSelectedResolver,
      },
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.DELETE,
      attributes: {
        selectedNode: selectedNodeResolver,
        visible: isTableSelectedResolver,
      },
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
      attributes: {
        visible: isTableSelectedResolver,
      },
    },
    {
      id: TABLE_BUTTONS.CONTEXT,
      dataHook: TABLE_BUTTONS_DATA_HOOKS.CONTEXT,
      command: ({ commandKey, editorCommands }) => {
        editorCommands.chain().focus()[commandKey]().run();
      },
      modal: {
        id: TABLE_BUTTONS_MODALS_ID.CONTEXT,
        Component: ContextPanel,
      },
      attributes: {
        selectedCategory: getSelectionCategoryResolver,
      },
      renderer: toolbarItem => <ContextButton toolbarItem={toolbarItem} />,
    },
  ];
};

const isFirstColumnSelectedResolver = {
  id: 'isFirstColumnSelectedResolver',
  resolve: (_, __, editor) => {
    if (findTable(editor.state.selection)) {
      const table = TableQuery.of(editor.state.selection);
      return table.isColumnSelected(0);
    } else {
      return false;
    }
  },
};

const isFirstRowSelectedResolver = {
  id: 'isFirstRowSelectedResolver',
  resolve: (_, __, editor) => {
    if (findTable(editor.state.selection)) {
      const table = TableQuery.of(editor.state.selection);
      return table.isRowSelected(0);
    } else {
      return false;
    }
  },
};

const isFirstColumnOrRowSelectedResolver = {
  id: 'isFirstColumnSelectedResolver',
  resolve: (_, __, editor) => {
    if (findTable(editor.state.selection)) {
      const table = TableQuery.of(editor.state.selection);
      return table.isRowSelected(0) || table.isColumnSelected(0);
    } else {
      return false;
    }
  },
};

const getCellAlignmentResolver = {
  id: 'cellAlignmentResolver',
  resolve: content => {
    if (Array.isArray(content) && content.length > 0) {
      return content.find(node => node.type.name === TIPTAP_TABLE_CELL_TYPE)?.attrs?.cellStyle
        ?.verticalAlignment;
    } else {
      return false;
    }
  },
};

const getCellBackgroundColorResolver = {
  id: 'cellBackgroundColorResolver',
  resolve: content => {
    if (Array.isArray(content) && content.length > 0) {
      return content.find(node => node.type.name === TIPTAP_TABLE_CELL_TYPE)?.attrs?.cellStyle
        ?.backgroundColor;
    } else {
      return false;
    }
  },
};

const getCellBorderColorResolver = {
  id: 'cellBorderColorResolver',
  resolve: content => {
    if (Array.isArray(content) && content.length > 0) {
      return content.find(node => node.type.name === TIPTAP_TABLE_CELL_TYPE)?.attrs?.borderColors
        ?.top;
    } else {
      return false;
    }
  },
};

const selectedNodeResolver = {
  id: 'selectedNode',
  resolve: (_, __, editor) => {
    if (findTable(editor.state.selection)) {
      const table = TableQuery.of(editor.state.selection);
      return table.getNode();
    } else {
      return undefined;
    }
  },
};

const isTableSelectedResolver = {
  id: 'isTableSelected',
  resolve: (_, __, editor) => {
    if (findTable(editor.state.selection)) {
      const table = TableQuery.of(editor.state.selection);
      return table.isTableSelected;
    } else {
      return false;
    }
  },
};

const getSelectionCategoryResolver = {
  id: 'getSelectedCategory',
  resolve: (_, __, editor) => {
    const { selection } = editor.state;
    if (findTable(selection)) {
      const table = TableQuery.of(selection);
      const isColSelected = selection.isColSelection?.();
      const isRowSelected = selection.isRowSelection?.();
      const isEntireTableSelected = table.isTableSelected();
      const isMultipleRowsSelected = table.getRowsIndexesInSelection().length > 1;
      const isMultipleColsSelected = table.getColsIndexesInSelection().length > 1;

      return (
        (isEntireTableSelected && CATEGORY.ENTIRE_TABLE) ||
        (isColSelected && CATEGORY.COLUMN) ||
        (isRowSelected && CATEGORY.ROW) ||
        (isMultipleRowsSelected && isMultipleColsSelected && CATEGORY.RANGE) ||
        (isMultipleRowsSelected && CATEGORY.ROW_RANGE) ||
        (isMultipleColsSelected && CATEGORY.COLUMN_RANGE) ||
        CATEGORY.CELL_BORDER
      );
    } else return undefined;
  },
};
