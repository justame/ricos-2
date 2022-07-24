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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const node = (toolbarItem.attributes as Record<string, any>).selectedNode;

  const nodeId = node?.attrs.id;
  return (
    <ToggleButton
      Icon={TrashIcon}
      onClick={() => toolbarItem.commands.delete(nodeId)}
      dataHook="blockButton_delete"
      tooltip={t('DeleteButton_Tooltip')}
    />
  );
};

export default DeleteButton;
