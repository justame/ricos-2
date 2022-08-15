import React, { useContext } from 'react';
import type { FC } from 'react';
import { RicosContext } from 'ricos-context';
import { RowHeader, ColumnHeader } from '../../icons';
import type { IToolbarItem } from 'ricos-types';
import { ToggleButton } from 'wix-rich-content-toolbars-ui';

interface Props {
  toolbarItem: IToolbarItem;
  type: 'row' | 'column';
  dataHook?: string;
}

const HeaderButton: FC<Props> = ({ dataHook, toolbarItem, type }) => {
  const { t } = useContext(RicosContext) || {};

  return (
    <ToggleButton
      Icon={type === 'row' ? RowHeader : ColumnHeader}
      onClick={toolbarItem.commands.click}
      dataHook={dataHook}
      tooltip={t('TablePlugin_Toolbar_Header_Tooltip')}
    />
  );
};

export default HeaderButton;
