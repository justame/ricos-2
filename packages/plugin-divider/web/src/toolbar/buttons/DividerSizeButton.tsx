import React, { useContext, useState } from 'react';
import type { FC } from 'react';
import { RicosContext, ModalContext } from 'ricos-context';
import type { IToolbarItem } from 'ricos-types';
import { DropdownButton } from 'wix-rich-content-toolbars-ui';
import { dividerSizeData } from './dividerButtonsData';
import { SizeMediumIcon } from 'wix-rich-content-plugin-commons';
import { DividerData_Width } from 'ricos-schema';

type Props = {
  toolbarItem: IToolbarItem;
  id: string;
  dataHook?: string;
};

export const DividerSizeButton: FC<Props> = ({ toolbarItem, dataHook, id }) => {
  const { isMobile, t } = useContext(RicosContext) || {};
  const modalService = useContext(ModalContext) || {};
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const getSelectedSize: () => string = () =>
    toolbarItem?.attributes.nodeSize || DividerData_Width.LARGE;
  const selectedSize = dividerSizeData.find(({ commandKey }) => commandKey === getSelectedSize());
  const Icon = selectedSize?.icon || SizeMediumIcon;
  const closeModal = () => modalService.closeModal(id);

  const onSizeClick = value => {
    toolbarItem.commands?.click({ value });
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
      active={modalService.isModalOpen(id)}
      onClick={onClick}
      setRef={setReferenceElement}
      Icon={Icon}
      tooltip={t('ButtonModal_Size_Section')}
    />
  );
};
