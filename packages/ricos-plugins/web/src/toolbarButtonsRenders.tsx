import React from 'react';
import { NodeLinkButton } from 'wix-rich-content-toolbars-v3';
import { PLUGIN_TOOLBAR_BUTTON_ID } from 'wix-rich-content-editor-common';
import {
  SettingsButton,
  ReplaceButton,
  NodeAlignmentButton,
  NodeSizeButton,
  DeleteButton,
  ToolbarButtonSeparator,
} from 'wix-rich-content-toolbars-ui';

export const toolbarButtonsRenders = {
  [PLUGIN_TOOLBAR_BUTTON_ID.DELETE]: toolbarItem => {
    return <DeleteButton toolbarItem={toolbarItem} />;
  },
  [PLUGIN_TOOLBAR_BUTTON_ID.ALIGNMENT]: toolbarItem => {
    return <NodeAlignmentButton toolbarItem={toolbarItem} />;
  },
  [PLUGIN_TOOLBAR_BUTTON_ID.SIZE]: toolbarItem => {
    return <NodeSizeButton toolbarItem={toolbarItem} />;
  },
  [PLUGIN_TOOLBAR_BUTTON_ID.SETTINGS]: toolbarItem => {
    return <SettingsButton toolbarItem={toolbarItem} />;
  },
  [PLUGIN_TOOLBAR_BUTTON_ID.REPLACE]: toolbarItem => {
    return <ReplaceButton toolbarItem={toolbarItem} />;
  },
  [PLUGIN_TOOLBAR_BUTTON_ID.LINK]: toolbarItem => {
    return <NodeLinkButton toolbarItem={toolbarItem} />;
  },
  [PLUGIN_TOOLBAR_BUTTON_ID.SEPERATOR]: () => {
    return <ToolbarButtonSeparator />;
  },
};
