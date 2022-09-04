import React, { useState, useContext } from 'react';
import { DropdownArrowIcon } from '../../../icons';
import { ModalContext, withToolbarContext } from 'ricos-context';
import { getCustomHeadingsLabel } from 'wix-rich-content-toolbars-modals';
import { ToolbarButton } from '../ToolbarButton';
import { Node_Type } from 'ricos-schema';

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
      active={modalService.isModalOpen(`${Node_Type.HEADING}.modal`)}
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
