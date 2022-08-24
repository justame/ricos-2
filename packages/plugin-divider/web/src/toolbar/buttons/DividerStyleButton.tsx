import React, { useContext, useState } from 'react';
import type { FC } from 'react';
import { RicosContext, ModalContext } from 'ricos-context';
import type { IToolbarItem } from 'ricos-types';
import { DropdownButton } from 'wix-rich-content-toolbars-ui';
import { dividerStyleData } from './dividerButtonsData';
import { SingleLineStyle } from '../../icons';

type Props = {
  toolbarItem: IToolbarItem;
  id: string;
  dataHook?: string;
};

export const DividerStyleButton: FC<Props> = ({ toolbarItem, dataHook, id }) => {
  const { t, isMobile } = useContext(RicosContext) || {};
  const modalService = useContext(ModalContext) || {};
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const getSelectedStyle: () => string = () => toolbarItem?.attributes.nodeStyle || 'SINGLE';
  const SelectedStyleIcon =
    dividerStyleData.find(({ commandKey }) => commandKey === getSelectedStyle())?.icon ||
    SingleLineStyle;

  const closeModal = () => modalService.closeModal(id);

  const onStyleClick = lineStyle => {
    toolbarItem.commands?.click({ value: lineStyle });
    closeModal();
  };

  const onClick = () => {
    modalService.isModalOpen(id)
      ? closeModal()
      : modalService?.openModal(id, {
          componentProps: {
            getSelectedStyle,
            onClick: onStyleClick,
            closeModal,
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
      Icon={() => <SelectedStyleIcon width={36} />}
      tooltip={t('DividerPlugin_SelectType_Tooltip')}
    />
  );
};
