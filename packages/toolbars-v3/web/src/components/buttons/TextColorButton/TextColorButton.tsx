import React, { useState } from 'react';
import { withToolbarContext } from 'ricos-context';
import { ToolbarButton } from '../ToolbarButton';

const getColorButton =
  (type: 'ricos-text-color' | 'ricos-text-highlight') =>
  ({ toolbarItem, context, dataHook }) => {
    if (!context) return null;
    const { isMobile, t, getEditorCommands } = context;
    const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null);
    const currentColor = getEditorCommands().getColor(type);
    const Icon = toolbarItem.presentation?.icon;
    const tooltip = t(toolbarItem.presentation?.tooltip);
    return (
      <ToolbarButton
        ref={setReferenceElement}
        disabled={toolbarItem.attributes.disabled}
        isMobile={isMobile}
        tooltip={tooltip}
        onClick={() => toolbarItem.commands?.click({ referenceElement })}
        icon={() => <Icon style={{ color: currentColor }} />}
        dataHook={dataHook}
      />
    );
  };

export const TextColorButton = withToolbarContext(getColorButton('ricos-text-color'));
export const HighlightColorButton = withToolbarContext(getColorButton('ricos-text-highlight'));
