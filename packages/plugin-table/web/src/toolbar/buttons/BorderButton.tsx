import React, { useContext, useState } from 'react';
import type { FC } from 'react';
import { RicosContext, ModalContext } from 'ricos-context';
import { BorderIcon } from '../../icons';
import type { IToolbarItem } from 'ricos-types';
import { ToggleButton, DropdownButton } from 'wix-rich-content-toolbars-ui';
import { BORDER_TYPES, CATEGORY, TABLE_BUTTONS_MODALS_ID, TABLE_COLOR_PICKER } from '../../consts';
import type { bordersType } from '../../types';

interface Props {
  toolbarItem: IToolbarItem;
  dataHook?: string;
}

const BorderButton: FC<Props> = ({ dataHook, toolbarItem }) => {
  const { t, isMobile } = useContext(RicosContext) || {};
  const modalService = useContext(ModalContext) || {};
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const currentColor = toolbarItem.attributes?.cellBorderColor || 'unset';
  const isMultipleSelection = !(toolbarItem.attributes?.selectedCategory === CATEGORY.CELL_BORDER);
  const closeModal = () => modalService.closeModal(TABLE_BUTTONS_MODALS_ID.BORDER);
  const onColorSelect = (data: { borders?: string; outsideBorders?: string }) => {
    toolbarItem.commands?.click(data);
    modalService.closeModal(TABLE_COLOR_PICKER);
  };

  const toggleBorderPanel = () => {
    const isModalOpen = modalService.isModalOpen(TABLE_BUTTONS_MODALS_ID.BORDER);
    !isModalOpen
      ? modalService.openModal(TABLE_BUTTONS_MODALS_ID.BORDER, {
          componentProps: {
            onClick: openColorPickerPanel,
            closeModal,
          },
          layout: isMobile ? 'drawer' : 'toolbar',
          positioning: { referenceElement, placement: 'bottom' },
        })
      : closeModal();
  };

  const openColorPickerPanel = (borderType: bordersType) => {
    const isModalOpen = modalService.isModalOpen(TABLE_COLOR_PICKER);
    const closeModal = () => modalService.closeModal(TABLE_COLOR_PICKER);
    !isModalOpen
      ? modalService?.openModal(TABLE_COLOR_PICKER, {
          componentProps: {
            onChange: color => onColorSelect({ [borderType]: color }),
            closeModal,
            currentColor,
            resetColor: () => onColorSelect({ [borderType]: 'unset' }),
          },
          positioning: { placement: 'bottom', referenceElement },
          layout: isMobile ? 'drawer' : 'toolbar',
        })
      : closeModal();
  };

  return !isMultipleSelection ? (
    <div ref={setReferenceElement}>
      <ToggleButton
        Icon={BorderIcon}
        onClick={() => openColorPickerPanel(BORDER_TYPES.borders)}
        dataHook={dataHook}
        tooltip={t('ButtonModal_Border_Color')}
      />
    </div>
  ) : (
    <DropdownButton
      dataHook={dataHook}
      active={modalService.isModalOpen(TABLE_BUTTONS_MODALS_ID.BORDER)}
      onClick={toggleBorderPanel}
      setRef={setReferenceElement}
      Icon={BorderIcon}
      tooltip={t('ButtonModal_Border_Color')}
    />
  );
};

export default BorderButton;
