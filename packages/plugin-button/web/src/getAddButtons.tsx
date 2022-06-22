import { InsertPluginIcon } from './icons';
import { INSERT_PLUGIN_BUTTONS } from 'wix-rich-content-editor-common';
import type { AddButton } from 'ricos-types';
import buttonDataDefaults from 'ricos-schema/dist/statics/button.defaults.json';

export const getAddButtons = (config, type): AddButton[] => {
  return [
    {
      id: 'button',
      label: INSERT_PLUGIN_BUTTONS.BUTTON,
      icon: InsertPluginIcon,
      tooltip: config?.insertButtonTooltip || 'ButtonPlugin_InsertButton_Tooltip',
      command: editorCommands => {
        editorCommands.insertBlock(type, buttonDataDefaults);
        return true;
      },
      menuConfig: {
        tags: 'Button_plugin_search_tags',
        group: 'advanced',
      },
    },
  ];
};
