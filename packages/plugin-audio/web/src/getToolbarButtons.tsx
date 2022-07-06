import React from 'react';
import type { ToolbarButton } from 'ricos-types';
import {
  PLUGIN_TOOLBAR_BUTTON_ID,
  decorateComponentWithProps,
} from 'wix-rich-content-editor-common';
import InsertModal from './modals/InsertModal';
import { audioModals } from './consts';
import { NodeSizeButton } from 'wix-rich-content-toolbars-ui';
import type { PluginContainerData_Width_Type } from 'ricos-schema';

export const getToolbarButtons = (config): ToolbarButton[] => {
  const { getAudioUrl, handleFileSelection, handleFileUpload, fetchData } = config || {};

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
      },
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.DELETE,
    },
  ];
};
