import React, { useContext, useState } from 'react';
import type { FC, ComponentType } from 'react';
import { RicosContext, ModalContext } from 'ricos-context';
import type { IToolbarItem } from 'ricos-types';
import { DropdownButton } from 'wix-rich-content-toolbars-ui';
import { galleryLayoutsData } from './galleryLayoutsData';
import { GALLERY_LAYOUTS } from '../layout-data-provider';

type Props = {
  toolbarItem: IToolbarItem;
  id: string;
  dataHook?: string;
};

export const GalleryLayoutButton: FC<Props> = ({ toolbarItem, dataHook, id }) => {
  const { t, isMobile } = useContext(RicosContext) || {};
  const modalService = useContext(ModalContext);
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const getSelectedLayout = () =>
    (GALLERY_LAYOUTS[toolbarItem?.attributes.layout] || GALLERY_LAYOUTS.GRID) as number;
  const SelectedLayoutIcon = galleryLayoutsData.find(
    ({ commandKey }) => commandKey === getSelectedLayout()
  )?.icon as ComponentType;

  const closeModal = () => modalService.closeModal(id);
  const onLayoutClick = layout => {
    toolbarItem.commands?.click({ layout });
    closeModal();
  };

  const onClick = () => {
    modalService.isModalOpen(id)
      ? closeModal()
      : modalService?.openModal(id, {
          componentProps: {
            onClick: onLayoutClick,
            getSelectedLayout,
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
      Icon={SelectedLayoutIcon}
      tooltip={t('GalleryPlugin_Layout_Select_Tooltip')}
    />
  );
};
