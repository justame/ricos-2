import { PluginKey } from 'prosemirror-state';

export const collapsibleModals = {
  settings: 'collapsibleSettings',
};

export const collapsibleStateManagerPlugin = new PluginKey('collapsibleStateManager');

export const collapsibleItemDropHandlerPlugin = new PluginKey('collapsibleItemDropHandler');

export const COLLAPSIBLE_EXPAND_STATE = {
  EXPANDED: 'expanded',
  FIRST: 'first_expanded',
  COLLAPSED: 'collapsed',
};
