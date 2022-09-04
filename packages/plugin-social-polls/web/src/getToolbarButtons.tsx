import React from 'react';
import type { ToolbarButton } from 'ricos-types';
import { PLUGIN_TOOLBAR_BUTTON_ID } from 'wix-rich-content-editor-common';
import PollSettingsModal from './components/modals/SettingsModal';
import { pollModals, POLL_BUTTONS } from './consts';
import { TABS } from './components/settings/constants';
import { PollDesignButton } from './toolbar/PollDesignButton'; //todo export default
import { TIPTAP_POLL_TYPE } from 'ricos-content';
import { PollLayoutButton } from './toolbar/PollLayoutButton';
import PollLayoutPanel from './toolbar/PollLayoutPanel';
import { selectedNodeResolver } from 'wix-rich-content-plugin-commons';

export const getToolbarButtons = (config, services): ToolbarButton[] => {
  const { modals } = services;
  return [
    {
      id: POLL_BUTTONS.layout,
      dataHook: 'baseToolbarButton_layout',
      attributes: {
        selectedNode: selectedNodeResolver,
      },
      modal: {
        Component: PollLayoutPanel,
        id: POLL_BUTTONS.layout,
      },
      command: ({ value, editorCommands, attributes: { selectedNode } }) => {
        editorCommands
          .chain()
          .focus()
          .updateAttributes(TIPTAP_POLL_TYPE, {
            layout: {
              poll: { ...selectedNode.attrs.layout.poll, type: value },
            },
          })
          .run();
      },
      renderer: toolbarItem => (
        <PollLayoutButton toolbarItem={toolbarItem} id={POLL_BUTTONS.layout} />
      ),
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
    },
    {
      id: pollModals.design,
      dataHook: 'baseToolbarButton_design',
      modal: {
        Component: PollSettingsModal,
        id: pollModals.design,
      },
      command: ({ isMobile, attributes: { selectedNode } }) => {
        modals?.openModal(pollModals.settings, {
          componentProps: {
            nodeId: selectedNode.attrs.id,
            activeTab: TABS.DESIGN,
          },
          positioning: { placement: 'right' },
          layout: isMobile ? 'fullscreen' : 'drawer',
        });
      },
      attributes: {
        selectedNode: selectedNodeResolver,
      },
      renderer: toolbarItem => <PollDesignButton toolbarItem={toolbarItem} />,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SETTINGS,
      modal: {
        Component: PollSettingsModal,
        id: pollModals.settings,
      },
      command: ({ isMobile, attributes: { selectedNode } }) => {
        modals?.openModal(pollModals.settings, {
          componentProps: {
            nodeId: selectedNode.attrs.id,
            activeTab: TABS.SETTINGS,
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
