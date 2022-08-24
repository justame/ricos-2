import React from 'react';
import type { ToolbarButton } from 'ricos-types';
import {
  PLUGIN_TOOLBAR_BUTTON_ID,
  decorateComponentWithProps,
} from 'wix-rich-content-editor-common';
import { AlignmentPanel, NodeAlignmentButton } from 'wix-rich-content-toolbars-ui';
import { buttonsModals, BUTTON_BUTTONS } from './constants';
import ButtonSettingsModal from './modals/SettingsModal';

export const getToolbarButtons = (config, services, type): ToolbarButton[] => {
  return [
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.ALIGNMENT,
      modal: {
        Component: AlignmentPanel,
        id: BUTTON_BUTTONS.alignment,
      },
      renderer: toolbarItem => (
        <NodeAlignmentButton toolbarItem={toolbarItem} id={BUTTON_BUTTONS.alignment} />
      ),
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SETTINGS,
      modal: {
        Component: decorateComponentWithProps(ButtonSettingsModal, {
          modalId: buttonsModals[type],
        }),
        id: buttonsModals[type],
      },
      command: ({ isMobile, attributes: { selectedNode } }) => {
        services.modals.openModal(buttonsModals[type], {
          componentProps: {
            nodeId: selectedNode.attrs.id,
            settings: config,
            type,
          },
          positioning: { placement: 'right' },
          layout: isMobile ? 'fullscreen' : 'drawer',
        });
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
