import type { PluginToolbarButtons } from 'ricos-types';
import { PLUGIN_TOOLBAR_BUTTON_ID } from 'wix-rich-content-editor-common';
import { IMAGE_TYPE } from './types';
import { ImagePluginService } from './toolbar/imagePluginService';
import { Uploader } from 'wix-rich-content-plugin-commons';

const imagePluginService = new ImagePluginService();

export const getToolbarButtons = (config): PluginToolbarButtons => {
  return {
    buttons: [
      {
        id: PLUGIN_TOOLBAR_BUTTON_ID.REPLACE,
        config: {
          tooltip: 'ReplaceImageButton_Tooltip',
          command: ({ nodeId, uploadService, updateService }) => {
            if (config.handleFileSelection) {
              config.handleFileSelection(
                undefined,
                false,
                ({ data }) => {
                  const file = Array.isArray(data) ? data[0] : data;
                  updateService.updatePluginData(
                    { data: file },
                    nodeId,
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
                  nodeId,
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
        id: PLUGIN_TOOLBAR_BUTTON_ID.ALIGN_LEFT,
      },
      {
        id: PLUGIN_TOOLBAR_BUTTON_ID.ALIGN_CENTER,
      },
      {
        id: PLUGIN_TOOLBAR_BUTTON_ID.ALIGN_RIGHT,
      },
      {
        id: PLUGIN_TOOLBAR_BUTTON_ID.LINK,
      },
      {
        id: PLUGIN_TOOLBAR_BUTTON_ID.DELETE,
      },
    ],
  };
};
