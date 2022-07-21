import React, { useContext } from 'react';
import type { FC, ComponentType } from 'react';
import { RicosContext, ModalContext } from 'ricos-context';
import type { IToolbarItem } from 'ricos-types';
import { DropdownButton, ListItemSelect } from 'wix-rich-content-toolbars-ui';
import { galleryLayoutsData } from './galleryLayoutsData';
import { GALLERY_LAYOUTS } from '../layout-data-provider';

type Props = {
  toolbarItem: IToolbarItem;
  dataHook?: string;
};

export const GalleryLayoutButton: FC<Props> = ({ toolbarItem, dataHook }) => {
  const { t } = useContext(RicosContext) || {};
  const modalService = useContext(ModalContext);

  const galleryLayout = toolbarItem?.attributes.galleryLayout;
  const selectedLayout = (galleryLayout as string) || GALLERY_LAYOUTS.GRID;
  const SelectedLayoutIcon = galleryLayoutsData.find(
    ({ commandKey }) => commandKey === selectedLayout
  )?.icon as ComponentType;

  return (
    <DropdownButton
      dataHook={dataHook}
      id={'gallery_layout'}
      options={galleryLayoutsData.map(({ dataHook, icon: Icon, text, commandKey, tooltip }) => (
        <ListItemSelect
          key={commandKey}
          dataHook={dataHook}
          prefix={<Icon />}
          title={t(text)}
          selected={commandKey === selectedLayout}
          tooltip={t(tooltip)}
          onClick={() => {
            toolbarItem.commands?.click({ layout: commandKey });
            modalService.closeModal('gallery_layout');
          }}
        />
      ))}
      Icon={SelectedLayoutIcon}
      tooltip={t('GalleryPlugin_Layout_Select_Tooltip')}
    />
  );
};
