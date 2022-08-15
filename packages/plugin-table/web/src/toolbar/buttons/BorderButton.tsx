import React, { useContext, useState } from 'react';
import type { FC } from 'react';
import { RicosContext, ModalContext } from 'ricos-context';
import { BorderIcon } from '../../icons';
import type { IToolbarItem } from 'ricos-types';
import { ToggleButton, DropdownButton } from 'wix-rich-content-toolbars-ui';
import { TABLE_BUTTONS_MODALS_ID } from '../../consts';

interface Props {
  toolbarItem: IToolbarItem;
  dataHook?: string;
}

const BorderButton: FC<Props> = ({ dataHook, toolbarItem }) => {
  const { t, isMobile } = useContext(RicosContext) || {};
  const modalService = useContext(ModalContext) || {};

  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);

  const isMultipleSelection = true; // TODO: selectedCells.length > 1

  const onColorSelect = (data: { borders?: string; outsideBorders?: string }) => {
    toolbarItem.commands?.click(data);
    closeModal();
  };

  const closeModal = () => modalService.closeModal(TABLE_BUTTONS_MODALS_ID.BORDER);

  const openBorderPanel = () => {
    const isModalOpen = modalService.isModalOpen(TABLE_BUTTONS_MODALS_ID.BORDER);
    !isModalOpen
      ? modalService.openModal(TABLE_BUTTONS_MODALS_ID.BORDER, {
          componentProps: {
            onClick: onColorSelect,
            closeModal,
          },
          layout: isMobile ? 'drawer' : 'toolbar',
          positioning: { referenceElement, placement: 'bottom' },
        })
      : closeModal();
  };

  return !isMultipleSelection ? (
    <ToggleButton
      Icon={BorderIcon}
      onClick={color => onColorSelect({ borders: color })}
      dataHook={dataHook}
      tooltip={t('ButtonModal_Border_Color')}
    />
  ) : (
    <DropdownButton
      dataHook={dataHook}
      onClick={openBorderPanel}
      setRef={setReferenceElement}
      Icon={BorderIcon}
      tooltip={t('ButtonModal_Border_Color')}
    />
  );
};

export default BorderButton;
