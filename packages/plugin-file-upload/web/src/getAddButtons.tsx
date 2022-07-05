import { InsertPluginIcon } from './icons';
import { INSERT_PLUGIN_BUTTONS, TOOLBARS } from 'wix-rich-content-editor-common';
import type { AddButton } from 'ricos-types';
import { FILE_UPLOAD_TYPE } from './types';
import { Uploader } from 'wix-rich-content-plugin-commons';

const handleExternalFileChange =
  (editorCommands, updateService, filePluginService) =>
  ({ data }) => {
    if (data instanceof Array) {
      data.forEach((file, index) => {
        setTimeout(() => {
          const nodeId = editorCommands.insertBlockWithBlankLines?.(
            FILE_UPLOAD_TYPE,
            {},
            { updateSelection: data.length === index + 1 }
          );
          updateService.updatePluginData(
            { data: file },
            nodeId,
            FILE_UPLOAD_TYPE,
            filePluginService
          );
        });
      });
    } else {
      const nodeId = editorCommands.insertBlockWithBlankLines?.(FILE_UPLOAD_TYPE, {});
      updateService.updatePluginData({ data }, nodeId, FILE_UPLOAD_TYPE, filePluginService);
    }
  };

const handleNativeFileChange =
  (editorCommands, uploadService, uploader, filePluginService) => (files: File[]) => {
    files.forEach((file, index) => {
      // prevents rerenders when next file starts uploading
      setTimeout(() => {
        const nodeId = editorCommands.insertBlockWithBlankLines?.(
          FILE_UPLOAD_TYPE,
          {},
          { updateSelection: files.length === index + 1 }
        );
        uploadService.uploadFile(file, nodeId, uploader, FILE_UPLOAD_TYPE, filePluginService);
      });
    });
  };

export const getAddButtons = (config, filePluginService): AddButton[] => {
  return [
    {
      id: 'file-upload',
      label: INSERT_PLUGIN_BUTTONS.FILE,
      dataHook: INSERT_PLUGIN_BUTTONS.FILE,
      icon: InsertPluginIcon,
      tooltip: 'FileUploadInsertButton_tooltip',
      toolbars: [TOOLBARS.MOBILE, TOOLBARS.FOOTER, TOOLBARS.SIDE],
      command: (editorCommands, uploadContext) => {
        if (uploadContext) {
          const { uploadService, updateService } = uploadContext;
          if (config.handleFileSelection) {
            config.handleFileSelection(
              handleExternalFileChange(editorCommands, updateService, filePluginService)
            );
          } else {
            const { accept = '*', multi = true, onFileSelected } = config;
            uploadService?.selectFiles(
              accept,
              multi,
              handleNativeFileChange(
                editorCommands,
                uploadService,
                new Uploader(onFileSelected),
                filePluginService
              )
            );
          }
          return true;
        }
        return false;
      },
      menuConfig: {
        tags: 'UploadFile_plugin_search_tags',
      },
    },
  ];
};
