import React, { useContext, useState } from 'react';
import type { FC } from 'react';
import { RicosContext, ModalContext } from 'ricos-context';
import {
  VerticalAlignmentBottom,
  VerticalAlignmentMiddle,
  VerticalAlignmentTop,
} from '../../icons';
import type { IToolbarItem } from 'ricos-types';
import { DropdownButton } from 'wix-rich-content-toolbars-ui';
import { TABLE_BUTTONS_MODALS_ID } from '../../consts';

interface Props {
  toolbarItem: IToolbarItem;
  dataHook?: string;
}

const iconsMap = {
  TOP: VerticalAlignmentTop,
  MIDDLE: VerticalAlignmentMiddle,
  BOTTOM: VerticalAlignmentBottom,
};

const VerticalAlignmentButton: FC<Props> = ({ dataHook, toolbarItem }) => {
  const { t, isMobile } = useContext(RicosContext) || {};
  const modalService = useContext(ModalContext) || {};

  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);

  const verticalAlignment = toolbarItem.attributes.cellAlignment || 'TOP';
  const Icon = iconsMap[verticalAlignment];

  const onClick = verticalAlignment => {
    toolbarItem.commands?.click({ verticalAlignment });
    closeModal();
  };

  const closeModal = () => modalService.closeModal(TABLE_BUTTONS_MODALS_ID.VERTICAL_ALIGNMENT);

  const openVerticalAlignmentPanel = () => {
    const isModalOpen = modalService.isModalOpen(TABLE_BUTTONS_MODALS_ID.VERTICAL_ALIGNMENT);
    !isModalOpen
      ? modalService.openModal(TABLE_BUTTONS_MODALS_ID.VERTICAL_ALIGNMENT, {
          componentProps: {
            onClick,
            closeModal,
            selectedAlign: verticalAlignment,
          },
          layout: isMobile ? 'drawer' : 'toolbar',
          positioning: { referenceElement, placement: 'bottom' },
        })
      : closeModal();
  };

  return (
    <DropdownButton
      dataHook={dataHook}
      active={modalService.isModalOpen(TABLE_BUTTONS_MODALS_ID.VERTICAL_ALIGNMENT)}
      onClick={openVerticalAlignmentPanel}
      setRef={setReferenceElement}
      Icon={Icon}
      tooltip={t('TablePlugin_Toolbar_VerticalAlignment_Tooltip')}
    />
  );
};

export default VerticalAlignmentButton;
