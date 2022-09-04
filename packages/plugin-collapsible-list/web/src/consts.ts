import { PluginKey } from 'prosemirror-state';
import { Node_Type } from 'ricos-types';

export const collapsibleModals = {
  settings: `${Node_Type.COLLAPSIBLE_LIST}.settings`,
};

export const collapsibleStateManagerPlugin = new PluginKey('collapsibleStateManager');

export const collapsibleItemDropHandlerPlugin = new PluginKey('collapsibleItemDropHandler');

export const COLLAPSIBLE_EXPAND_STATE = {
  EXPANDED: 'expanded',
  FIRST: 'first_expanded',
  COLLAPSED: 'collapsed',
};
