import { InsertPluginIcon } from './assets/icons';
import {
  INSERT_PLUGIN_BUTTONS,
  decorateComponentWithProps,
  TOOLBARS,
} from 'wix-rich-content-editor-common';
import type { AddButton } from 'ricos-types';
import { DEFAULT_COMPONENT_DATA, MEMBER_ROLES } from './defaults';
import InsertModal from './components/modals/InsertModal';
import { POLL_TYPE, pollModals } from './types';
import { merge } from 'lodash';

export const getAddButtons = (config): AddButton[] => {
  const componentData = merge(DEFAULT_COMPONENT_DATA, {
    poll: { settings: { voteRole: config?.voteRole || MEMBER_ROLES.ALL } },
  });
  return [
    {
      id: 'polls',
      label: INSERT_PLUGIN_BUTTONS.POLLS,
      icon: InsertPluginIcon,
      tooltip: 'Poll_InsertPoll_Tooltip',
      toolbars: [TOOLBARS.MOBILE, TOOLBARS.FOOTER, TOOLBARS.SIDE],
      command: editorCommands => {
        return true;
      },
      modal: {
        id: pollModals.insert,
        Component: decorateComponentWithProps(InsertModal, {
          componentData,
          pluginId: POLL_TYPE,
        }),
      },
      menuConfig: {
        tags: 'Poll_plugin_search_tags',
      },
    },
  ];
};
