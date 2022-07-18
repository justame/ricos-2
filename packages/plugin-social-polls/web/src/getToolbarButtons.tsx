import React from 'react';
import type { ToolbarButton } from 'ricos-types';
import { PLUGIN_TOOLBAR_BUTTON_ID } from 'wix-rich-content-editor-common';
import PollSettingsModal from './components/modals/SettingsModal';
import { pollModals } from './consts';
import { TABS } from './components/settings/constants';
import { PollDesignButton } from './toolbar/PollDesignButton'; //todo export default
import { TIPTAP_POLL_TYPE } from 'ricos-content';
import { PollLayoutButton } from './toolbar/PollLayoutButton';

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

const getCommandByTab =
  activeTab =>
  ({ modalService, isMobile, node }) => {
    modalService?.openModal(pollModals.settings, {
      componentProps: {
        nodeId: node.attrs.id,
        activeTab,
      },
      positioning: { placement: 'right' },
      layout: isMobile ? 'fullscreen' : 'drawer',
    });
  };

export const getToolbarButtons = (config): ToolbarButton[] => {
  return [
    {
      id: 'pollLayout',
      attributes: {
        selectedNode: selectedNodeResolver,
      },
      modal: {
        Component: PollSettingsModal,
        id: pollModals.layout,
      },
      command: ({ layout, editorCommands, modalService, isMobile, node }) => {
        !modalService &&
          editorCommands
            .chain()
            .focus()
            .updateAttributes(TIPTAP_POLL_TYPE, {
              layout: {
                poll: {
                  type: layout,
                  direction: 'LTR',
                  enableImage: true,
                },
              },
            })
            .run();
        modalService && getCommandByTab(TABS.LAYOUT)({ modalService, isMobile, node });
      },
      renderer: toolbarItem => <PollLayoutButton toolbarItem={toolbarItem} />,
    },
    {
      id: 'pollDesign',
      modal: {
        Component: PollSettingsModal,
        id: pollModals.design,
      },
      command: getCommandByTab(TABS.DESIGN),
      attributes: {
        selectedNode: selectedNodeResolver,
      },
      renderer: toolbarItem => <PollDesignButton toolbarItem={toolbarItem} />,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SETTINGS,
      modal: {
        Component: PollSettingsModal,
        id: pollModals.settings,
      },
      command: getCommandByTab(TABS.SETTINGS),
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.DELETE,
    },
  ];
};
