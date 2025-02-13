import { InsertPluginIcon } from './icons';
import { INSERT_PLUGIN_BUTTONS, TOOLBARS } from 'wix-rich-content-editor-common';
import type { AddButton } from 'ricos-types';
import { Node_Type } from 'ricos-types';
import { defaultCollapsibleItem } from './tiptap/defaults';
import { COLLAPSIBLE_LIST_TYPE } from './types';

export const getAddButtons = (config, services): AddButton[] => {
  return [
    {
      id: Node_Type.COLLAPSIBLE_LIST,
      icon: InsertPluginIcon,
      label: INSERT_PLUGIN_BUTTONS.COLLAPSIBLE_LIST,
      dataHook: INSERT_PLUGIN_BUTTONS.COLLAPSIBLE_LIST,
      tooltip: 'CollapsibleListPlugin_InsertButton_Tooltip',
      toolbars: [TOOLBARS.MOBILE, TOOLBARS.FOOTER, TOOLBARS.SIDE],
      command: editorCommands => {
        editorCommands.insertBlockWithBlankLines(COLLAPSIBLE_LIST_TYPE, {
          content: defaultCollapsibleItem,
        });
        return true;
      },
      menuConfig: {
        tags: 'CollapsibleList_plugin_search_tags',
        group: 'advanced',
      },
    },
  ];
};
