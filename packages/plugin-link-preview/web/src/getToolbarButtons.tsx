import React from 'react';
import type { ToolbarButton } from 'ricos-types';
import { linkPreviewModals } from './consts';
import { PLUGIN_TOOLBAR_BUTTON_ID } from 'wix-rich-content-editor-common';
import LinkPreviewSettingsModal from './modals/SettingsModal';
import { LinkPreviewSettingsButton } from './toolbar/SettingsButton';
import { RemovePreviewButton } from './toolbar/RemovePreviewButton';
import { TIPTAP_EMBED_TYPE, TIPTAP_LINK_PREVIEW_TYPE } from 'wix-rich-content-common';
import { selectedNodeResolver } from 'wix-rich-content-plugin-commons';

const isLinkPreviewSelectedResolver = {
  id: 'isLinkPreviewSelected',
  resolve: content => {
    if (Array.isArray(content) && content.length > 0) {
      return content[0].type?.name === TIPTAP_LINK_PREVIEW_TYPE;
    } else {
      return false;
    }
  },
};

export const getToolbarButtons = (config, services): ToolbarButton[] => {
  const { modals } = services;
  return [
    {
      id: 'removePreview',
      dataHook: 'baseToolbarButton_replaceToLink',
      command: ({ editorCommands, attributes: { selectedNode } }) => {
        const link =
          selectedNode.type.name === TIPTAP_EMBED_TYPE
            ? selectedNode.attrs.src
            : selectedNode.attrs.link.url;
        editorCommands
          .chain()
          .focus()
          .insertContent(link + ' ')
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
      command: ({ isMobile, referenceElement, attributes: { selectedNode } }) => {
        const isModalOpen = modals.isModalOpen(linkPreviewModals.settings);
        isModalOpen
          ? modals.closeModal(linkPreviewModals.settings)
          : modals?.openModal(linkPreviewModals.settings, {
              componentProps: {
                nodeId: selectedNode.attrs.id,
                uiSettings: { linkPanel: config.linkPanelSettings },
              },
              positioning: { placement: 'bottom', referenceElement },
              layout: isMobile ? 'fullscreen' : 'popover',
            });
      },
      attributes: {
        selectedNode: selectedNodeResolver,
        visible: isLinkPreviewSelectedResolver,
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
