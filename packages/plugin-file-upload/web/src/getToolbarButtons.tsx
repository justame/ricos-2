import React from 'react';
import type { ToolbarButton } from 'ricos-types';
import { PLUGIN_TOOLBAR_BUTTON_ID } from 'wix-rich-content-editor-common';
import { FILE_UPLOAD_TYPE } from './types';
import { Uploader } from 'wix-rich-content-plugin-commons';
import { NodeSizeButton } from 'wix-rich-content-toolbars-ui';
import type { PluginContainerData_Width_Type } from 'ricos-schema';

export const getToolbarButtons = (config, services, filePluginService): ToolbarButton[] => {
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
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.ALIGNMENT,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.REPLACE,
      tooltip: 'FileUploadReplaceButton_tooltip',
      command: ({ node }) => {
        const { updateService, uploadService } = services;
        if (config.handleFileSelection) {
          config.handleFileSelection(({ data }) => {
            const file = Array.isArray(data) ? data[0] : data;
            updateService.updatePluginData(
              { data: file },
              node.attrs.id,
              FILE_UPLOAD_TYPE,
              filePluginService
            );
          });
        } else {
          const { accept = 'image/*', onFileSelected } = config;
          uploadService.selectFiles(accept, false, (files: File[]) =>
            uploadService.uploadFile(
              files[0],
              node.attrs.id,
              new Uploader(onFileSelected),
              FILE_UPLOAD_TYPE,
              filePluginService
            )
          );
        }
      },
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.DELETE,
    },
  ];
};
