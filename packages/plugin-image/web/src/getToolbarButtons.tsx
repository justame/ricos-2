import React from 'react';
import type { PluginToolbarButtons } from 'ricos-types';
import {
  PLUGIN_TOOLBAR_BUTTON_ID,
  decorateComponentWithProps,
} from 'wix-rich-content-editor-common';
import ImageSettingsModal from './modals/SettingsModal';
import { imageModals } from './consts';
import { IMAGE_TYPE } from './types';
import { ImagePluginService } from './toolbar/imagePluginService';
import { Uploader } from 'wix-rich-content-plugin-commons';
import { NodeSizeButton } from 'wix-rich-content-toolbars-ui';
import type { PluginContainerData_Width_Type } from 'ricos-schema';

const imagePluginService = new ImagePluginService();

export const getToolbarButtons = (config): PluginToolbarButtons => {
  return {
    buttons: [
      {
        id: PLUGIN_TOOLBAR_BUTTON_ID.SIZE,
        renderer: toolbarItem => (
          <NodeSizeButton
            toolbarItem={toolbarItem}
            options={
              ['SMALL', 'CONTENT', 'FULL_WIDTH', 'ORIGINAL'] as PluginContainerData_Width_Type[]
            }
          />
        ),
      },
      {
        id: PLUGIN_TOOLBAR_BUTTON_ID.ALIGNMENT,
      },
      {
        id: PLUGIN_TOOLBAR_BUTTON_ID.LINK,
      },
      {
        id: PLUGIN_TOOLBAR_BUTTON_ID.SETTINGS,
        config: {
          command: ({ modalService, isMobile, node }) => {
            modalService?.openModal({
              Component: decorateComponentWithProps(ImageSettingsModal, {
                nodeId: node.attrs.id,
              }),
              id: imageModals.settings,
              positioning: { placement: 'right' },
              layout: isMobile ? 'fullscreen' : 'drawer',
            });
          },
        },
      },
      {
        id: PLUGIN_TOOLBAR_BUTTON_ID.REPLACE,
        config: {
          tooltip: 'ReplaceImageButton_Tooltip',
          command: ({ node, uploadContext: { uploadService, updateService } }) => {
            if (config.handleFileSelection) {
              config.handleFileSelection(
                undefined,
                false,
                ({ data }) => {
                  const file = Array.isArray(data) ? data[0] : data;
                  updateService.updatePluginData(
                    { data: file },
                    node.attrs.id,
                    IMAGE_TYPE,
                    imagePluginService
                  );
                },
                undefined,
                {}
              );
            } else {
              const { accept = 'image/*', handleFileUpload } = config;
              uploadService.selectFiles(accept, false, (files: File[]) =>
                uploadService.uploadFile(
                  files[0],
                  node.attrs.id,
                  new Uploader(handleFileUpload),
                  IMAGE_TYPE,
                  imagePluginService
                )
              );
            }
          },
        },
      },
      {
        id: PLUGIN_TOOLBAR_BUTTON_ID.DELETE,
      },
    ],
  };
};
