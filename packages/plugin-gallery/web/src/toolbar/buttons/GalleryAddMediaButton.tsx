import React, { useContext } from 'react';
import type { FC } from 'react';
import { RicosContext } from 'ricos-context';
import type { IToolbarItem } from 'ricos-types';
import { ToggleButton } from 'wix-rich-content-toolbars-ui';
import { AddMediaIcon } from '../../icons';

type Props = {
  toolbarItem: IToolbarItem;
  dataHook?: string;
};

const GalleryAddMediaButton: FC<Props> = ({ toolbarItem, dataHook }) => {
  const { t, isMobile } = useContext(RicosContext) || {};
  const node = toolbarItem.attributes.selectedNode;
  const onClick = () => toolbarItem.commands.click({ node, isMobile });

  return (
    <ToggleButton
      Icon={AddMediaIcon}
      onClick={onClick}
      dataHook={dataHook}
      tooltip={t('GallerySettings_Add_Media')}
    />
  );
};

export default GalleryAddMediaButton;
