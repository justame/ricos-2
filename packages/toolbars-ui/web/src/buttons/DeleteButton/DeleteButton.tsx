import React, { useContext } from 'react';
import type { FC } from 'react';
import { ToggleButton } from '../../components';
import { RicosContext } from 'ricos-context';
import { TrashIcon } from '../../icons';
import type { IToolbarItem } from 'ricos-types';

interface Props {
  toolbarItem: IToolbarItem;
  dataHook?: string;
}

const DeleteButton: FC<Props> = ({ toolbarItem, dataHook }) => {
  const { t } = useContext(RicosContext) || {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  return (
    <ToggleButton
      Icon={TrashIcon}
      onClick={() => toolbarItem.commands.delete()}
      dataHook={dataHook}
      tooltip={t('DeleteButton_Tooltip')}
    />
  );
};

export default DeleteButton;
