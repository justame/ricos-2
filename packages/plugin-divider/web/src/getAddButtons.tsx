import InsertPluginIcon from './icons/InsertPluginIcon';
import { INSERT_PLUGIN_BUTTONS, TOOLBARS } from 'wix-rich-content-editor-common';
import type { AddButton } from 'ricos-types';
import { DIVIDER_TYPE } from './types';
import { DividerData_Width, Node_Type } from 'ricos-schema';

export const getAddButtons = (config, services): AddButton[] => {
  return [
    {
      id: Node_Type.DIVIDER,
      icon: InsertPluginIcon,
      label: INSERT_PLUGIN_BUTTONS.DIVIDER,
      dataHook: INSERT_PLUGIN_BUTTONS.DIVIDER,
      tooltip: 'DividerPlugin_InsertButton_Tooltip',
      toolbars: [TOOLBARS.MOBILE, TOOLBARS.FOOTER, TOOLBARS.SIDE],
      command: editorCommands => {
        editorCommands.insertBlockWithBlankLines(DIVIDER_TYPE, { width: DividerData_Width.LARGE });
        return true;
      },
      menuConfig: {
        tags: 'Divider_plugin_search_tags',
      },
    },
  ];
};
