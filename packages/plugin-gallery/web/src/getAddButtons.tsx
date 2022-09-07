import { InsertPluginIcon } from './icons';
import { INSERT_PLUGIN_BUTTONS, TOOLBARS } from 'wix-rich-content-editor-common';
import type { AddButton } from 'ricos-types';
import { Node_Type } from 'ricos-types';
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
    const nodeId = editorCommands.insertBlockWithBlankLines(GALLERY_TYPE, defaultData);
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
    const nodeId = editorCommands.insertBlockWithBlankLines(GALLERY_TYPE, defaultData);
    files.forEach(file => {
      setTimeout(() => {
        uploadService.uploadFile(
          new File([file], file.name, { type: file.type }),
          nodeId,
          uploader,
          GALLERY_TYPE,
          galleryPluginService
        );
      }, 0);
    });
  };

export const getAddButtons = (config, services, galleryPluginService): AddButton[] => {
  return [
    {
      id: Node_Type.GALLERY,
      label: INSERT_PLUGIN_BUTTONS.GALLERY,
      dataHook: INSERT_PLUGIN_BUTTONS.GALLERY,
      icon: InsertPluginIcon,
      tooltip: 'GalleryPlugin_InsertButton_Tooltip',
      toolbars: [TOOLBARS.MOBILE, TOOLBARS.FOOTER, TOOLBARS.SIDE],
      command: editorCommands => {
        const { uploadService, updateService } = services;
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
      },
      menuConfig: {
        tags: 'Gallery_plugin_search_tags',
      },
    },
  ];
};
