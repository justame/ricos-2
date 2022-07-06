import type { ToolbarButton } from 'ricos-types';
import {
  PLUGIN_TOOLBAR_BUTTON_ID,
  decorateComponentWithProps,
} from 'wix-rich-content-editor-common';
import InsertModal from './modals/InsertModal';
import { videoModals } from './constants';

export const getToolbarButtons = (config): ToolbarButton[] => {
  const { enableCustomUploadOnMobile, getVideoUrl, handleFileSelection, handleFileUpload } =
    config || {};

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
      id: PLUGIN_TOOLBAR_BUTTON_ID.ALIGNMENT,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.REPLACE,
      modal: {
        Component: decorateComponentWithProps(InsertModal, { modalId: videoModals.replace }),
        id: videoModals.replace,
      },
      command: ({ modalService, isMobile, node, referenceElement }) => {
        const {
          video: { src },
          id,
        } = node.attrs;
        modalService?.openModal(videoModals.replace, {
          componentProps: {
            componentData: { isCustomVideo: src.id, src: src.url || src.id }, //TODO: convert to draft
            nodeId: id,
            ...modalBaseProps,
          },
          positioning: { placement: 'bottom', referenceElement },
          layout: isMobile ? 'fullscreen' : 'popover',
        });
      },
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.DELETE,
    },
  ];
};
