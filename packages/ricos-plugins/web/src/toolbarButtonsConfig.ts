import {
  getNodeInSelectionResolver,
  isNodeContainsLinkOrAnchorResolver,
  getNodeAlignmentResolver,
  getNodeSizeResolver,
  getNodeLinkDataResolver,
} from 'wix-rich-content-toolbars-v3';
import { LinkIcon } from 'wix-rich-content-toolbars-ui';
import type { IToolbarItemConfigTiptap } from 'ricos-types';
import { PLUGIN_TOOLBAR_BUTTON_ID } from 'wix-rich-content-editor-common';
import { createLink } from 'ricos-content/libs/nodeUtils';
import { convertRelObjectToString, convertRelStringToObject } from 'wix-rich-content-common';

type PluginButtonId = typeof PLUGIN_TOOLBAR_BUTTON_ID[keyof typeof PLUGIN_TOOLBAR_BUTTON_ID];

type IPluginToolbarButtonsConfig = Record<PluginButtonId, IToolbarItemConfigTiptap>;

export const toolbarButtonsConfig: IPluginToolbarButtonsConfig = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete: {
    id: PLUGIN_TOOLBAR_BUTTON_ID.DELETE,
    type: 'toggle',
    attributes: {
      selectedNode: getNodeInSelectionResolver,
    },
    commands: {
      delete:
        ({ editorCommands }) =>
        nodeId => {
          editorCommands.chain().focus().deleteNode(nodeId).run();
        },
    },
  },
  alignment: {
    id: PLUGIN_TOOLBAR_BUTTON_ID.ALIGNMENT,
    type: 'toggle',
    attributes: {
      nodeAlignment: getNodeAlignmentResolver,
    },
    presentation: {
      dataHook: 'nodeAlignmentButton',
    },
    commands: {
      setAlignment:
        ({ editorCommands }) =>
        alignment => {
          editorCommands.chain().focus().setNodeAlignment(alignment).setNodeSize('SMALL').run();
        },
    },
  },
  size: {
    id: PLUGIN_TOOLBAR_BUTTON_ID.SIZE,
    type: 'toggle',
    attributes: {
      nodeSize: getNodeSizeResolver,
    },
    presentation: {
      dataHook: 'nodeSizeButton',
    },
    commands: {
      setSize:
        ({ editorCommands }) =>
        size => {
          editorCommands.chain().focus().setNodeSize(size).setNodeAlignment('CENTER').run();
        },
    },
  },
  settings: {
    id: PLUGIN_TOOLBAR_BUTTON_ID.SETTINGS,
    type: 'modal',
    presentation: {
      dataHook: 'baseToolbarButton_settings',
    },
    attributes: {
      selectedNode: getNodeInSelectionResolver,
    },
    commands: {},
  },
  replace: {
    id: PLUGIN_TOOLBAR_BUTTON_ID.REPLACE,
    type: 'toggle',
    presentation: {
      dataHook: 'baseToolbarButton_replace',
    },
    attributes: {
      selectedNode: getNodeInSelectionResolver,
    },
    commands: {},
  },
  link: {
    id: PLUGIN_TOOLBAR_BUTTON_ID.LINK,
    type: 'modal',
    presentation: {
      dataHook: 'LinkButton',
      tooltip: 'TextLinkButton_Tooltip',
      icon: LinkIcon,
    },
    attributes: {
      selectedNode: getNodeInSelectionResolver,
      active: isNodeContainsLinkOrAnchorResolver,
      linkData: getNodeLinkDataResolver,
    },
    commands: {
      insertLink:
        ({ editorCommands, attributes: { selectedNode } }) =>
        linkData => {
          const { rel, target, url } = linkData;
          const relValue = convertRelObjectToString(convertRelStringToObject(rel));
          const link = createLink({ url, rel: relValue, target });
          editorCommands.chain().focus().updateAttributes(selectedNode.type.name, { link }).run();
        },
      insertAnchor:
        ({ editorCommands, attributes: { selectedNode } }) =>
        anchor => {
          editorCommands
            .chain()
            .focus()
            .updateAttributes(selectedNode.type.name, { link: { anchor, target: 'SELF' } })
            .run();
        },
      removeLink:
        ({ editorCommands, attributes: { selectedNode } }) =>
        () => {
          const { link, ...attrs } = selectedNode.attrs;
          editorCommands.chain().focus().updateAttributes(attrs).run();
        },
      removeAnchor:
        ({ editorCommands, attributes: { selectedNode } }) =>
        () => {
          const { link, ...attrs } = selectedNode.attrs;
          editorCommands.chain().focus().updateAttributes(attrs).run();
        },
    },
  },
};
