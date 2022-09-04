import { Node_Type } from 'ricos-types';

export const DIVIDER_SIZE_RESOLVER_ID = 'GET_DIVIDER_NODE_SIZE';
export const DIVIDER_STYLE_RESOLVER_ID = 'GET_DIVIDER_NODE_STYLE';

export const DIVIDER_SIZE_BUTTON_DATA_HOOK = 'dividerSizeDropdownButton';
export const DIVIDER_STYLE_BUTTON_DATA_HOOK = 'dividerStyleDropdownButton';
export const DIVIDER_ALIGNMENT_BUTTON_DATA_HOOK = 'dividerAlignment';

export const DIVIDER_BUTTONS = {
  size: `${Node_Type.DIVIDER}.size`,
  style: `${Node_Type.DIVIDER}.style`,
  alignment: `${Node_Type.DIVIDER}.alignment`,
};
