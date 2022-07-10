import React from 'react';
import type { ToolbarButton } from 'ricos-types';
import { PLUGIN_TOOLBAR_BUTTON_ID } from 'wix-rich-content-editor-common';
import { EditHtmlButton } from './toolbar/EditHtmlButton';
import { DimensionSliderButton } from './toolbar/DimensionSliderButton';
import { TIPTAP_HTML_TYPE } from 'ricos-content';
import { MAX_HEIGHT_INPUT, MIN_WIDTH, MAX_WIDTH, MIN_HEIGHT, MAX_HEIGHT } from './defaults';
import { HeightIcon, WidthIcon } from 'wix-rich-content-plugin-commons';

export const getToolbarButtons = (config): ToolbarButton[] => {
  const {
    minHeight = MIN_HEIGHT,
    maxHeight = MAX_HEIGHT,
    maxWidth = MAX_WIDTH,
    minWidth = MIN_WIDTH,
  } = config || {};
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
      id: 'htmlWidth',
      command: ({ data, editorCommands }) => {
        editorCommands.chain().updateAttributes(TIPTAP_HTML_TYPE, data).run();
      },
      icon: WidthIcon,
      tooltip: 'ChangeDimensions_Width_Tooltip',
      renderer: toolbarItem => (
        <DimensionSliderButton
          toolbarItem={toolbarItem}
          dimension={'width'}
          min={minWidth}
          max={maxWidth}
          inputMax={MAX_HEIGHT_INPUT}
        />
      ),
      attributes: {
        selectedNode: selectedNodeResolver,
      },
    },
    {
      id: 'htmlHeight',
      command: ({ data, editorCommands }) => {
        editorCommands.chain().updateAttributes(TIPTAP_HTML_TYPE, data).run();
      },
      icon: HeightIcon,
      tooltip: 'ChangeDimensions_Height_Tooltip',
      renderer: toolbarItem => (
        <DimensionSliderButton
          toolbarItem={toolbarItem}
          dimension={'height'}
          min={minHeight}
          max={maxHeight}
          inputMax={MAX_HEIGHT_INPUT}
        />
      ),
      attributes: {
        selectedNode: selectedNodeResolver,
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
