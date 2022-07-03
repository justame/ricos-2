import { InsertPluginIcon } from './icons';
import { INSERT_PLUGIN_BUTTONS, TOOLBARS } from 'wix-rich-content-editor-common';
import type { AddButton } from 'ricos-types';
import { GALLERY_TYPE } from './types';
import { Uploader } from 'wix-rich-content-plugin-commons';
import { GALLERY_LAYOUTS, layoutRicosData } from './layout-data-provider';

const defaultData = {
  items: [],
  options: layoutRicosData[GALLERY_LAYOUTS.GRID],
};

const handleExternalFileChange =
  (editorCommands, updateService, galleryPluginService) =>
  ({ data }) => {
    const nodeId = editorCommands.insertBlockWithBlankLines?.(GALLERY_TYPE, defaultData);
    if (data instanceof Array) {
      data.forEach(file => {
        setTimeout(() => {
          updateService.updatePluginData(
            { data: file },
            nodeId,
            GALLERY_TYPE,
            galleryPluginService
          );
        });
      });
    } else {
      updateService.updatePluginData({ data }, nodeId, GALLERY_TYPE, galleryPluginService);
    }
  };

const handleNativeFileChange =
  (editorCommands, uploadService, uploader, galleryPluginService) => (files: File[]) => {
    const nodeId = editorCommands.insertBlockWithBlankLines?.(GALLERY_TYPE, defaultData);
    files.forEach(file => {
      uploadService.uploadFile(file, nodeId, uploader, GALLERY_TYPE, galleryPluginService);
    });
  };

export const getAddButtons = (config, galleryPluginService): AddButton[] => {
  return [
    {
      id: 'gallery',
      label: INSERT_PLUGIN_BUTTONS.GALLERY,
      icon: InsertPluginIcon,
      tooltip: 'GalleryPlugin_InsertButton_Tooltip',
      toolbars: [TOOLBARS.MOBILE, TOOLBARS.FOOTER, TOOLBARS.SIDE],
      command: (editorCommands, uploadContext) => {
        if (uploadContext) {
          const { uploadService, updateService } = uploadContext;
          if (config.handleFileSelection) {
            config.handleFileSelection(
              undefined,
              true,
              handleExternalFileChange(editorCommands, updateService, galleryPluginService),
              undefined,
              defaultData
            );
          } else {
            const { accept = '*', multi = true, handleFileUpload } = config;
            uploadService?.selectFiles(
              accept,
              multi,
              handleNativeFileChange(
                editorCommands,
                uploadService,
                new Uploader(handleFileUpload),
                galleryPluginService
              )
            );
          }
          return true;
        }
        return false;
      },
      menuConfig: {
        tags: 'Gallery_plugin_search_tags',
      },
    },
  ];
};
