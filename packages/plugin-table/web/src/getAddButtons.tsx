import { InsertPluginIcon } from './icons';
import {
  INSERT_PLUGIN_BUTTONS,
  decorateComponentWithProps,
  TOOLBARS,
} from 'wix-rich-content-editor-common';
import InsertModal from './modals/InsertModal';
import type { AddButton } from 'ricos-types';
import { getDefaultsSettings } from './tableUtil';
import { tableModals } from './types';

export const getAddButtons = (config, services): AddButton[] => {
  return [
    {
      id: 'table',
      label: INSERT_PLUGIN_BUTTONS.TABLE,
      dataHook: INSERT_PLUGIN_BUTTONS.TABLE,
      icon: InsertPluginIcon,
      tooltip: 'TablePlugin_InsertButton_Tooltip',
      toolbars: [TOOLBARS.MOBILE, TOOLBARS.FOOTER, TOOLBARS.SIDE],
      command: editorCommands => true,
      modal: {
        id: tableModals.insert,
        Component: decorateComponentWithProps(InsertModal, {
          componentData: getDefaultsSettings(),
        }),
      },
      menuConfig: {
        tags: 'Table_plugin_search_tags',
        group: 'advanced',
      },
    },
  ];
};
