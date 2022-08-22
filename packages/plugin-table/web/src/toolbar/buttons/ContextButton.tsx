import React, { useContext, useState } from 'react';
import type { FC } from 'react';
import { RicosContext, ModalContext } from 'ricos-context';
import { ContextMenuIcon } from '../../icons';
import type { IToolbarItem } from 'ricos-types';
import { ToggleButton } from 'wix-rich-content-toolbars-ui';
import { TABLE_BUTTONS_MODALS_ID } from '../../consts';

interface Props {
  toolbarItem: IToolbarItem;
  dataHook?: string;
}

const ContextButton: FC<Props> = ({ dataHook, toolbarItem }) => {
  const { isMobile } = useContext(RicosContext) || {};
  const modalService = useContext(ModalContext) || {};

  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);

  const onClick = (data: { borders?: string; outsideBorders?: string }) => {
    toolbarItem.commands?.click(data);
    closeModal();
  };

  const closeModal = () => modalService.closeModal(TABLE_BUTTONS_MODALS_ID.CONTEXT);

  const category = toolbarItem.attributes?.selectedCategory;

  const openBorderPanel = () => {
    const isModalOpen = modalService.isModalOpen(TABLE_BUTTONS_MODALS_ID.CONTEXT);
    !isModalOpen
      ? modalService.openModal(TABLE_BUTTONS_MODALS_ID.CONTEXT, {
          componentProps: {
            onClick,
            closeModal,
            category,
          },
          layout: isMobile ? 'drawer' : 'toolbar',
          positioning: { referenceElement, placement: 'bottom' },
        })
      : closeModal();
  };

  return (
    <ToggleButton
      dataHook={dataHook}
      onClick={openBorderPanel}
      setRef={setReferenceElement}
      Icon={ContextMenuIcon}
    />
  );
};

export default ContextButton;
