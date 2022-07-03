import type { PluginToolbarButtons } from 'ricos-types';
import { PLUGIN_TOOLBAR_BUTTON_ID } from 'wix-rich-content-editor-common';
import { GALLERY_TYPE } from './types';
import { Uploader } from 'wix-rich-content-plugin-commons';
import { AddMediaIcon } from './icons';
import { GALLERY_LAYOUTS, layoutRicosData } from './layout-data-provider';

const defaultData = {
  items: [],
  options: layoutRicosData[GALLERY_LAYOUTS.GRID],
};

export const getToolbarButtons = (config, galleryPluginService): PluginToolbarButtons => {
  return {
    buttons: [
      {
        id: PLUGIN_TOOLBAR_BUTTON_ID.REPLACE,
        config: {
          icon: AddMediaIcon,
          tooltip: 'UploadMediaButton_Tooltip',
          command: ({ node, uploadContext: { uploadService, updateService } }) => {
            if (config.handleFileSelection) {
              config.handleFileSelection(
                undefined,
                true,
                ({ data }) => {
                  const files = Array.isArray(data) ? data : [data];
                  files.forEach(file =>
                    updateService.updatePluginData(
                      { data: file },
                      node.attrs.id,
                      GALLERY_TYPE,
                      galleryPluginService
                    )
                  );
                },
                undefined,
                defaultData
              );
            } else {
              const {
                accept = '.jpg,.png,.gif,.jpeg,.jpe,.jfif,.bmp,.heic,.heif,.tfif,.tif,.webp',
                handleFileUpload,
              } = config;
              uploadService.selectFiles(accept, true, (files: File[]) =>
                files.forEach(file =>
                  uploadService.uploadFile(
                    file,
                    node.attrs.id,
                    new Uploader(handleFileUpload),
                    GALLERY_TYPE,
                    galleryPluginService
                  )
                )
              );
            }
          },
        },
      },
      {
        id: PLUGIN_TOOLBAR_BUTTON_ID.SIZE,
      },
      {
        id: PLUGIN_TOOLBAR_BUTTON_ID.ALIGNMENT,
      },
      {
        id: PLUGIN_TOOLBAR_BUTTON_ID.DELETE,
      },
    ],
  };
};
