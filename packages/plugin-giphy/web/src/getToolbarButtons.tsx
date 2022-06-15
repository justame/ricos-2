import type { PluginToolbarButtons } from 'ricos-types';
import {
  PLUGIN_TOOLBAR_BUTTON_ID,
  decorateComponentWithProps,
} from 'wix-rich-content-editor-common';
import InsertModal from './modals/InsertModal';
import { gifModals } from './types';

const RESOLVER_IDS = {
  SELECTED: 'IS_GIF_SELECTED',
};

export const getToolbarButtons = (config): PluginToolbarButtons => {
  return {
    buttons: [
      {
        id: PLUGIN_TOOLBAR_BUTTON_ID.ALIGN_LEFT,
      },
      {
        id: PLUGIN_TOOLBAR_BUTTON_ID.ALIGN_RIGHT,
      },
      {
        id: PLUGIN_TOOLBAR_BUTTON_ID.REPLACE,
        config: {
          command: ({ modalService, isMobile, node, referenceElement }) => {
            modalService?.openModal({
              Component: decorateComponentWithProps(InsertModal, {
                giphySdkApiKey: config?.giphySdkApiKey,
                componentData: node.attrs, //TODO: convert to draft
                nodeId: node.attrs.id,
              }),
              id: gifModals.insert,
              positioning: { placement: 'bottom', referenceElement },
              layout: isMobile ? 'fullscreen' : 'popover',
            });
          },
        },
      },
      {
        id: PLUGIN_TOOLBAR_BUTTON_ID.DELETE,
        // type: 'toggle',
        // config: {
        // icon: TrashIcon,
        // tooltip: 'Delete',
        // command: editorCommands => editorCommands.chain().focus().deleteSelection().run(),
        // attributes: {
        //   visible: RESOLVER_IDS.SELECTED,
        // },
        // },
      },
    ],
    // resolvers: {
    //   [RESOLVER_IDS.SELECTED]: content => content.length === 1 && content[0].type.name === 'gif',
    // },
  };
};
