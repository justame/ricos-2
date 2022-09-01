import React, { useState } from 'react';
import { withToolbarContext } from 'ricos-context';
import { ToolbarButton } from '../ToolbarButton';

const getColorButton = ({ toolbarItem, context, dataHook }) => {
  if (!context) return null;
  const { isMobile, t, getEditorCommands } = context;
  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null);
  const editorCommands = getEditorCommands();
  const Icon = toolbarItem.presentation.getIcon(editorCommands);
  const tooltip = t(toolbarItem.presentation?.tooltip);
  return (
    <ToolbarButton
      ref={setReferenceElement}
      disabled={toolbarItem.attributes.disabled}
      isMobile={isMobile}
      tooltip={tooltip}
      onClick={() => toolbarItem.commands?.click({ referenceElement })}
      icon={() => <Icon />}
      dataHook={dataHook}
    />
  );
};

export const TextColorButton = withToolbarContext(getColorButton);
export const HighlightColorButton = withToolbarContext(getColorButton);
