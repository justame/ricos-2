import type { PluginToolbarButtons } from 'ricos-types';
import { PLUGIN_TOOLBAR_BUTTON_ID } from 'wix-rich-content-editor-common';
import { buttonsModals } from './constants';
import ButtonSettingsModal from './modals/SettingsModal';

export const getToolbarButtons = (config, type): PluginToolbarButtons => {
  return {
    buttons: [
      {
        id: PLUGIN_TOOLBAR_BUTTON_ID.ALIGNMENT,
      },
      {
        id: PLUGIN_TOOLBAR_BUTTON_ID.SETTINGS,
        modal: {
          Component: ButtonSettingsModal,
          id: buttonsModals.settings,
        },
        config: {
          command: ({ modalService, isMobile, node }) => {
            modalService?.openModal(buttonsModals.settings, {
              componentProps: {
                nodeId: node.attrs.id,
                settings: config,
                type,
              },
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
