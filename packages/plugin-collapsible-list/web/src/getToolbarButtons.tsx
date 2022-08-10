import { PLUGIN_TOOLBAR_BUTTON_ID } from 'wix-rich-content-editor-common';
import CollapsibleListSettings from './modals/SettingsModals';
import { collapsibleModals } from './consts';
import type { ToolbarButton } from 'ricos-types';
import { TIPTAP_COLLAPSIBLE_LIST_TYPE } from 'ricos-content';

export const getToolbarButtons = (config, services): ToolbarButton[] => {
  return [
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SETTINGS,
      modal: {
        Component: CollapsibleListSettings,
        id: collapsibleModals.settings,
      },
      command: ({ isMobile, node }) => {
        services.modals.openModal(collapsibleModals.settings, {
          componentProps: {
            nodeId: node.attrs.id,
          },
          positioning: { placement: 'right' },
          layout: isMobile ? 'fullscreen' : 'drawer',
        });
      },
      attributes: {
        selectedNode: selectedNodeResolver,
      },
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.DELETE,
      attributes: {
        selectedNode: selectedNodeResolver,
      },
    },
  ];
};

const selectedNodeResolver = {
  id: 'selectedNode',
  resolve: (_, __, editor) => {
    const { selection } = editor?.state || {};
    const node =
      selection?.from === selection?.to &&
      selection?.$anchor?.path?.find(node => node?.type?.name === TIPTAP_COLLAPSIBLE_LIST_TYPE);
    if (node) {
      return node;
    } else {
      return undefined;
    }
  },
};
