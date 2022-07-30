import type { ToolbarButton } from 'ricos-types';
import {
  PLUGIN_TOOLBAR_BUTTON_ID,
  decorateComponentWithProps,
} from 'wix-rich-content-editor-common';
import InsertModal from './modals/InsertModal';
import VideoSettingsModal from './modals/SettingsModal';
import { videoModals } from './constants';

export const getToolbarButtons = (config, services): ToolbarButton[] => {
  const { enableCustomUploadOnMobile, getVideoUrl, handleFileSelection, handleFileUpload } =
    config || {};

  const { modals } = services;
  const modalBaseProps = {
    enableCustomUploadOnMobile,
    getVideoUrl,
    handleFileSelection,
    handleFileUpload,
  };
  return [
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SIZE,
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
      id: PLUGIN_TOOLBAR_BUTTON_ID.SETTINGS,
      modal: {
        id: videoModals.settings,
        Component: VideoSettingsModal,
      },
      command: ({ isMobile, node }) => {
        modals?.openModal(videoModals.settings, {
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
      modal: {
        Component: decorateComponentWithProps(InsertModal, { modalId: videoModals.replace }),
        id: videoModals.replace,
      },
      command: ({ isMobile, node, referenceElement }) => {
        const {
          video: { src },
          id,
        } = node.attrs;
        if (modals?.isModalOpen(videoModals.replace)) {
          modals.closeModal(videoModals.replace);
        } else {
          modals?.openModal(videoModals.replace, {
            componentProps: {
              componentData: { isCustomVideo: src.id, src: src.url || src.id }, //TODO: convert to draft
              nodeId: id,
              ...modalBaseProps,
            },
            positioning: { placement: 'bottom', referenceElement },
            layout: isMobile ? 'fullscreen' : 'popover',
          });
        }
      },
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.DELETE,
    },
  ];
};
