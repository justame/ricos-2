import React from 'react';
import type { PluginContainerData_Width_Type } from 'ricos-schema';
import type { IToolbarItem, ToolbarButton } from 'ricos-types';
import {
  decorateComponentWithProps,
  PLUGIN_TOOLBAR_BUTTON_ID,
} from 'wix-rich-content-editor-common';
import {
  getVisibleOnlyOnDesktopResolver,
  selectedNodeResolver,
  Uploader,
} from 'wix-rich-content-plugin-commons';
import {
  AlignmentPanel,
  NodeAlignmentButton,
  NodeSizeButton,
  SizePanel,
} from 'wix-rich-content-toolbars-ui';
import { imageModals, IMAGE_BUTTONS } from './consts';
import ImageEditorModal from './modals/ImageEditorModal';
import ImageSettingsModal from './modals/SettingsModal';
import ImageEditorButton from './toolbar/ImageEditorButton';
import { ImagePluginService } from './toolbar/imagePluginService';
import { IMAGE_TYPE } from './types';

const imagePluginService = new ImagePluginService();

export const getToolbarButtons = (config, services): ToolbarButton[] => {
  const {
    modals,
    uploadService,
    updateService,
    context: { isMobile },
  } = services;

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
      attributes: {
        visible: getVisibleOnlyOnDesktopResolver(isMobile),
      },
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
      attributes: {
        visible: getVisibleOnlyOnDesktopResolver(isMobile),
      },
    },
    {
      id: imageModals.imageEditor,
      modal: {
        Component: decorateComponentWithProps(ImageEditorModal, {
          imagePluginService,
          imageEditorWixSettings: config.imageEditorWixSettings,
          onImageEditorOpen: config.onImageEditorOpen,
        }),
        id: imageModals.imageEditor,
      },
      dataHook: 'imageToolbarButton_image_editor',
      command: ({ src, attributes: { selectedNode } }) => {
        modals?.openModal(imageModals.imageEditor, {
          componentProps: {
            nodeId: selectedNode.attrs.id,
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
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SETTINGS,
      modal: {
        Component: ImageSettingsModal,
        id: imageModals.settings,
      },
      command: ({ isMobile, attributes: { selectedNode } }) => {
        modals?.openModal(imageModals.settings, {
          componentProps: {
            nodeId: selectedNode.attrs.id,
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
      command: ({ attributes: { selectedNode } }) => {
        if (config.handleFileSelection) {
          config.handleFileSelection(
            undefined,
            false,
            ({ data }) => {
              const file = Array.isArray(data) ? data[0] : data;
              updateService.updatePluginData(
                { data: file },
                selectedNode.attrs.id,
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
              selectedNode.attrs.id,
              new Uploader(handleFileUpload),
              IMAGE_TYPE,
              imagePluginService
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
