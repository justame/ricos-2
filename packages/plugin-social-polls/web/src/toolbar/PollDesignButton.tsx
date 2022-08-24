import React, { useContext } from 'react';
import type { FC } from 'react';
import { RicosContext } from 'ricos-context';
import type { IToolbarItem } from 'ricos-types';
import { ToggleButton } from 'wix-rich-content-toolbars-ui';
import DesignIcon from '../assets/icons/DesignIcon';

type Props = {
  toolbarItem: IToolbarItem;
  dataHook?: string;
};

export const PollDesignButton: FC<Props> = ({ toolbarItem, dataHook }) => {
  const { t, isMobile } = useContext(RicosContext) || {};

  return (
    <ToggleButton
      Icon={DesignIcon}
      onClick={() => toolbarItem.commands?.click({ isMobile })}
      dataHook={dataHook}
      tooltip={t('Poll_PollSettings_Tab_Design_TabName')}
    />
  );
};
