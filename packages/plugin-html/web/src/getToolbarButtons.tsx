import React from 'react';
import type { ToolbarButton } from 'ricos-types';
import { PLUGIN_TOOLBAR_BUTTON_ID } from 'wix-rich-content-editor-common';
import { EditHtmlButton } from './toolbar/EditHtmlButton';
import { DimensionSliderButton } from './toolbar/DimensionSliderButton';
import { TIPTAP_HTML_TYPE } from 'ricos-content';
import { MAX_HEIGHT_INPUT, MIN_WIDTH, MAX_WIDTH, MIN_HEIGHT, MAX_HEIGHT } from './defaults';
import { HeightIcon, WidthIcon, selectedNodeResolver } from 'wix-rich-content-plugin-commons';
import { AlignmentPanel, NodeAlignmentButton } from 'wix-rich-content-toolbars-ui';
import HtmlEditPanel from './toolbar/HtmlEditPanelTiptap';
import SliderModal from './toolbar/SliderModal';
import { HTML_BUTTONS } from './consts';

export const getToolbarButtons = (config, services): ToolbarButton[] => {
  const {
    minHeight = MIN_HEIGHT,
    maxHeight = MAX_HEIGHT,
    maxWidth = MAX_WIDTH,
    minWidth = MIN_WIDTH,
  } = config || {};
  return [
    {
      id: HTML_BUTTONS.edit,
      dataHook: 'baseToolbarButton_edit',
      command: ({ htmlData, editorCommands }) => {
        editorCommands.chain().updateAttributes(TIPTAP_HTML_TYPE, htmlData).run();
      },
      modal: {
        Component: HtmlEditPanel,
        id: HTML_BUTTONS.edit,
      },
      renderer: toolbarItem => <EditHtmlButton toolbarItem={toolbarItem} />,
      attributes: {
        selectedNode: selectedNodeResolver,
      },
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
    },
    {
      id: HTML_BUTTONS.width,
      command: ({ data, editorCommands }) => {
        editorCommands.chain().updateAttributes(TIPTAP_HTML_TYPE, data).run();
      },
      modal: {
        Component: SliderModal,
        id: HTML_BUTTONS.width,
      },
      icon: WidthIcon,
      tooltip: 'ChangeDimensions_Width_Tooltip',
      dataHook: 'html_custom_width_slider',
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
      id: HTML_BUTTONS.height,
      command: ({ data, editorCommands }) => {
        editorCommands.chain().updateAttributes(TIPTAP_HTML_TYPE, data).run();
      },
      modal: {
        Component: SliderModal,
        id: HTML_BUTTONS.height,
      },
      icon: HeightIcon,
      tooltip: 'ChangeDimensions_Height_Tooltip',
      dataHook: 'html_custom_height_slider',
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
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.ALIGNMENT,
      modal: {
        Component: AlignmentPanel,
        id: HTML_BUTTONS.alignment,
      },
      renderer: toolbarItem => (
        <NodeAlignmentButton toolbarItem={toolbarItem} id={HTML_BUTTONS.alignment} />
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
