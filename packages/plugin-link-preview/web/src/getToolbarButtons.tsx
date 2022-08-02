import React from 'react';
import type { ToolbarButton } from 'ricos-types';
import { linkPreviewModals } from './consts';
import { PLUGIN_TOOLBAR_BUTTON_ID } from 'wix-rich-content-editor-common';
import LinkPreviewSettingsModal from './modals/SettingsModal';
import { LinkPreviewSettingsButton } from './toolbar/SettingsButton';
import { RemovePreviewButton } from './toolbar/RemovePreviewButton';

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
  const { modals } = services;
  return [
    {
      id: 'removePreview',
      dataHook: 'baseToolbarButton_replaceToLink',
      command: ({ editorCommands, node }) => {
        editorCommands
          .chain()
          .focus()
          .insertContent(node.attrs.link.url + ' ')
          .run();
      },
      attributes: {
        selectedNode: selectedNodeResolver,
      },
      renderer: toolbarItem => <RemovePreviewButton toolbarItem={toolbarItem} />,
    },
    {
      id: 'linkPreviewSettings',
      dataHook: 'LinkButton',
      modal: {
        Component: LinkPreviewSettingsModal,
        id: linkPreviewModals.settings,
      },
      command: ({ isMobile, node, referenceElement }) => {
        const isModalOpen = modals.isModalOpen(linkPreviewModals.settings);
        isModalOpen
          ? modals.closeModal(linkPreviewModals.settings)
          : modals?.openModal(linkPreviewModals.settings, {
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
