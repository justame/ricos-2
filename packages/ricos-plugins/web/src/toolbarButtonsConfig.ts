import {
  getNodeInSelectionResolver,
  isNodeContainsLinkOrAnchorResolver,
  getNodeAlignmentResolver,
  getNodeSizeResolver,
  getNodeLinkDataResolver,
} from 'wix-rich-content-toolbars-v3';
import { LinkIcon } from 'wix-rich-content-toolbars-ui';
import type { PluginToolbarButtonConfig } from 'ricos-types';
import { PLUGIN_TOOLBAR_BUTTON_ID } from 'wix-rich-content-editor-common';
import { createLink } from 'ricos-content/libs/nodeUtils';
import { convertRelObjectToString, convertRelStringToObject } from 'wix-rich-content-common';

type PluginButtonId = typeof PLUGIN_TOOLBAR_BUTTON_ID[keyof typeof PLUGIN_TOOLBAR_BUTTON_ID];

type IPluginToolbarButtonsConfig = (props: {
  isMobile: boolean;
}) => Record<PluginButtonId, PluginToolbarButtonConfig>;

export const toolbarButtonsConfig: IPluginToolbarButtonsConfig = ({ isMobile }) => ({
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
      delete: ({ editorCommands, attributes: { selectedNode } }) => {
        editorCommands.chain().focus().deleteNode(selectedNode.attrs.id).run();
      },
    },
  },
  alignment: {
    id: PLUGIN_TOOLBAR_BUTTON_ID.ALIGNMENT,
    type: 'modal',
    attributes: {
      nodeAlignment: getNodeAlignmentResolver,
      visible: {
        id: 'IS_ALIGNMENT_BUTTON_VISIBLE',
        resolve: () => !isMobile,
      },
    },
    presentation: {
      dataHook: 'nodeAlignmentButton',
    },
    commands: {
      setAlignment: ({ editorCommands, value, attributes: { selectedNode } }) => {
        editorCommands
          .chain()
          .focus()
          .setNodeAlignment(value)
          .command(({ commands }) => {
            const shouldUpdateSize =
              selectedNode?.attrs.containerData?.width?.size !== 'ORIGINAL' &&
              !selectedNode?.attrs.containerData?.width?.custom;
            shouldUpdateSize && commands.setNodeSize('SMALL');

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
      visible: {
        id: 'IS_SIZE_BUTTON_VISIBLE',
        resolve: () => !isMobile,
      },
    },
    presentation: {
      dataHook: 'nodeSizeButton',
    },
    commands: {
      setSize: ({ editorCommands, value }) => {
        editorCommands.chain().focus().setNodeSize(value).setNodeAlignment('CENTER').run();
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
      insertLink: ({ editorCommands, attributes: { selectedNode }, value }) => {
        const { rel, target, url } = value;
        const relValue = convertRelObjectToString(convertRelStringToObject(rel));
        const link = createLink({ url, rel: relValue, target });
        editorCommands.chain().focus().updateAttributes(selectedNode.type.name, { link }).run();
      },
      insertAnchor: ({ editorCommands, attributes: { selectedNode }, value }) => {
        editorCommands
          .chain()
          .focus()
          .updateAttributes(selectedNode.type.name, { link: { anchor: value, target: 'SELF' } })
          .run();
      },
      removeLink: ({ editorCommands, attributes: { selectedNode } }) => {
        const { link, ...attrs } = selectedNode.attrs;
        editorCommands.chain().focus().setNodeAttrsById(attrs.id, attrs).run();
      },
      removeAnchor: ({ editorCommands, attributes: { selectedNode } }) => {
        const { link, ...attrs } = selectedNode.attrs;
        editorCommands.chain().focus().setNodeAttrsById(attrs.id, attrs).run();
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
