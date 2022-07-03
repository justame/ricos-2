import React from 'react';
import type { PluginToolbarButtons } from 'ricos-types';
import { PLUGIN_TOOLBAR_BUTTON_ID } from 'wix-rich-content-editor-common';
import { NodeAlignmentButton } from 'wix-rich-content-toolbars-ui';
import type { PluginContainerData_Alignment } from 'ricos-schema';

export const getToolbarButtons = (config): PluginToolbarButtons => {
  return {
    buttons: [
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
    ],
  };
};
