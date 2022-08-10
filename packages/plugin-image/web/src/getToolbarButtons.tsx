import React from 'react';
import type { ToolbarButton, IToolbarItem } from 'ricos-types';
import {
  PLUGIN_TOOLBAR_BUTTON_ID,
  decorateComponentWithProps,
} from 'wix-rich-content-editor-common';
import ImageSettingsModal from './modals/SettingsModal';
import ImageEditorModal from './modals/ImageEditorModal';
import { imageModals, IMAGE_BUTTONS } from './consts';
import { IMAGE_TYPE } from './types';
import { ImagePluginService } from './toolbar/imagePluginService';
import { Uploader, selectedNodeResolver } from 'wix-rich-content-plugin-commons';
import {
  AlignmentPanel,
  DropdownModal,
  NodeAlignmentButton,
  NodeSizeButton,
  SizePanel,
} from 'wix-rich-content-toolbars-ui';
import type { PluginContainerData_Alignment, PluginContainerData_Width_Type } from 'ricos-schema';
import ImageEditorButton from './toolbar/ImageEditorButton';

const imagePluginService = new ImagePluginService();

const IMAGE_EDITOR_BUTTON_ID = 'IMAGE_EDITOR_BUTTON';

export const getToolbarButtons = (config, services): ToolbarButton[] => {
  const { modals, uploadService, updateService } = services;
  return [
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SIZE,
      modal: {
        Component: decorateComponentWithProps(SizePanel, {
          options: [
            'SMALL',
            'CONTENT',
            'FULL_WIDTH',
            'ORIGINAL',
          ] as PluginContainerData_Width_Type[],
        }),
        id: IMAGE_BUTTONS.size,
      },
      renderer: toolbarItem => <NodeSizeButton id={IMAGE_BUTTONS.size} toolbarItem={toolbarItem} />,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.ALIGNMENT,
      modal: {
        Component: AlignmentPanel,
        id: IMAGE_BUTTONS.alignment,
      },
      renderer: toolbarItem => (
        <NodeAlignmentButton toolbarItem={toolbarItem} id={IMAGE_BUTTONS.alignment} />
      ),
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
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
      dataHook: 'imageToolbarButton_image_editor',
      command: ({ nodeId, src }) => {
        modals?.openModal(imageModals.imageEditor, {
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
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
      attributes: {
        visible: {
          id: 'IS_IMAGE_EDIT_BUTTON_VISIBLE',
          resolve: () => !!config.imageEditorWixSettings,
        },
      },
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
      command: ({ isMobile, node }) => {
        modals?.openModal(imageModals.settings, {
          componentProps: {
            nodeId: node.attrs.id,
          },
          positioning: { placement: 'right' },
          layout: isMobile ? 'fullscreen' : 'drawer',
        });
      },
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.REPLACE,
      tooltip: 'ReplaceImageButton_Tooltip',
      command: ({ node }) => {
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
