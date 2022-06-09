import React from 'react';
import type { ComponentType } from 'react';
import { withToolbarContext } from 'wix-rich-content-toolbars-v3';

const getOnClick = toolbarItem => args => {
  toolbarItem.commands.click(args);
};

export const getToolbarButtonRenderer = (Component: ComponentType) => {
  const WrappedComponent = withToolbarContext(Component);
  return toolbarItem => (
    <WrappedComponent toolbarItem={toolbarItem} onClick={getOnClick(toolbarItem)} />
  );
};
