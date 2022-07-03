import React from 'react';
import type { PluginToolbarButtons } from 'ricos-types';
import { PLUGIN_TOOLBAR_BUTTON_ID } from 'wix-rich-content-editor-common';
import InsertModal from './modals/InsertModal';
import { gifModals } from './constants';
import { NodeSizeButton } from 'wix-rich-content-toolbars-ui';
import type { PluginContainerData_Width_Type } from 'ricos-schema';

const RESOLVER_IDS = {
  SELECTED: 'IS_GIF_SELECTED',
};

export const getToolbarButtons = (config): PluginToolbarButtons => {
  return {
    buttons: [
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
        id: PLUGIN_TOOLBAR_BUTTON_ID.REPLACE,
        modal: {
          Component: InsertModal,
          id: gifModals.replace,
        },
        config: {
          command: ({ modalService, isMobile, node, referenceElement }) => {
            modalService?.openModal(gifModals.replace, {
              componentProps: {
                giphySdkApiKey: config?.giphySdkApiKey,
                componentData: node.attrs, //TODO: convert to draft
                nodeId: node.attrs.id,
              },
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
