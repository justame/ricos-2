import React from 'react';
import type { ToolbarButton } from 'ricos-types';
import { PLUGIN_TOOLBAR_BUTTON_ID } from 'wix-rich-content-editor-common';
import type { PluginContainerData_Alignment } from 'ricos-schema';
import { DividerAlignmentButton } from './toolbar/DividerAlignmentButton';
import { DividerSizeButton } from './toolbar/DividerSizeButton';
import { DividerStyleButton } from './toolbar/DividerStyleButton';
import { TIPTAP_DIVIDER_TYPE } from 'ricos-content';
import { DIVIDER_SIZES } from './toolbar/dividerButtonsData';

const selectedNodeResolver = {
  id: 'selectedNode',
  resolve: content => {
    if (Array.isArray(content) && content.length > 0) {
      return content[0];
    } else {
      return undefined;
    }
  },
};

export const getToolbarButtons = (config, services): ToolbarButton[] => {
  return [
    {
      id: 'dividerStyle',
      dataHook: 'dividerStyleDropdownButton',
      command: ({ lineStyle, editorCommands }) => {
        editorCommands
          .chain()
          .focus()
          .updateAttributes(TIPTAP_DIVIDER_TYPE, {
            lineStyle,
          })
          .run();
      },
      renderer: toolbarItem => <DividerStyleButton toolbarItem={toolbarItem} />,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
    },
    {
      id: 'dividerSize',
      dataHook: 'dividerSizeDropdownButton',
      command: ({ size, editorCommands }) => {
        editorCommands
          .chain()
          .focus()
          .updateAttributes(TIPTAP_DIVIDER_TYPE, {
            width: DIVIDER_SIZES[size].toUpperCase(),
          })
          .run();
      },
      attributes: {
        selectedNode: selectedNodeResolver,
      },
      renderer: toolbarItem => <DividerSizeButton toolbarItem={toolbarItem} />,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
    },
    {
      id: 'dividerAlignment',
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
      attributes: {
        selectedNode: selectedNodeResolver,
      },
      renderer: toolbarItem => (
        <DividerAlignmentButton
          toolbarItem={toolbarItem}
          options={['LEFT', 'CENTER', 'RIGHT'] as PluginContainerData_Alignment[]}
        />
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
