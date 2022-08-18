import React, { useContext, useState } from 'react';
import { ModalContext, withToolbarContext } from 'ricos-context';
import { DropdownArrowIcon } from '../../../icons';
import { ToolbarButton } from '../ToolbarButton';

const AlignmentButton = ({ toolbarItem, context, dataHook }) => {
  const { isMobile, t, getEditorCommands } = context || {};
  const modalService = useContext(ModalContext) || {};
  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null);
  const editorCommands = getEditorCommands?.();
  const Icon = toolbarItem.presentation.getIcon(editorCommands);
  const tooltip = t(toolbarItem.presentation?.tooltip);

  return (
    <ToolbarButton
      ref={setReferenceElement}
      isMobile={isMobile}
      active={modalService.isModalOpen('formattingAlignmentModal')}
      tooltip={tooltip}
      onClick={() => {
        toolbarItem.commands?.click({ referenceElement });
      }}
      icon={() => (
        <>
          <Icon />
          <DropdownArrowIcon />
        </>
      )}
      dataHook={dataHook}
    />
  );
};

export default withToolbarContext(AlignmentButton);
