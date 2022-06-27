import type { PluginToolbarButtons } from 'ricos-types';
import {
  PLUGIN_TOOLBAR_BUTTON_ID,
  decorateComponentWithProps,
} from 'wix-rich-content-editor-common';
import InsertModal from './modals/InsertModal';
import { audioModals } from './consts';

export const getToolbarButtons = (config): PluginToolbarButtons => {
  const { getAudioUrl, handleFileSelection, handleFileUpload, fetchData } = config || {};

  return {
    buttons: [
      {
        id: PLUGIN_TOOLBAR_BUTTON_ID.ALIGNMENT,
      },
      {
        id: PLUGIN_TOOLBAR_BUTTON_ID.REPLACE,
        config: {
          command: ({ modalService, isMobile, node, referenceElement }) => {
            const {
              audio: { src },
              id,
            } = node.attrs;
            modalService?.openModal({
              Component: decorateComponentWithProps(InsertModal, {
                componentData: node.attrs, //TODO: convert to draft
                nodeId: id,
                getAudioUrl,
                handleFileSelection,
                handleFileUpload,
                fetchData,
                embedType: src.url,
              }),
              id: audioModals.insert,
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
