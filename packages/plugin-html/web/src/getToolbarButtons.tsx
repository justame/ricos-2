import React from 'react';
import type { ToolbarButton } from 'ricos-types';
import { PLUGIN_TOOLBAR_BUTTON_ID } from 'wix-rich-content-editor-common';
import { EditHtmlButton } from './toolbar/EditHtmlButton';
import { TIPTAP_HTML_TYPE } from 'ricos-content';

export const getToolbarButtons = (config): ToolbarButton[] => {
  return [
    {
      id: 'editHtml',
      command: ({ htmlData, editorCommands }) => {
        editorCommands.chain().updateAttributes(TIPTAP_HTML_TYPE, htmlData).run();
      },
      renderer: toolbarItem => <EditHtmlButton toolbarItem={toolbarItem} />,
      attributes: {
        nodeAttrsInSelection: nodeAttrsInSelectionResolver,
      },
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.ALIGNMENT,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.DELETE,
    },
  ];
};

const nodeAttrsInSelectionResolver = {
  id: 'nodeAttrsInSelection',
  resolve: content => {
    if (Array.isArray(content) && content.length > 0) {
      return content[0].attrs;
    }
    return false;
  },
};
