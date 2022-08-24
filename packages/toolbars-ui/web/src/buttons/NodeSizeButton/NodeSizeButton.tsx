import React, { useContext, useState } from 'react';
import type { FC } from 'react';
import { DropdownButton } from '../../components';
import { RicosContext, ModalContext } from 'ricos-context';
import type { IToolbarItem } from 'ricos-types';
import { sizeIconMap } from './consts';

type Props = {
  toolbarItem: IToolbarItem;
  id: string;
  dataHook?: string;
};

const NodeSizeButton: FC<Props> = ({ toolbarItem, dataHook, id }) => {
  const { t, isMobile } = useContext(RicosContext) || {};
  const modalService = useContext(ModalContext) || {};
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const getSelectedSize: () => string = () => toolbarItem?.attributes.nodeSize || 'CONTENT';
  const selectedSize: string = getSelectedSize();
  const SelectedSizeIcon = sizeIconMap[`${selectedSize}`];
  const closeModal = () => modalService.closeModal(id);

  const onSizeClick = size => {
    toolbarItem.commands?.setSize(size);
    closeModal();
  };

  const onClick = () => {
    modalService.isModalOpen(id)
      ? closeModal()
      : modalService?.openModal(id, {
          componentProps: {
            getSelectedSize,
            onClick: onSizeClick,
          },
          layout: isMobile ? 'drawer' : 'toolbar',
          positioning: { referenceElement, placement: 'bottom' },
        });
  };

  modalService.onModalOpened(() => {
    modalService.isModalOpen(id) && setIsButtonActive(true);
  });
  modalService.onModalClosed(() => {
    !modalService.isModalOpen(id) && setIsButtonActive(false);
  });

  return (
    <DropdownButton
      dataHook={dataHook}
      active={isButtonActive}
      onClick={onClick}
      setRef={setReferenceElement}
      Icon={SelectedSizeIcon}
      tooltip={t('ButtonModal_Size_Section')}
    />
  );
};

export default NodeSizeButton;
