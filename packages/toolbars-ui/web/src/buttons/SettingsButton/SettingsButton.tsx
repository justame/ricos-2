import React, { useContext } from 'react';
import type { FC } from 'react';
import { ToggleButton } from '../../components';
import { RicosContext, ModalContext, UploadContext } from 'ricos-context';
import { SettingsIcon } from '../../icons';
import type { IToolbarItem } from 'ricos-types';

interface Props {
  toolbarItem: IToolbarItem;
  dataHook?: string;
}

const SettingsButton: FC<Props> = ({ toolbarItem, dataHook }) => {
  const modalService = useContext(ModalContext) || {};
  const { isMobile, t } = useContext(RicosContext) || {};
  const { uploadService, updateService } = useContext(UploadContext);
  const onClick = toolbarItem.commands.click;
  const node = toolbarItem.attributes.selectedNode;

  return (
    <ToggleButton
      Icon={SettingsIcon}
      onClick={() => onClick({ modalService, isMobile, node, uploadService, updateService })}
      dataHook={dataHook}
      tooltip={t('SettingsButton_Tooltip')}
    />
  );
};

export default SettingsButton;
