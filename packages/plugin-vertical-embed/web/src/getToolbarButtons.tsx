import type { ToolbarButton } from 'ricos-types';
import {
  PLUGIN_TOOLBAR_BUTTON_ID,
  decorateComponentWithProps,
} from 'wix-rich-content-editor-common';
import { verticalEmbedModals } from './constants';
import InsertModal from './modals/InsertModal';

export const getToolbarButtons = (config): ToolbarButton[] => {
  return [
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.REPLACE,
      modal: {
        Component: decorateComponentWithProps(InsertModal, {
          modalId: verticalEmbedModals.replace,
        }),
        id: verticalEmbedModals.replace,
      },
      command: ({ modalService, isMobile, node, referenceElement }) => {
        if (modalService?.isModalOpen(verticalEmbedModals.replace)) {
          modalService.closeModal(verticalEmbedModals.replace);
        } else {
          modalService?.openModal(verticalEmbedModals.replace, {
            componentProps: {
              verticalsApi: config?.verticalsApi,
              componentData: { type: node.attrs.type.toLowerCase() }, //TODO: convert to draft
              nodeId: node.attrs.id,
            },
            positioning: { placement: 'bottom', referenceElement },
            layout: isMobile ? 'fullscreen' : 'popover',
          });
        }
      },
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.DELETE,
    },
  ];
};
