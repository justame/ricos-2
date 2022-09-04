import InsertPluginIcon from './icons/CodeBlockIcon';
import { INSERT_PLUGIN_BUTTONS, TOOLBARS } from 'wix-rich-content-editor-common';
import type { AddButton } from 'ricos-types';
import { Node_Type } from 'ricos-types';
import { CODE_BLOCK_TYPE } from './types';

export const getAddButtons = (config, services): AddButton[] => {
  return [
    {
      id: Node_Type.CODE_BLOCK,
      icon: InsertPluginIcon,
      label: INSERT_PLUGIN_BUTTONS.CODE_BLOCK,
      dataHook: INSERT_PLUGIN_BUTTONS.CODE_BLOCK,
      tooltip: 'TextCodeBlock_InsertButton_Tooltip',
      toolbars: [TOOLBARS.MOBILE, TOOLBARS.SIDE, TOOLBARS.FOOTER],
      command: editorCommands => {
        editorCommands.insertBlockWithBlankLines(CODE_BLOCK_TYPE, {});
        return true;
      },
      menuConfig: {
        tags: 'codeBlock_plugin_search_tags',
        group: 'advanced',
      },
    },
  ];
};
