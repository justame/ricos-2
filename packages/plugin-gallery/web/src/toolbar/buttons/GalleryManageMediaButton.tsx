import React, { useContext } from 'react';
import type { FC } from 'react';
import { RicosContext } from 'ricos-context';
import type { IToolbarItem } from 'ricos-types';
import { ToggleButton } from 'wix-rich-content-toolbars-ui';
import { ManageMediaNewIcon } from '../../icons';

interface Props {
  toolbarItem: IToolbarItem;
  dataHook?: string;
}

const GalleryManageMediaButton: FC<Props> = ({ toolbarItem, dataHook }) => {
  const { isMobile, t } = useContext(RicosContext) || {};
  const onClick = toolbarItem.commands.click;
  const node = toolbarItem.attributes.selectedNode;

  return (
    <ToggleButton
      Icon={ManageMediaNewIcon}
      label={t('GallerySettings_Toolbar_Button_MangeMedia')}
      onClick={() => onClick({ isMobile, node })}
      dataHook={dataHook}
      tooltip={t('ManageMediaButton_Tooltip')}
    />
  );
};

export default GalleryManageMediaButton;
