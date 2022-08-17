import {
  getNodeInSelectionResolver,
  isNodeContainsLinkOrAnchorResolver,
  getNodeAlignmentResolver,
  getNodeSizeResolver,
  getNodeLinkDataResolver,
} from 'wix-rich-content-toolbars-v3';
import { LinkIcon } from 'wix-rich-content-toolbars-ui';
import type { IToolbarItemConfigTiptap, IPluginsEvents } from 'ricos-types';
import { PLUGIN_TOOLBAR_BUTTON_ID } from 'wix-rich-content-editor-common';
import { createLink } from 'ricos-content/libs/nodeUtils';
import { convertRelObjectToString, convertRelStringToObject } from 'wix-rich-content-common';

type PluginButtonId = typeof PLUGIN_TOOLBAR_BUTTON_ID[keyof typeof PLUGIN_TOOLBAR_BUTTON_ID];

type IPluginToolbarButtonsConfig = Record<PluginButtonId, IToolbarItemConfigTiptap>;

export const getToolbarButtonsConfig: (
  pluginsEvents: IPluginsEvents
) => IPluginToolbarButtonsConfig = pluginsEvents => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete: {
    id: PLUGIN_TOOLBAR_BUTTON_ID.DELETE,
    type: 'toggle',
    attributes: {
      selectedNode: getNodeInSelectionResolver,
    },
    presentation: {
      dataHook: 'blockButton_delete',
    },
    commands: {
      delete:
        ({ editorCommands }) =>
        nodeId => {
          editorCommands
            .chain()
            .focus()
            .command(({ tr, commands }) => {
              const $from = tr.selection.$from;
              const selectedNode = $from.nodeAfter;
              commands.deleteNode(nodeId);
              pluginsEvents.publishPluginDelete(selectedNode.type.name);
            })
            .run();
        },
    },
  },
  alignment: {
    id: PLUGIN_TOOLBAR_BUTTON_ID.ALIGNMENT,
    type: 'modal',
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
          editorCommands
            .chain()
            .focus()
            .setNodeAlignment(alignment)
            .command(({ tr, commands }) => {
              const $from = tr.selection.$from;
              const selectedNode = $from.nodeAfter;
              const shouldUpdateSize =
                selectedNode?.attrs.containerData?.width?.size !== 'ORIGINAL' &&
                !selectedNode?.attrs.containerData?.width?.custom;
              shouldUpdateSize && commands.setNodeSize('SMALL');
              pluginsEvents.publishPluginToolbarClick({
                pluginId: selectedNode.type.name,
                nodeId: selectedNode?.attrs.id,
                buttonName: 'alignment',
                value: alignment,
              });

              return true;
            })
            .run();
        },
    },
  },
  size: {
    id: PLUGIN_TOOLBAR_BUTTON_ID.SIZE,
    type: 'modal',
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
          editorCommands
            .chain()
            .focus()
            .command(({ tr, commands }) => {
              commands.setNodeSize(size);
              const $from = tr.selection.$from;
              const selectedNode = $from.nodeAfter;
              pluginsEvents.publishPluginToolbarClick({
                pluginId: selectedNode.type.name,
                nodeId: selectedNode?.attrs.id,
                buttonName: 'size',
                value: size,
              });
            })
            .setNodeAlignment('CENTER')
            .run();
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
  separator: {
    id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
    type: 'separator',
    presentation: {},
    attributes: {},
    commands: {},
  },
});
