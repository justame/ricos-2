import React, { useContext } from 'react';
import type { FC, ComponentType } from 'react';
import { RicosContext } from 'ricos-context';
import type { IToolbarItem } from 'ricos-types';
import { DropdownButton, ListItemSelect } from 'wix-rich-content-toolbars-ui';
import { galleryLayoutsData } from './galleryLayoutsData';
import { GALLERY_LAYOUTS } from '../layout-data-provider';

type Props = {
  toolbarItem: IToolbarItem;
};

export const GalleryLayoutButton: FC<Props> = ({ toolbarItem }) => {
  const { t } = useContext(RicosContext) || {};

  const galleryLayout = toolbarItem?.attributes.galleryLayout;
  const selectedLayout = (galleryLayout as string) || GALLERY_LAYOUTS.GRID;
  const SelectedLayoutIcon = galleryLayoutsData.find(
    ({ commandKey }) => commandKey === selectedLayout
  )?.icon as ComponentType;

  return (
    <DropdownButton
      dataHook={'baseToolbarButton_layout'}
      options={galleryLayoutsData.map(({ dataHook, icon: Icon, text, commandKey, tooltip }) => (
        <ListItemSelect
          key={commandKey}
          dataHook={dataHook}
          prefix={<Icon />}
          title={t(text)}
          selected={commandKey === selectedLayout}
          tooltip={t(tooltip)}
          onClick={() => toolbarItem.commands?.click({ layout: commandKey })}
        />
      ))}
      Icon={SelectedLayoutIcon}
      tooltip={t('TextAlignmentButton_Tooltip')}
    />
  );
};
