import type { ToolbarButton } from 'ricos-types';
import {
  PLUGIN_TOOLBAR_BUTTON_ID,
  decorateComponentWithProps,
} from 'wix-rich-content-editor-common';
import { buttonsModals } from './constants';
import ButtonSettingsModal from './modals/SettingsModal';

export const getToolbarButtons = (config, type): ToolbarButton[] => {
  return [
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.ALIGNMENT,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPERATOR,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SETTINGS,
      modal: {
        Component: decorateComponentWithProps(ButtonSettingsModal, {
          modalId: buttonsModals[type],
        }),
        id: buttonsModals[type],
      },
      command: ({ modalService, isMobile, node }) => {
        modalService?.openModal(buttonsModals[type], {
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
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPERATOR,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.DELETE,
    },
  ];
};
