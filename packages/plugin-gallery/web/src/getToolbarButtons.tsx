import React from 'react';
import type { ToolbarButton } from 'ricos-types';
import {
  PLUGIN_TOOLBAR_BUTTON_ID,
  decorateComponentWithProps,
} from 'wix-rich-content-editor-common';
import { GALLERY_TYPE } from './types';
import { Uploader } from 'wix-rich-content-plugin-commons';
import { AddMediaIcon, ManageMediaNewIcon } from './icons';
import { GALLERY_LAYOUTS, layoutRicosData } from './layout-data-provider';
import { fileInputAccept, galleryModals } from './consts';
import GallerySettingsModal from './modals/SettingsModal';
import { GalleryLayoutButton } from './toolbar/GalleryLayoutButton';
import { TIPTAP_GALLERY_TYPE } from 'ricos-content';

const defaultData = {
  items: [],
  options: layoutRicosData[GALLERY_LAYOUTS.GRID],
};

export const getToolbarButtons = (config, galleryPluginService): ToolbarButton[] => {
  const { accept = fileInputAccept, handleFileUpload } = config;

  const handleFileSelection = (uploadService, updateService, node) => {
    if (config.handleFileSelection) {
      config.handleFileSelection(
        undefined,
        true,
        ({ data }) => {
          const files = Array.isArray(data) ? data : [data];
          files.forEach(file =>
            updateService.updatePluginData(
              { data: file },
              node.attrs.id,
              GALLERY_TYPE,
              galleryPluginService
            )
          );
        },
        undefined,
        defaultData
      );
    } else {
      uploadService.selectFiles(fileInputAccept, true, (files: File[]) =>
        files.forEach(file =>
          uploadService.uploadFile(
            file,
            node.attrs.id,
            new Uploader(handleFileUpload),
            GALLERY_TYPE,
            galleryPluginService
          )
        )
      );
    }
  };
  return [
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.REPLACE,
      icon: AddMediaIcon,
      tooltip: 'UploadMediaButton_Tooltip',
      command: ({ node, uploadContext: { uploadService, updateService } }) => {
        if (config.handleFileSelection) {
          config.handleFileSelection(
            undefined,
            true,
            ({ data }) => {
              const files = Array.isArray(data) ? data : [data];
              files.forEach(file =>
                updateService.updatePluginData(
                  { data: file },
                  node.attrs.id,
                  GALLERY_TYPE,
                  galleryPluginService
                )
              );
            },
            undefined,
            defaultData
          );
        } else {
          const {
            accept = '.jpg,.png,.gif,.jpeg,.jpe,.jfif,.bmp,.heic,.heif,.tfif,.tif,.webp',
            handleFileUpload,
          } = config;
          uploadService.selectFiles(accept, true, (files: File[]) =>
            files.forEach(file =>
              uploadService.uploadFile(
                file,
                node.attrs.id,
                new Uploader(handleFileUpload),
                GALLERY_TYPE,
                galleryPluginService
              )
            )
          );
        }
      },
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SETTINGS,
      modal: {
        id: galleryModals.manageMedia,
        Component: decorateComponentWithProps(GallerySettingsModal, { activeTab: 'manage_media' }),
      },
      icon: ManageMediaNewIcon,
      command: ({ modalService, isMobile, node, uploadService, updateService }) => {
        modalService?.openModal(galleryModals.manageMedia, {
          componentProps: {
            nodeId: node.attrs.id,
            handleFileSelection: () => handleFileSelection(uploadService, updateService, node),
            handleFileUpload,
            accept,
          },
          positioning: { placement: 'right' },
          layout: isMobile ? 'fullscreen' : 'drawer',
        });
      },
    },
    {
      id: 'galleryLayout',
      command: ({ layout, editorCommands }) => {
        editorCommands
          .chain()
          .focus()
          .updateAttributes(TIPTAP_GALLERY_TYPE, {
            options: layoutRicosData[layout],
          })
          .run();
      },
      renderer: toolbarItem => <GalleryLayoutButton toolbarItem={toolbarItem} />,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SIZE,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.ALIGNMENT,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SETTINGS,
      modal: {
        id: galleryModals.settings,
        Component: GallerySettingsModal,
      },
      command: ({ modalService, isMobile, node, uploadService, updateService }) => {
        modalService?.openModal(galleryModals.settings, {
          componentProps: {
            nodeId: node.attrs.id,
            handleFileSelection: () => handleFileSelection(uploadService, updateService, node),
            handleFileUpload,
            accept,
          },
          positioning: { placement: 'right' },
          layout: isMobile ? 'fullscreen' : 'drawer',
        });
      },
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.DELETE,
    },
  ];
};
