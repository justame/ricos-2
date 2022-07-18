import { InsertPluginIcon } from './icons';
import { INSERT_PLUGIN_BUTTONS, TOOLBARS } from 'wix-rich-content-editor-common';
import type { AddButton } from 'ricos-types';
import { IMAGE_TYPE } from './types';
import { ImagePluginService } from './toolbar/imagePluginService';
import { Uploader } from 'wix-rich-content-plugin-commons';
import { RICOS_DEFAULTS } from './consts';

const imagePluginService = new ImagePluginService();

const handleExternalFileChange =
  (editorCommands, updateService) =>
  ({ data }) => {
    if (data instanceof Array) {
      data.forEach((file, index) => {
        setTimeout(() => {
          const nodeId = editorCommands.insertBlockWithBlankLines?.(IMAGE_TYPE, RICOS_DEFAULTS, {
            updateSelection: data.length === index + 1,
          });
          updateService.updatePluginData({ data: file }, nodeId, IMAGE_TYPE, imagePluginService);
        });
      });
    } else {
      const nodeId = editorCommands.insertBlockWithBlankLines?.(IMAGE_TYPE, RICOS_DEFAULTS);
      updateService.updatePluginData({ data }, nodeId, IMAGE_TYPE, imagePluginService);
    }
  };

const handleNativeFileChange = (editorCommands, uploadService, uploader) => (files: File[]) => {
  files.forEach((file, index) => {
    // prevents rerenders when next file starts uploading
    setTimeout(() => {
      const nodeId = editorCommands.insertBlockWithBlankLines?.(IMAGE_TYPE, RICOS_DEFAULTS, {
        updateSelection: files.length === index + 1,
      });
      uploadService.uploadFile(file, nodeId, uploader, IMAGE_TYPE, imagePluginService);
    });
  });
};

export const getAddButtons = (config): AddButton[] => {
  return [
    {
      id: 'image',
      label: INSERT_PLUGIN_BUTTONS.IMAGE,
      dataHook: INSERT_PLUGIN_BUTTONS.IMAGE,
      icon: InsertPluginIcon,
      tooltip: 'ImagePlugin_InsertButton_Tooltip',
      toolbars: [TOOLBARS.MOBILE, TOOLBARS.FOOTER, TOOLBARS.SIDE],

      command: (editorCommands, uploadService, updateService) => {
        if (uploadService && updateService) {
          if (config.handleFileSelection) {
            config.handleFileSelection(
              undefined,
              !!config.multi,
              handleExternalFileChange(editorCommands, updateService),
              undefined,
              RICOS_DEFAULTS
            );
          } else {
            const { accept = 'image/*', multi = true, handleFileUpload } = config;
            uploadService?.selectFiles(
              accept,
              multi,
              handleNativeFileChange(editorCommands, uploadService, new Uploader(handleFileUpload))
            );
          }
          return true;
        }
        return false;
      },
      menuConfig: {
        tags: 'Image_plugin_search_tags',
      },
    },
  ];
};
