import React from 'react';
import type { ToolbarButton } from 'ricos-types';
import { linkPreviewModals } from './consts';
import { PLUGIN_TOOLBAR_BUTTON_ID } from 'wix-rich-content-editor-common';
import LinkPreviewSettingsModal from './modals/SettingsModal';
import { LinkPreviewSettingsButton } from './toolbar/SettingsButton';

const selectedNodeResolver = {
  id: 'selectedNode',
  resolve: content => {
    if (Array.isArray(content) && content.length > 0) {
      return content[0];
    } else {
      return undefined;
    }
  },
};

export const getToolbarButtons = (config, services): ToolbarButton[] => {
  const { modalService } = services;
  return [
    {
      id: 'linkPreviewSettings',
      modal: {
        Component: LinkPreviewSettingsModal,
        id: linkPreviewModals.settings,
      },
      command: ({ isMobile, node, referenceElement }) => {
        const isModalOpen = modalService.isModalOpen(linkPreviewModals.settings);
        isModalOpen
          ? modalService.closeModal(linkPreviewModals.settings)
          : modalService?.openModal(linkPreviewModals.settings, {
              componentProps: {
                nodeId: node.attrs.id,
                uiSettings: { linkPanel: config.linkPanelSettings },
              },
              positioning: { placement: 'bottom', referenceElement },
              layout: isMobile ? 'fullscreen' : 'popover',
            });
      },
      attributes: {
        selectedNode: selectedNodeResolver,
      },
      renderer: toolbarItem => <LinkPreviewSettingsButton toolbarItem={toolbarItem} />,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.DELETE,
    },
  ];
};
