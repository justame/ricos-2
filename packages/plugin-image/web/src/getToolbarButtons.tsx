import React from 'react';
import type { ToolbarButton, IToolbarItem } from 'ricos-types';
import {
  PLUGIN_TOOLBAR_BUTTON_ID,
  decorateComponentWithProps,
} from 'wix-rich-content-editor-common';
import ImageSettingsModal from './modals/SettingsModal';
import ImageEditorModal from './modals/ImageEditorModal';
import { imageModals } from './consts';
import { IMAGE_TYPE } from './types';
import { ImagePluginService } from './toolbar/imagePluginService';
import { Uploader } from 'wix-rich-content-plugin-commons';
import { NodeSizeButton } from 'wix-rich-content-toolbars-ui';
import type { PluginContainerData_Width_Type } from 'ricos-schema';
import ImageEditorButton from './toolbar/editImageButton';

const imagePluginService = new ImagePluginService();

const IMAGE_EDITOR_BUTTON_ID = 'IMAGE_EDITOR_BUTTON';

export const getToolbarButtons = (config): ToolbarButton[] => {
  return [
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
      modal: {
        Component: ImageSettingsModal,
        id: imageModals.settings,
      },
      command: ({ modalService, isMobile, node }) => {
        modalService?.openModal(imageModals.settings, {
          componentProps: {
            nodeId: node.attrs.id,
          },
          positioning: { placement: 'right' },
          layout: isMobile ? 'fullscreen' : 'drawer',
        });
      },
    },
    {
      id: IMAGE_EDITOR_BUTTON_ID,
      modal: {
        Component: decorateComponentWithProps(ImageEditorModal, {
          imagePluginService,
          imageEditorWixSettings: config.imageEditorWixSettings,
          onImageEditorOpen: config.onImageEditorOpen,
        }),
        id: imageModals.imageEditor,
      },
      command: ({ modalService, nodeId, src }) => {
        modalService?.openModal(imageModals.imageEditor, {
          componentProps: {
            nodeId,
            src,
            handleFileUpload: config.handleFileUpload,
          },
          positioning: { placement: 'top' },
          layout: 'fullscreen',
        });
      },
      renderer: (toolbarItem: IToolbarItem) => <ImageEditorButton toolbarItem={toolbarItem} />,
      attributes: {
        visible: {
          id: 'IS_IMAGE_EDIT_BUTTON_VISIBLE',
          resolve: () => !!config.imageEditorWixSettings,
        },
        selectedNode: selectedNodeResolver,
      },
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.REPLACE,
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
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.DELETE,
    },
  ];
};

const selectedNodeResolver = {
  id: 'selectedNode',
  resolve: content => {
    if (Array.isArray(content) && content.length > 0) {
      return content[0];
    } else {
      return undefined;
    }
  },
};
