import React, { useContext, useState } from 'react';
import type { FC } from 'react';
import { getDefaultAlignment, alignmentMap } from './utils';
import { DropdownButton } from '../../components';
import { RicosContext, ModalContext } from 'ricos-context';
import type { IToolbarItem } from 'ricos-types';

type Props = {
  toolbarItem: IToolbarItem;
  id: string;
  dataHook?: string;
};

const NodeAlignmentButton: FC<Props> = ({ toolbarItem, dataHook, id }) => {
  const { t, languageDir, isMobile } = useContext(RicosContext) || {};
  const modalService = useContext(ModalContext) || {};
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const getSelectedAlignment = () =>
    toolbarItem?.attributes.nodeAlignment || getDefaultAlignment(languageDir);
  const selectedAlignment = getSelectedAlignment();
  const SelectedAlignmentIcon = alignmentMap[`${selectedAlignment}`];
  const closeModal = () => modalService.closeModal(id);

  const onAlignmentClick = alignment => {
    toolbarItem.commands?.setAlignment(alignment);
    closeModal();
  };

  const onClick = () => {
    modalService.isModalOpen(id)
      ? closeModal()
      : modalService?.openModal(id, {
          componentProps: {
            getSelectedAlignment,
            onClick: onAlignmentClick,
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
      Icon={SelectedAlignmentIcon}
      tooltip={t('TextAlignmentButton_Tooltip')}
    />
  );
};

export default NodeAlignmentButton;
