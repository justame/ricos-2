import React, { useContext } from 'react';
import type { FC } from 'react';
import { RicosContext } from 'ricos-context';
import { BGColorIcon } from '../../icons';
import type { IToolbarItem } from 'ricos-types';
import { ToggleButton } from 'wix-rich-content-toolbars-ui';

interface Props {
  toolbarItem: IToolbarItem;
  dataHook?: string;
}

const BackgroundColorButton: FC<Props> = ({ dataHook, toolbarItem }) => {
  const { t } = useContext(RicosContext) || {};
  const onClick = () => toolbarItem.commands.click({ backgroundColor: 'pink' });

  return (
    <ToggleButton
      Icon={BGColorIcon}
      onClick={onClick}
      dataHook={dataHook}
      tooltip={t('TablePlugin_Toolbar_BGColor_Tooltip')}
    />
  );
};

export default BackgroundColorButton;
