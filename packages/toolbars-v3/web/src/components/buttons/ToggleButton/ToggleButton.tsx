import React from 'react';
import type { ToolbarItemProps } from '../../../types';
import { withToolbarContext } from 'ricos-context';
import { ToolbarButton } from '../ToolbarButton';

const ToggleButton = ({ toolbarItem, onClick, context, dataHook }: ToolbarItemProps) => {
  const { isMobile } = context || {};

  const tooltip = toolbarItem.presentation?.tooltip;

  return (
    <ToolbarButton
      isMobile={isMobile}
      active={toolbarItem.attributes.active}
      disabled={toolbarItem.attributes.disabled}
      tooltip={tooltip}
      onClick={onClick}
      icon={toolbarItem.presentation?.icon}
      dataHook={dataHook}
    />
  );
};

export default withToolbarContext(ToggleButton);
