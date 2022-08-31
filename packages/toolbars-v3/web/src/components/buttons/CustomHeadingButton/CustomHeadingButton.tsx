import React, { useState, useContext } from 'react';
import { DropdownArrowIcon } from '../../../icons';
import { ModalContext, withToolbarContext } from 'ricos-context';
import { getCustomHeadingsLabel } from 'wix-rich-content-toolbars-modals';
import { ToolbarButton } from '../ToolbarButton';

const CustomHeadingButton = ({ toolbarItem, context, dataHook }) => {
  const { isMobile, t, getEditorCommands } = context || {};
  const modalService = useContext(ModalContext) || {};
  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null);

  const editorCommands = getEditorCommands?.();

  const selectedHeading = toolbarItem.attributes.selectedHeading;
  const Label = getCustomHeadingsLabel(selectedHeading, t, editorCommands);

  const tooltip = t(toolbarItem.presentation?.tooltip);
  return (
    <ToolbarButton
      ref={setReferenceElement}
      disabled={toolbarItem.attributes.disabled}
      isMobile={isMobile}
      active={modalService.isModalOpen('formattingAlignmentModal')}
      tooltip={tooltip}
      onClick={() => toolbarItem.commands?.click({ referenceElement })}
      icon={() => (
        <>
          {Label}
          <DropdownArrowIcon />
        </>
      )}
      dataHook={dataHook}
    />
  );
};

export default withToolbarContext(CustomHeadingButton);
