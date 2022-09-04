import React, { useState, useContext } from 'react';
import { withToolbarContext, ModalContext } from 'ricos-context';
import { getLinkModalProps } from 'wix-rich-content-toolbars-modals';
import { CUSTOM_LINK, Decoration_Type } from 'wix-rich-content-common';
import { withContentQueryContext } from 'ricos-content-query';
import { ToolbarButton } from '../../ToolbarButton';

const EditLinkButton = ({ toolbarItem, context, contentQueryService, dataHook }) => {
  const id = `${Decoration_Type.LINK}.modal`;
  const { isMobile, t, getEditorCommands, linkPanelData = {}, experiments } = context || {};
  const modalService = useContext(ModalContext) || {};
  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null);
  const [isButtonActive, setIsButtonActive] = useState<boolean>(false);

  const editorCommands = getEditorCommands?.();
  const { onLinkAdd, linkSettings = {} } = linkPanelData;
  const { linkData } = getLinkModalProps(
    editorCommands,
    linkSettings,
    contentQueryService,
    experiments
  );

  const openModal = () => {
    modalService.isModalOpen(id)
      ? modalService.closeModal(id)
      : modalService?.openModal(id, {
          componentProps: {
            closeModal: () => modalService.closeModal(id),
          },
          layout: isMobile ? 'drawer' : 'toolbar',
          positioning: { referenceElement, placement: 'bottom' },
        });
  };

  const onClick = () => {
    const isCustomLinkHandling = !!onLinkAdd;
    if (isCustomLinkHandling) {
      const customLinkData = linkData?.customData;
      const callback = data => editorCommands.insertDecoration(CUSTOM_LINK, data);
      onLinkAdd(customLinkData, callback);
    } else {
      openModal();
    }
  };

  modalService.onModalOpened(() => {
    modalService.isModalOpen(id) && setIsButtonActive(true);
  });
  modalService.onModalClosed(() => {
    !modalService.isModalOpen(id) && setIsButtonActive(false);
  });

  const tooltip = t(toolbarItem.presentation?.tooltip);
  const isActive = isButtonActive || toolbarItem.attributes.active;
  return (
    <ToolbarButton
      ref={setReferenceElement}
      isMobile={isMobile}
      active={isActive}
      tooltip={tooltip}
      onClick={onClick}
      icon={toolbarItem.presentation?.icon}
      dataHook={dataHook}
    />
  );
};

export default withContentQueryContext(withToolbarContext(EditLinkButton));
