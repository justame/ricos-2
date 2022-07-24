import { PLUGIN_TOOLBAR_BUTTON_ID } from 'wix-rich-content-editor-common';
import CollapsibleListSettings from './modals/SettingsModals';
import { collapsibleModals } from './consts';
import type { ToolbarButton } from 'ricos-types';

export const getToolbarButtons = (config): ToolbarButton[] => {
  return [
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SETTINGS,
      modal: {
        Component: CollapsibleListSettings,
        id: collapsibleModals.settings,
      },
      command: ({ modalService, isMobile, node }) => {
        modalService?.openModal(collapsibleModals.settings, {
          componentProps: {
            nodeId: node.attrs.id,
          },
          positioning: { placement: 'right' },
          layout: isMobile ? 'fullscreen' : 'drawer',
        });
      },
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.DELETE,
    },
  ];
};
