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
  const getSelectedStyle: () => string = () => toolbarItem?.attributes.nodeStyle || 'SINGLE';
  const SelectedStyleIcon =
    dividerStyleData.find(({ commandKey }) => commandKey === getSelectedStyle())?.icon ||
    SingleLineStyle;

  const closeModal = () => modalService.closeModal(id);

  const onStyleClick = lineStyle => {
    toolbarItem.commands?.click({ lineStyle });
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

  return (
    <DropdownButton
      dataHook={dataHook}
      onClick={onClick}
      setRef={setReferenceElement}
      Icon={() => <SelectedStyleIcon width={'37px'} />}
      tooltip={t('DividerPlugin_SelectType_Tooltip')}
    />
  );
};
