import React from 'react';
import type { ToolbarButton } from 'ricos-types';
import {
  PLUGIN_TOOLBAR_BUTTON_ID,
  decorateComponentWithProps,
} from 'wix-rich-content-editor-common';
import InsertModal from './modals/InsertModal';
import { gifModals } from './constants';
import { NodeSizeButton } from 'wix-rich-content-toolbars-ui';
import type { PluginContainerData_Width_Type } from 'ricos-schema';

export const getToolbarButtons = (config): ToolbarButton[] => {
  return [
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SIZE,
      renderer: toolbarItem => (
        <NodeSizeButton
          toolbarItem={toolbarItem}
          options={
            ['SMALL', 'CONTENT', 'FULL_WIDTH', 'ORIGINAL'] as PluginContainerData_Width_Type[]
          }
        />
      ),
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPERATOR,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.ALIGNMENT,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPERATOR,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.REPLACE,
      modal: {
        Component: decorateComponentWithProps(InsertModal, { modalId: gifModals.replace }),
        id: gifModals.replace,
      },
      command: ({ modalService, isMobile, node, referenceElement }) => {
        if (modalService?.isModalOpen(gifModals.replace)) {
          modalService.closeModal(gifModals.replace);
        } else {
          modalService?.openModal(gifModals.replace, {
            componentProps: {
              giphySdkApiKey: config?.giphySdkApiKey,
              componentData: node.attrs, //TODO: convert to draft
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
