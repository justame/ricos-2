import React from 'react';
import type { ToolbarButton } from 'ricos-types';
import {
  decorateComponentWithProps,
  PLUGIN_TOOLBAR_BUTTON_ID,
} from 'wix-rich-content-editor-common';
import { GALLERY_TYPE } from './types';
import { selectedNodeResolver, Uploader } from 'wix-rich-content-plugin-commons';
import { GALLERY_LAYOUTS, layoutRicosData } from './layout-data-provider';
import { fileInputAccept, galleryModals, GALLERY_BUTTONS } from './consts';
import GallerySettingsModal from './modals/SettingsModal';
import { GalleryLayoutButton } from './toolbar/buttons/GalleryLayoutButton';
import { TIPTAP_GALLERY_TYPE } from 'ricos-content';
import {
  AlignmentPanel,
  NodeAlignmentButton,
  NodeSizeButton,
  SizePanel,
} from 'wix-rich-content-toolbars-ui';
import type { PluginContainerData_Width_Type } from 'ricos-schema';
import GalleryLayoutPanel from './toolbar/GalleryLayoutPanel';
import GalleryManageMediaButton from './toolbar/buttons/GalleryManageMediaButton';
import GalleryAddMediaButton from './toolbar/buttons/GalleryAddMediaButton';

const defaultData = {
  items: [],
  options: layoutRicosData[GALLERY_LAYOUTS.GRID],
};

const selectedLayoutResolver = {
  id: 'selectedLayout',
  resolve: content => {
    if (Array.isArray(content) && content.length > 0) {
      return content[0].attrs.options?.layout.type;
    } else {
      return undefined;
    }
  },
};

const isValidIndex = (index?: number): index is number => typeof index === 'number' && index >= 0;

export const getToolbarButtons = (config, services, galleryPluginService): ToolbarButton[] => {
  const { accept = fileInputAccept } = config;

  const handleFileSelection = (uploadService, updateService, node, index?: number) => {
    if (config.handleFileSelection) {
      config.handleFileSelection(
        undefined,
        true,
        ({ data }) => {
          const files = Array.isArray(data) ? data : [data];
          files.forEach((file, currIndex) => {
            const fileState = isValidIndex(index) ? { itemIndex: index + currIndex } : {};
            updateService.updatePluginData(
              { data: file },
              node.attrs.id,
              GALLERY_TYPE,
              galleryPluginService,
              fileState
            );
          });
        },
        undefined,
        defaultData
      );
    } else {
      uploadService.selectFiles(fileInputAccept, true, (files: File[]) =>
        files.forEach((file, currIndex) => {
          const fileState = isValidIndex(index) ? { itemIndex: index + currIndex } : {};
          uploadService.uploadFile(
            file,
            node.attrs.id,
            new Uploader(config.handleFileUpload),
            GALLERY_TYPE,
            galleryPluginService,
            fileState
          );
        })
      );
    }
  };

  const { modals, uploadService, updateService } = services;

  return [
    {
      id: GALLERY_BUTTONS.addMedia,
      dataHook: 'baseToolbarButton_add',
      command: ({ node }) => {
        handleFileSelection(uploadService, updateService, node);
      },
      attributes: {
        selectedNode: selectedNodeResolver,
      },
      renderer: toolbarItem => <GalleryAddMediaButton toolbarItem={toolbarItem} />,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
    },
    {
      id: GALLERY_BUTTONS.mangeMedia,
      dataHook: 'baseToolbarButton_manage_media',
      modal: {
        id: galleryModals.manageMedia,
        Component: GallerySettingsModal,
      },
      command: ({ isMobile, node }) => {
        modals?.openModal(galleryModals.manageMedia, {
          componentProps: {
            nodeId: node.attrs.id,
            handleFileSelection: (index?: number) =>
              handleFileSelection(uploadService, updateService, node, index),
            handleFileUpload: config.handleFileUpload,
            accept,
            activeTab: 'manage_media',
          },
          positioning: { placement: 'right' },
          layout: isMobile ? 'fullscreen' : 'drawer',
        });
      },
      attributes: {
        selectedNode: selectedNodeResolver,
      },
      renderer: toolbarItem => <GalleryManageMediaButton toolbarItem={toolbarItem} />,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
    },
    {
      id: GALLERY_BUTTONS.layout,
      dataHook: 'baseToolbarButton_layout',
      command: ({ layout, editorCommands }) => {
        const {
          selection: { anchor: pos },
        } = editorCommands.state;
        editorCommands
          .chain()
          .focus()
          .updateAttributes(TIPTAP_GALLERY_TYPE, {
            options: layoutRicosData[layout],
          })
          .run();
        setTimeout(() => editorCommands.chain().focus().setNodeSelection(pos).run(), 50);
      },
      attributes: {
        layout: selectedLayoutResolver,
        selectedNode: selectedNodeResolver,
      },
      modal: {
        Component: decorateComponentWithProps(GalleryLayoutPanel, {
          handleFileSelection: node => handleFileSelection(uploadService, updateService, node),
          handleFileUpload: config.handleFileUpload,
          accept,
          activeTab: 'advanced_settings',
        }),
        id: GALLERY_BUTTONS.layout,
      },
      renderer: toolbarItem => (
        <GalleryLayoutButton toolbarItem={toolbarItem} id={GALLERY_BUTTONS.layout} />
      ),
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
    },
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
        id: GALLERY_BUTTONS.size,
      },
      renderer: toolbarItem => (
        <NodeSizeButton id={GALLERY_BUTTONS.size} toolbarItem={toolbarItem} />
      ),
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.ALIGNMENT,
      modal: {
        Component: AlignmentPanel,
        id: GALLERY_BUTTONS.alignment,
      },
      renderer: toolbarItem => (
        <NodeAlignmentButton toolbarItem={toolbarItem} id={GALLERY_BUTTONS.alignment} />
      ),
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SETTINGS,
      modal: {
        id: galleryModals.settings,
        Component: GallerySettingsModal,
      },
      command: ({ isMobile, node }) => {
        modals?.openModal(galleryModals.settings, {
          componentProps: {
            nodeId: node.attrs.id,
            handleFileSelection: (index?: number) =>
              handleFileSelection(uploadService, updateService, node, index),
            handleFileUpload: config.handleFileUpload,
            accept,
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
      id: PLUGIN_TOOLBAR_BUTTON_ID.DELETE,
    },
  ];
};
