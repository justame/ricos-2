import React, { useState, useContext, useEffect } from 'react';
import { DropdownArrowIcon } from '../../../icons';
import { withToolbarContext, ModalContext } from 'ricos-context';
import { ToolbarButton } from '../ToolbarButton';

const AlignmentButton = ({ toolbarItem, context, dataHook }) => {
  const { isMobile, t, getEditorCommands } = context || {};
  const modalService = useContext(ModalContext) || {};
  const [isButtonActive, setIsButtonActive] = useState<boolean>(false);
  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null);
  const editorCommands = getEditorCommands?.();
  const Icon = toolbarItem.presentation.getIcon(editorCommands);
  const tooltip = t(toolbarItem.presentation?.tooltip);

  useEffect(() => {
    const id = 'formattingAlignmentModal';
    modalService.onModalOpened(() => {
      modalService.isModalOpen(id) && setIsButtonActive(true);
    });
    modalService.onModalClosed(() => {
      !modalService.isModalOpen(id) && setIsButtonActive(false);
    });
  }, []);

  return (
    <ToolbarButton
      ref={setReferenceElement}
      isMobile={isMobile}
      active={isButtonActive}
      tooltip={tooltip}
      onClick={() => {
        toolbarItem.commands?.click(referenceElement);
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
