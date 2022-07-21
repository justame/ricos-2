import React from 'react';
import type { ToolbarButton } from 'ricos-types';
import { PLUGIN_TOOLBAR_BUTTON_ID } from 'wix-rich-content-editor-common';
import { NodeAlignmentButton } from 'wix-rich-content-toolbars-ui';
import type { PluginContainerData_Alignment } from 'ricos-schema';
import { DividerSizeButton } from './toolbar/DividerSizeButton';
import { DividerStyleButton } from './toolbar/DividerStyleButton';
import { TIPTAP_DIVIDER_TYPE } from 'ricos-content';

export const getToolbarButtons = (config): ToolbarButton[] => {
  return [
    {
      id: 'dividerStyle',
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
      id: 'dividerSize',
      command: ({ size, editorCommands }) => {
        editorCommands.chain().focus().setNodeSize(size).setNodeAlignment('CENTER').run();
      },
      renderer: toolbarItem => <DividerSizeButton toolbarItem={toolbarItem} />,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.ALIGNMENT,
      renderer: toolbarItem => (
        <NodeAlignmentButton
          toolbarItem={toolbarItem}
          options={['LEFT', 'CENTER', 'RIGHT'] as PluginContainerData_Alignment[]}
        />
      ),
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.DELETE,
    },
  ];
};
