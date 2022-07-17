import React from 'react';
import type { ToolbarButton } from 'ricos-types';
import {
  PLUGIN_TOOLBAR_BUTTON_ID,
  decorateComponentWithProps,
} from 'wix-rich-content-editor-common';
import AudioSettingsModal from './modals/SettingsModal';
import InsertModal from './modals/InsertModal';
import { audioModals, fileInputAccept } from './consts';
import { NodeSizeButton } from 'wix-rich-content-toolbars-ui';
import type { PluginContainerData_Width_Type } from 'ricos-schema';
import { Uploader } from 'wix-rich-content-plugin-commons';
import { AUDIO_TYPE } from './types';
import { DEFAULTS as defaultData } from './defaults';
import { AudioPluginService } from './toolbar/audioPluginService';

export const getToolbarButtons = (config): ToolbarButton[] => {
  const audioPluginService = new AudioPluginService();
  const { getAudioUrl, handleFileUpload, fetchData } = config || {};

  const handleFileSelection = (uploadService, node, updateEntity) => {
    if (config.handleFileSelection) {
      config.handleFileSelection(undefined, false, updateEntity, undefined, defaultData);
    } else {
      uploadService.selectFiles(fileInputAccept, true, (files: File[]) =>
        files.forEach(file =>
          uploadService.uploadFile(
            file,
            node.attrs.id,
            new Uploader(handleFileUpload),
            AUDIO_TYPE,
            audioPluginService
          )
        )
      );
    }
  };

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

      command: ({ modalService, isMobile, node, referenceElement }) => {
        const {
          audio: { src },
          id,
        } = node.attrs;
        if (modalService?.isModalOpen(audioModals.replace)) {
          modalService.closeModal(audioModals.replace);
        } else {
          modalService?.openModal(audioModals.replace, {
            componentProps: {
              componentData: node.attrs, //TODO: convert to draft
              nodeId: id,
              getAudioUrl,
              handleFileSelection,
              handleFileUpload,
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
      command: ({ modalService, isMobile, node, uploadService }) => {
        modalService?.openModal(audioModals.settings, {
          componentProps: {
            nodeId: node.attrs.id,
            handleFileSelection: updateEntity =>
              handleFileSelection(uploadService, node, updateEntity),
            handleFileUpload,
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
