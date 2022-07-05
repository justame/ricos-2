import type { ToolbarButton } from 'ricos-types';
import { PLUGIN_TOOLBAR_BUTTON_ID } from 'wix-rich-content-editor-common';
import { verticalEmbedModals } from './constants';
import InsertModal from './modals/InsertModal';

export const getToolbarButtons = (config): ToolbarButton[] => {
  return [
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.REPLACE,
      modal: {
        Component: InsertModal,
        id: verticalEmbedModals.replace,
      },
      command: ({ modalService, isMobile, node, referenceElement }) => {
        modalService?.openModal(verticalEmbedModals.insert, {
          componentProps: {
            verticalsApi: config?.verticalsApi,
            componentData: { type: node.attrs.type.toLowerCase() }, //TODO: convert to draft
            nodeId: node.attrs.id,
          },
          positioning: { placement: 'bottom', referenceElement },
          layout: isMobile ? 'fullscreen' : 'popover',
        });
      },
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.DELETE,
    },
  ];
};
