import React from 'react';
import type { ToolbarButton } from 'ricos-types';
import {
  PLUGIN_TOOLBAR_BUTTON_ID,
  decorateComponentWithProps,
} from 'wix-rich-content-editor-common';
import AudioSettingsModal from './modals/SettingsModal';
import InsertModal from './modals/InsertModal';
import { audioModals } from './consts';
import { NodeSizeButton } from 'wix-rich-content-toolbars-ui';
import type { PluginContainerData_Width_Type } from 'ricos-schema';
import { DEFAULTS as defaultData } from './defaults';

export const getToolbarButtons = (config, services): ToolbarButton[] => {
  const { getAudioUrl, fetchData } = config || {};
  const { modalService } = services;

  const handleFileSelection = config.handleFileSelection
    ? updateEntity =>
        config.handleFileSelection(undefined, false, updateEntity, undefined, defaultData)
    : undefined;

  return [
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SIZE,
      renderer: toolbarItem => (
        <NodeSizeButton
          toolbarItem={toolbarItem}
          options={['SMALL', 'CONTENT'] as PluginContainerData_Width_Type[]}
        />
      ),
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.ALIGNMENT,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.REPLACE,
      modal: {
        Component: decorateComponentWithProps(InsertModal, { modalId: audioModals.replace }),
        id: audioModals.replace,
      },

      command: ({ isMobile, node, referenceElement }) => {
        const {
          audio: { src },
          id,
        } = node.attrs;
        if (modalService.isModalOpen(audioModals.replace)) {
          modalService.closeModal(audioModals.replace);
        } else {
          modalService.openModal(audioModals.replace, {
            componentProps: {
              componentData: node.attrs, //TODO: convert to draft
              nodeId: id,
              getAudioUrl,
              handleFileSelection,
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
      id: PLUGIN_TOOLBAR_BUTTON_ID.SETTINGS,
      modal: {
        Component: AudioSettingsModal,
        id: audioModals.settings,
      },
      command: ({ isMobile, node }) => {
        modalService?.openModal(audioModals.settings, {
          componentProps: {
            nodeId: node.attrs.id,
            handleFileSelection,
            handleFileUpload: config.handleFileUpload,
          },
          positioning: { placement: 'right' },
          layout: isMobile ? 'fullscreen' : 'drawer',
        });
      },
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.DELETE,
    },
  ];
};
