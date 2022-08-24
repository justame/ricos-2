import React from 'react';
import type { ToolbarButton } from 'ricos-types';
import {
  PLUGIN_TOOLBAR_BUTTON_ID,
  decorateComponentWithProps,
} from 'wix-rich-content-editor-common';
import InsertModal from './modals/InsertModal';
import { gifModals, GIF_BUTTONS } from './constants';
import {
  AlignmentPanel,
  NodeAlignmentButton,
  NodeSizeButton,
  SizePanel,
} from 'wix-rich-content-toolbars-ui';
import type { PluginContainerData_Width_Type } from 'ricos-schema';

export const getToolbarButtons = (config, services): ToolbarButton[] => {
  return [
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SIZE,
      modal: {
        Component: decorateComponentWithProps(SizePanel, {
          options: [
            'SMALL',
            'CONTENT',
            'FULL_WIDTH',
            'ORIGINAL',
          ] as PluginContainerData_Width_Type[],
        }),
        id: GIF_BUTTONS.size,
      },
      renderer: toolbarItem => <NodeSizeButton id={GIF_BUTTONS.size} toolbarItem={toolbarItem} />,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.ALIGNMENT,
      modal: {
        Component: AlignmentPanel,
        id: GIF_BUTTONS.alignment,
      },
      renderer: toolbarItem => (
        <NodeAlignmentButton toolbarItem={toolbarItem} id={GIF_BUTTONS.alignment} />
      ),
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.REPLACE,
      modal: {
        Component: decorateComponentWithProps(InsertModal, { modalId: gifModals.replace }),
        id: gifModals.replace,
      },
      command: ({ isMobile, referenceElement, attributes: { selectedNode } }) => {
        const { modals } = services;
        if (modals?.isModalOpen(gifModals.replace)) {
          modals.closeModal(gifModals.replace);
        } else {
          modals?.openModal(gifModals.replace, {
            componentProps: {
              giphySdkApiKey: config?.giphySdkApiKey,
              componentData: selectedNode.attrs, //TODO: convert to draft
              nodeId: selectedNode.attrs.id,
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
