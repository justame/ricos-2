import React, { useContext } from 'react';
import type { FC } from 'react';
import { ToggleButton } from '../../components';
import { RicosContext } from 'ricos-context';
import { TrashIcon } from '../../icons';
import type { IToolbarItem } from 'ricos-types';

interface Props {
  toolbarItem: IToolbarItem;
}

const DeleteButton: FC<Props> = ({ toolbarItem }) => {
  const { t } = useContext(RicosContext) || {};
  return (
    <ToggleButton
      Icon={TrashIcon}
      onClick={toolbarItem.commands.delete}
      dataHook="blockButton_delete"
      tooltip={t('DeleteButton_Tooltip')}
    />
  );
};

export default DeleteButton;
