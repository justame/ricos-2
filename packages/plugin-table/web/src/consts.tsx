import type { ModalStyles } from 'wix-rich-content-common';
import { Node_Type } from 'wix-rich-content-common';
import type { bordersType } from './types';

const commonDesktopModalStyles: React.CSSProperties = {
  width: '362px',
  boxSizing: 'border-box',
  height: 'max-content',
  minHeight: '209px',
  overflow: 'visible',
  border: 'solid 1px rgba(51, 51, 51, 0.1)',
  display: 'block',
  position: 'absolute',
  zIndex: 6,
  padding: '20px',
};

export const externalPopupStyles: ModalStyles = Object.freeze({
  content: commonDesktopModalStyles,
});

export const DesktopFlyOutModalStyles: ModalStyles = Object.freeze({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 5,
  },
  content: {
    ...commonDesktopModalStyles,
    borderRadius: 'var(--ricos-settings-whitebox-border-radius, 2px)',
    boxShadow: 'var(--ricos-settings-whitebox-box-shadow, 0 0 10px 0 rgba(0, 0, 0, 0.06))',
  },
});

export const MOBILE_FULL_SCREEN_CUSTOM_STYLE: ModalStyles = Object.freeze({
  overlay: {
    backgroundColor: 'transparent',
  },
  content: {
    top: 0,
    left: 0,
    overflow: 'hidden',
    alignItems: 'center',
    display: 'flex',
    width: '100vw',
    justifyContent: 'center',
  },
});

export const COLORS = Object.freeze({
  color1: '#FFFFFF',
  color2: '#D5D4D4',
  color3: '#000000',
  color4: '#000000',
  color5: '#000000',
  color6: '#ABCAFF',
  color7: '#81B0FF',
  color8: '#0261FF',
  color9: '#0141AA',
  color10: '#012055',
});

export const SOURCE = {
  KEYBOARD_SHORTCUT: 'keyboard shortcut',
  PLUS_BUTTON: 'plus button',
  CONTEXT_MENU: 'context menu',
};

export const LOCATION = {
  RIGHT: 'right',
  LEFT: 'left',
  ABOVE: 'above',
  BELOW: 'below',
};

export const CATEGORY = {
  COLUMN: 'column',
  ROW: 'row',
  ENTIRE_TABLE: 'entire table',
  CELL_BORDER: 'cell border',
  ROW_HEADER: 'row header',
  COLUMN_HEADER: 'column header',
  CELL_FORMATTING: 'cell formatting',
  RANGE: 'range',
  ROW_RANGE: 'row range',
  COLUMN_RANGE: 'column range',
};

export const ACTION = {
  RESIZE: 'resize',
  REORDER: 'reorder',
};

export const BUTTON_NAME = {
  BORDER: 'border',
  HEADER: 'header',
};

export const ACTION_NAME = {
  COLUMN_ROW_ACTION: 'pluginTableColumnRowAction',
  ADD_COLUMN_ROW: 'tablePluginAddColumnRow',
  DELETE_COLUMN_ROW: 'tablePluginDeleteColumnRow',
  CONTEXT_MENU_CLICK: 'tablePluginClickOnOptionMenu',
  CONTEXT_MENU_OPTION_CLICK: 'tablePluginClickActionFromOptionMenu',
};

export const CELL_MANUAL_MIN_WIDTH = 65;
export const CELL_AUTO_MIN_WIDTH = 120;
export const ROW_DEFAULT_HEIGHT = 47;

export const TABLE_BUTTONS = {
  FORMATTING: `${Node_Type.TABLE}.formatting`,
  VERTICAL_ALIGNMENT: `${Node_Type.TABLE}.verticalAlignment`,
  BACKGROUND_COLOR: `${Node_Type.TABLE}.backgroundColor`,
  ROW_HEADER: `${Node_Type.TABLE}.rowHeader`,
  COLUMN_HEADER: `${Node_Type.TABLE}.columnHeader`,
  BORDER: `${Node_Type.TABLE}.border`,
  CONTEXT: `${Node_Type.TABLE}.contextMenu`,
};

export const TABLE_BUTTONS_DATA_HOOKS = {
  FORMATTING: 'text-style',
  BACKGROUND_COLOR: 'back-ground-color',
  VERTICAL_ALIGNMENT: 'VerticalAlignment',
  BORDER: 'border-color-buttons',
  CONTEXT: 'context-menu',
  ROW_HEADER: 'row-header',
  COLUMN_HEADER: 'col-header',
};

export const TABLE_BUTTONS_MODALS_ID = {
  BORDER: `${Node_Type.TABLE}.border`,
  VERTICAL_ALIGNMENT: `${Node_Type.TABLE}.verticalAlignment`,
  CONTEXT: `${Node_Type.TABLE}.contextMenu`,
};

export const TABLE_COMMANDS_KEYS = {
  CLEAR: 'clearCell',
  DELETE_TABLE: 'deleteTable',
  DELETE_ROW: 'deleteRow',
  DELETE_COLUMN: 'deleteColumn',
  INSERT_ABOVE: 'addRowBefore',
  INSERT_BELOW: 'addRowAfter',
  INSERT_LEFT: 'addColumnBefore',
  INSERT_RIGHT: 'addColumnAfter',
  MERGE_CELLS: 'mergeCells',
  SPLIT_CELL: 'splitCell',
  DISTRIBUTE_ROWS: 'distributeRows',
  DISTRIBUTE_COLUMNS: 'distributeColumns',
  SELECT_ROWS: 'selectRow',
  SELECT_COLUMNS: 'selectColumn',
};

export const TABLE_COLOR_PICKER = 'table-colorPicker';

export const BORDER_TYPES: {
  borders: bordersType;
  outsideBorders: bordersType;
} = { borders: 'borders', outsideBorders: 'outsideBorders' };
