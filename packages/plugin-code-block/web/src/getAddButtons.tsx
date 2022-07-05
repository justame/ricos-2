import InsertPluginIcon from './icons/CodeBlockIcon';
import { INSERT_PLUGIN_BUTTONS, TOOLBARS } from 'wix-rich-content-editor-common';
import type { AddButton } from 'ricos-types';
import { CODE_BLOCK_TYPE } from './types';

export const getAddButtons = (): AddButton[] => {
  return [
    {
      id: 'code-block',
      icon: InsertPluginIcon,
      label: INSERT_PLUGIN_BUTTONS.CODE_BLOCK,
      dataHook: INSERT_PLUGIN_BUTTONS.CODE_BLOCK,
      tooltip: 'TextCodeBlock_InsertButton_Tooltip',
      toolbars: [TOOLBARS.MOBILE, TOOLBARS.SIDE, TOOLBARS.FOOTER],
      command: editorCommands => {
        editorCommands.insertBlock(CODE_BLOCK_TYPE, {});
        return true;
      },
      menuConfig: {
        tags: 'codeBlock_plugin_search_tags',
        group: 'advanced',
      },
    },
  ];
};
