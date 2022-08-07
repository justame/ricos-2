import React, { useContext, useState } from 'react';
import type { FC, ComponentType } from 'react';
import { RicosContext, ModalContext } from 'ricos-context';
import type { IToolbarItem } from 'ricos-types';
import { DropdownButton } from 'wix-rich-content-toolbars-ui';
import { dividerSizeData } from './dividerButtonsData';

type Props = {
  toolbarItem: IToolbarItem;
  id: string;
  dataHook?: string;
};

export const DividerSizeButton: FC<Props> = ({ toolbarItem, dataHook, id }) => {
  const { isMobile, t } = useContext(RicosContext) || {};
  const modalService = useContext(ModalContext) || {};
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const getSelectedSize: () => string = () => toolbarItem?.attributes.nodeSize || 'MEDIUM';
  const SelectedSizeIcon = dividerSizeData.find(
    ({ commandKey }) => commandKey === getSelectedSize()
  )?.icon as ComponentType;

  const closeModal = () => modalService.closeModal(id);

  const onSizeClick = size => {
    toolbarItem.commands?.click({ size });
    closeModal();
  };

  const onClick = () => {
    modalService.isModalOpen(id)
      ? closeModal()
      : modalService?.openModal(id, {
          componentProps: {
            getSelectedSize,
            onClick: onSizeClick,
            closeModal,
          },
          layout: isMobile ? 'drawer' : 'toolbar',
          positioning: { referenceElement, placement: 'bottom' },
        });
  };

  return (
    <DropdownButton
      dataHook={dataHook}
      onClick={onClick}
      setRef={setReferenceElement}
      Icon={SelectedSizeIcon}
      tooltip={t('ButtonModal_Size_Section')}
    />
  );
};
