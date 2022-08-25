import type { ComponentType } from 'react';
import type { ToolbarButtonProps } from './buttonTypes';
import type { EditorCommands } from './editorCommandsType';
import type { AddButton, MenuGroups } from './pluginTypes';
import type { ToolbarType } from './toolbarEnums';
import type { AddPluginMenuConfig, PluginButton } from './toolbarSettingsTypes';
import type { IToolbarItemConfigTiptap } from './toolbarTypes';

export type PluginMenuItem = {
  id: string;
  presentation: {
    label: string;
    icon: ComponentType;
    dataHook: string;
    tooltip: string;
  };
  getClickHandler: (
    editorCommands: EditorCommands,
    referenceElement?: HTMLElement | null
  ) => () => void;
  section: string;
};

export interface PluginAddButton {
  getButton: () => AddButton;

  getTags: () => string | undefined;

  getGroup: () => MenuGroups;

  equals: (button: PluginAddButton) => boolean;

  toToolbarItemConfig: () => IToolbarItemConfigTiptap;

  toExternalToolbarButtonConfig: (editorCommands: EditorCommands) => ToolbarButtonProps;

  toPluginMenuItem: () => PluginMenuItem;

  getToolbars: () => ToolbarType[];

  toToolbarButtonSettings: () => PluginButton;

  register: () => void;

  unregister: () => void;
}

export interface PluginAddButtons {
  asArray: () => PluginAddButton[];

  byGroup: (group: MenuGroups) => PluginAddButtons;

  byTag: (tag: string) => PluginAddButton[];

  register: (button: AddButton) => void;

  unregister: (button: AddButton) => void;

  toToolbarButtonsConfig: () => IToolbarItemConfigTiptap[];

  registerPluginMenuModal: (config?: AddPluginMenuConfig) => void;

  toToolbarItemsConfigs(): IToolbarItemConfigTiptap[];

  toExternalToolbarButtonsConfigs(
    editorCommands: EditorCommands
  ): Record<string, ToolbarButtonProps>;
}
