import { InsertPluginIcon } from './icons';
import {
  INSERT_PLUGIN_BUTTONS,
  decorateComponentWithProps,
  TOOLBARS,
} from 'wix-rich-content-editor-common';
import type { AddButton } from 'ricos-types';
import { DEFAULTS, gifModals } from './constants';
import InsertModal from './modals/InsertModal';

export const getAddButtons = (config, services): AddButton[] => {
  return [
    {
      id: 'gif',
      label: INSERT_PLUGIN_BUTTONS.GIF,
      dataHook: INSERT_PLUGIN_BUTTONS.GIF,
      icon: InsertPluginIcon,
      tooltip: 'GiphyPlugin_InsertButton_Tooltip',
      toolbars: [TOOLBARS.MOBILE, TOOLBARS.FOOTER, TOOLBARS.SIDE],
      command: editorCommands => true,
      modal: {
        id: gifModals.insert,
        Component: decorateComponentWithProps(InsertModal, {
          giphySdkApiKey: config?.giphySdkApiKey,
          componentData: DEFAULTS,
          modalId: gifModals.insert,
        }),
      },
      menuConfig: {
        tags: 'Gif_plugin_search_tags',
      },
    },
  ];
};
