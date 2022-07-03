import type { PluginToolbarButtons } from 'ricos-types';
import { PLUGIN_TOOLBAR_BUTTON_ID } from 'wix-rich-content-editor-common';
import InsertModal from './modals/InsertModal';
import { videoModals } from './constants';

export const getToolbarButtons = (config): PluginToolbarButtons => {
  const { enableCustomUploadOnMobile, getVideoUrl, handleFileSelection, handleFileUpload } =
    config || {};

  const modalBaseProps = {
    enableCustomUploadOnMobile,
    getVideoUrl,
    handleFileSelection,
    handleFileUpload,
  };
  return {
    buttons: [
      {
        id: PLUGIN_TOOLBAR_BUTTON_ID.SIZE,
      },
      {
        id: PLUGIN_TOOLBAR_BUTTON_ID.ALIGNMENT,
      },
      {
        id: PLUGIN_TOOLBAR_BUTTON_ID.REPLACE,
        modal: {
          Component: InsertModal,
          id: videoModals.replace,
        },
        config: {
          command: ({ modalService, isMobile, node, referenceElement }) => {
            const {
              video: { src },
              id,
            } = node.attrs;
            modalService?.openModal(videoModals.insert, {
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
      },
      {
        id: PLUGIN_TOOLBAR_BUTTON_ID.DELETE,
      },
    ],
  };
};
