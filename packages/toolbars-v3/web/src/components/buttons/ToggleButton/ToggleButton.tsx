import React from 'react';
import type { ToolbarItemProps } from '../../../types';
import { withToolbarContext } from 'ricos-context';
import { getTooltip } from '../tooltipUtils';
import { ToolbarButton } from '../ToolbarButton';

const ToggleButton = ({ toolbarItem, onClick, context, dataHook }: ToolbarItemProps) => {
  const { isMobile, t } = context || {};

  const tooltipShortcutKey = toolbarItem.presentation?.tooltipShortcut;
  const tooltipKey = toolbarItem.presentation?.tooltip;

  const tooltip = t && getTooltip(t, tooltipKey, tooltipShortcutKey);
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
