import React from 'react';
import type { ToolbarItemProps } from '../../../types';
import { withToolbarContext } from 'ricos-context';
import { ToolbarButton } from '../ToolbarButton';

const TitleButton = ({ toolbarItem, context, dataHook }: ToolbarItemProps) => {
  const { isMobile, t, getEditorCommands } = context || {};
  const editorCommands = getEditorCommands?.();
  const onClick = () => toolbarItem.commands?.click();
  const tooltip = t?.(toolbarItem.presentation?.tooltip);

  return (
    <ToolbarButton
      isMobile={isMobile}
      disabled={toolbarItem.attributes.disabled}
      active={toolbarItem.attributes.active}
      tooltip={tooltip}
      onClick={onClick}
      icon={toolbarItem.presentation?.getIcon(editorCommands)}
      dataHook={dataHook}
    />
  );
};

export default withToolbarContext(TitleButton);
