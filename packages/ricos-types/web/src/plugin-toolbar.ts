import type { ComponentType } from 'react';
import type { ToolbarButton } from './pluginTypes';
import type { IToolbarItemConfigTiptap } from './toolbarTypes';

export interface PluginToolbar {
  getButtons: () => PluginToolbarButton[];

  toToolbarItemsConfig: () => IToolbarItemConfigTiptap[];

  // eslint-disable-next-line @typescript-eslint/ban-types
  getToolbarButtonsRenderers: () => Record<string, Function>;

  isVisible: (selection) => boolean;

  register: () => void;

  unregister: () => void;
}

export interface PluginToolbarButton {
  getButton: () => ToolbarButton;

  equals: (button: PluginToolbarButton) => boolean;

  toToolbarItemConfig: () => IToolbarItemConfigTiptap;

  getRenderer: () => Record<string, ComponentType>;

  register: () => void;

  unregister: () => void;
}
