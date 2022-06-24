import type { PluginToolbarButtons } from 'ricos-types';
import {
  PLUGIN_TOOLBAR_BUTTON_ID,
  decorateComponentWithProps,
} from 'wix-rich-content-editor-common';
import { buttonsModals } from './constants';
import ButtonSettingsModal from './modals/SettingsModal';

export const getToolbarButtons = (config, type): PluginToolbarButtons => {
  return {
    buttons: [
      {
        id: PLUGIN_TOOLBAR_BUTTON_ID.SETTINGS,
        config: {
          command: ({ modalService, isMobile, node }) => {
            modalService?.openModal({
              Component: decorateComponentWithProps(ButtonSettingsModal, {
                nodeId: node.attrs.id,
                settings: config,
                type,
              }),
              id: buttonsModals.settings,
              positioning: { placement: 'right' },
              layout: isMobile ? 'fullscreen' : 'drawer',
            });
          },
        },
      },
      {
        id: PLUGIN_TOOLBAR_BUTTON_ID.DELETE,
      },
    ],
  };
};
