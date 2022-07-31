import type { ToolbarButton } from 'ricos-types';
import {
  PLUGIN_TOOLBAR_BUTTON_ID,
  decorateComponentWithProps,
} from 'wix-rich-content-editor-common';
import { verticalEmbedModals } from './constants';
import InsertModal from './modals/InsertModal';

export const getToolbarButtons = (config, services): ToolbarButton[] => {
  const { modals } = services;
  return [
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.REPLACE,
      modal: {
        Component: decorateComponentWithProps(InsertModal, {
          modalId: verticalEmbedModals.replace,
        }),
        id: verticalEmbedModals.replace,
      },
      command: ({ isMobile, node, referenceElement }) => {
        if (modals?.isModalOpen(verticalEmbedModals.replace)) {
          modals.closeModal(verticalEmbedModals.replace);
        } else {
          modals?.openModal(verticalEmbedModals.replace, {
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
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.DELETE,
    },
  ];
};
