import React, { useContext } from 'react';
import type { FC } from 'react';
import { RicosContext } from 'ricos-context';
import type { IToolbarItem } from 'ricos-types';
import { ToggleButton, EditIcon } from 'wix-rich-content-toolbars-ui';

type Props = {
  toolbarItem: IToolbarItem;
  dataHook?: string;
};

const AudioEditButton: FC<Props> = ({ toolbarItem, dataHook }) => {
  const { isMobile, t } = useContext(RicosContext) || {};
  const onClick = toolbarItem.commands.click;

  return (
    <ToggleButton
      dataHook={dataHook}
      Icon={EditIcon}
      label={t('AudioPlugin_Toolbar_Edit_Label')}
      tooltip={t('AudioPlugin_Toolbar_Edit_Label')}
      onClick={() => onClick({ isMobile })}
    />
  );
};

export default AudioEditButton;
