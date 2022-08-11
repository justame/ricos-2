import React from 'react';
import type { ToolbarButton } from 'ricos-types';
import { PLUGIN_TOOLBAR_BUTTON_ID } from 'wix-rich-content-editor-common';
import { AlignmentPanel } from 'wix-rich-content-toolbars-ui';
import { DividerAlignmentButton } from './toolbar/buttons/DividerAlignmentButton';
import { DividerSizeButton } from './toolbar/buttons/DividerSizeButton';
import { DividerStyleButton } from './toolbar/buttons/DividerStyleButton';
import { TIPTAP_DIVIDER_TYPE } from 'ricos-content';
import {
  DIVIDER_SIZE_RESOLVER_ID,
  DIVIDER_STYLE_RESOLVER_ID,
  DIVIDER_SIZE_BUTTON_DATA_HOOK,
  DIVIDER_STYLE_BUTTON_DATA_HOOK,
  DIVIDER_BUTTONS,
  DIVIDER_SIZE_BUTTON_ID,
} from './const';
import LineStylePanel from './toolbar/modals/LineStylePanel';
import DividerSizePanel from './toolbar/modals/DividerSizePanel';
import { selectedNodeResolver } from 'wix-rich-content-plugin-commons';

const getNodeSizeResolver = {
  id: DIVIDER_SIZE_RESOLVER_ID,
  resolve: content => {
    if (Array.isArray(content) && content.length > 0) {
      return content[0].type === TIPTAP_DIVIDER_TYPE && content[0].attrs?.width;
    } else {
      return undefined;
    }
  },
};

const getNodeStyleResolver = {
  id: DIVIDER_STYLE_RESOLVER_ID,
  resolve: content => {
    if (Array.isArray(content) && content.length > 0) {
      return content[0].attrs?.lineStyle;
    } else {
      return undefined;
    }
  },
};

export const getToolbarButtons = (config, services): ToolbarButton[] => {
  return [
    {
      id: DIVIDER_BUTTONS.style,
      dataHook: DIVIDER_STYLE_BUTTON_DATA_HOOK,
      command: ({ lineStyle, editorCommands }) => {
        editorCommands
          .chain()
          .focus()
          .updateAttributes(TIPTAP_DIVIDER_TYPE, {
            lineStyle,
          })
          .run();
      },
      modal: {
        Component: LineStylePanel,
        id: DIVIDER_BUTTONS.style,
      },
      attributes: {
        nodeStyle: getNodeStyleResolver,
      },
      renderer: toolbarItem => (
        <DividerStyleButton toolbarItem={toolbarItem} id={DIVIDER_BUTTONS.style} />
      ),
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
    },
    {
      id: DIVIDER_BUTTONS.size,
      dataHook: DIVIDER_SIZE_BUTTON_DATA_HOOK,
      command: ({ size, editorCommands }) => {
        editorCommands
          .chain()
          .focus()
          .updateAttributes(TIPTAP_DIVIDER_TYPE, {
            width: size,
          })
          .run();
      },
      modal: {
        Component: DividerSizePanel,
        id: DIVIDER_BUTTONS.size,
      },
      attributes: {
        nodeSize: getNodeSizeResolver,
      },
      renderer: toolbarItem => (
        <DividerSizeButton toolbarItem={toolbarItem} id={DIVIDER_BUTTONS.size} />
      ),
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
    },
    {
      id: DIVIDER_SIZE_BUTTON_ID,
      dataHook: DIVIDER_BUTTONS.alignment,
      command: ({ alignment, editorCommands, node }) => {
        const nodeContainerData = node.attrs?.containerData;
        editorCommands
          .chain()
          .focus()
          .updateAttributes(TIPTAP_DIVIDER_TYPE, {
            alignment,
            containerData: { ...nodeContainerData, alignment },
          })
          .run();
      },
      modal: {
        Component: AlignmentPanel,
        id: DIVIDER_BUTTONS.alignment,
      },
      attributes: {
        selectedNode: selectedNodeResolver,
      },
      renderer: toolbarItem => (
        <DividerAlignmentButton id={DIVIDER_BUTTONS.alignment} toolbarItem={toolbarItem} />
      ),
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.DELETE,
    },
  ];
};
