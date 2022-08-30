import React from 'react';
import type { ToolbarButton } from 'ricos-types';
import {
  decorateComponentWithProps,
  PLUGIN_TOOLBAR_BUTTON_ID,
} from 'wix-rich-content-editor-common';
import { FILE_UPLOAD_TYPE } from './types';
import { Uploader, getVisibleOnlyOnDesktopResolver } from 'wix-rich-content-plugin-commons';
import {
  AlignmentPanel,
  NodeAlignmentButton,
  NodeSizeButton,
  SizePanel,
} from 'wix-rich-content-toolbars-ui';
import type { PluginContainerData_Width_Type } from 'ricos-schema';
import { FILE_BUTTONS } from './consts';

export const getToolbarButtons = (config, services, filePluginService): ToolbarButton[] => {
  const {
    context: { isMobile },
  } = services;

  return [
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SIZE,
      modal: {
        Component: decorateComponentWithProps(SizePanel, {
          options: ['SMALL', 'CONTENT'] as PluginContainerData_Width_Type[],
        }),
        id: FILE_BUTTONS.size,
      },
      renderer: toolbarItem => <NodeSizeButton id={FILE_BUTTONS.size} toolbarItem={toolbarItem} />,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
      attributes: {
        visible: getVisibleOnlyOnDesktopResolver(isMobile),
      },
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.ALIGNMENT,
      modal: {
        Component: AlignmentPanel,
        id: FILE_BUTTONS.alignment,
      },
      renderer: toolbarItem => (
        <NodeAlignmentButton toolbarItem={toolbarItem} id={FILE_BUTTONS.alignment} />
      ),
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
      attributes: {
        visible: getVisibleOnlyOnDesktopResolver(isMobile),
      },
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.REPLACE,
      tooltip: 'FileUploadReplaceButton_tooltip',
      command: ({ attributes: { selectedNode } }) => {
        const { updateService, uploadService } = services;
        if (config.handleFileSelection) {
          config.handleFileSelection(({ data }) => {
            const file = Array.isArray(data) ? data[0] : data;
            updateService.updatePluginData(
              { data: file },
              selectedNode.attrs.id,
              FILE_UPLOAD_TYPE,
              filePluginService
            );
          });
        } else {
          const { accept = 'image/*', onFileSelected } = config;
          uploadService.selectFiles(accept, false, (files: File[]) =>
            uploadService.uploadFile(
              files[0],
              selectedNode.attrs.id,
              new Uploader(onFileSelected),
              FILE_UPLOAD_TYPE,
              filePluginService
            )
          );
        }
      },
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.DELETE,
    },
  ];
};
