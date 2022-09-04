import React from 'react';
import type { ToolbarButton } from 'ricos-types';
import {
  PLUGIN_TOOLBAR_BUTTON_ID,
  decorateComponentWithProps,
} from 'wix-rich-content-editor-common';
import AudioSettingsModal from './modals/SettingsModal';
import InsertModal from './modals/InsertModal';
import { audioModals, AUDIO_BUTTONS } from './consts';
import {
  NodeSizeButton,
  AlignmentPanel,
  SizePanel,
  NodeAlignmentButton,
} from 'wix-rich-content-toolbars-ui';
import type { PluginContainerData_Width_Type } from 'ricos-schema';
import {
  selectedNodeResolver,
  getVisibleOnlyOnDesktopResolver,
} from 'wix-rich-content-plugin-commons';
import AudioEditButton from './toolbar/AudioEditButton';

const isCustomAudioResolver = {
  id: 'isCustomAudio',
  resolve: content => {
    if (Array.isArray(content) && content.length > 0) {
      return !!content[0].attrs?.audio?.src?.id;
    } else {
      return false;
    }
  },
};

export const getToolbarButtons = (config, services): ToolbarButton[] => {
  const { getAudioUrl, fetchData } = config || {};
  const {
    modals,
    context: { isMobile },
  } = services;

  return [
    {
      id: audioModals.settings,
      dataHook: 'baseToolbarButton_settings',
      modal: {
        Component: AudioSettingsModal,
        id: audioModals.settings,
      },
      attributes: {
        visible: isCustomAudioResolver,
        selectedNode: selectedNodeResolver,
      },
      command: ({ isMobile, attributes: { selectedNode } }) => {
        modals?.openModal(audioModals.settings, {
          componentProps: {
            nodeId: selectedNode.attrs.id,
            handleFileSelection: config.handleFileSelection,
            handleFileUpload: config.handleFileUpload,
          },
          positioning: { placement: 'right' },
          layout: isMobile ? 'fullscreen' : 'drawer',
        });
      },
      renderer: toolbarItem => <AudioEditButton toolbarItem={toolbarItem} />,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SIZE,
      modal: {
        Component: decorateComponentWithProps(SizePanel, {
          options: ['SMALL', 'CONTENT'] as PluginContainerData_Width_Type[],
        }),
        id: AUDIO_BUTTONS.size,
      },
      renderer: toolbarItem => <NodeSizeButton id={AUDIO_BUTTONS.size} toolbarItem={toolbarItem} />,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
      attributes: {
        visible: getVisibleOnlyOnDesktopResolver(isMobile),
      },
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.ALIGNMENT,
      modal: {
        Component: AlignmentPanel,
        id: AUDIO_BUTTONS.alignment,
      },
      renderer: toolbarItem => (
        <NodeAlignmentButton toolbarItem={toolbarItem} id={AUDIO_BUTTONS.alignment} />
      ),
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
      attributes: {
        visible: getVisibleOnlyOnDesktopResolver(isMobile),
      },
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.REPLACE,
      modal: {
        Component: decorateComponentWithProps(InsertModal, { modalId: audioModals.replace }),
        id: audioModals.replace,
      },
      command: ({ isMobile, referenceElement, attributes: { selectedNode } }) => {
        const {
          audio: { src },
          id,
        } = selectedNode.attrs;
        if (modals.isModalOpen(audioModals.replace)) {
          modals.closeModal(audioModals.replace);
        } else {
          modals.openModal(audioModals.replace, {
            componentProps: {
              componentData: selectedNode.attrs, //TODO: convert to draft
              nodeId: id,
              getAudioUrl,
              handleFileSelection: config.handleFileSelection,
              handleFileUpload: config.handleFileUpload,
              fetchData,
              embedType: src.url,
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
