import React, { useContext } from 'react';
import type { FC } from 'react';
import { RicosContext, ModalContext } from 'ricos-context';
import type { IToolbarItem } from 'ricos-types';
import { DropdownButton, ListItemSelect } from 'wix-rich-content-toolbars-ui';
import { dividerStyleData } from './dividerButtonsData';
import { SingleLineStyle } from '../icons';

type Props = {
  toolbarItem: IToolbarItem;
  dataHook?: string;
};

export const DividerStyleButton: FC<Props> = ({ toolbarItem, dataHook }) => {
  const { t } = useContext(RicosContext) || {};
  const modalService = useContext(ModalContext) || {};

  const nodeStyle = toolbarItem?.attributes.nodeStyle;
  const selectedStyle = (nodeStyle as string) || 'SINGLE';
  const SelectedStyleIcon =
    dividerStyleData.find(({ commandKey }) => commandKey === selectedStyle)?.icon ||
    SingleLineStyle;

  return (
    <DropdownButton
      dataHook={dataHook}
      id={'divider_style'}
      options={dividerStyleData.map(({ dataHook, icon: Icon, commandKey }) => (
        <ListItemSelect
          key={commandKey}
          dataHook={dataHook}
          prefix={<Icon />}
          selected={commandKey === selectedStyle}
          onClick={() => {
            modalService.closeModal('divider_size');
            toolbarItem.commands?.click({ lineStyle: commandKey });
          }}
        />
      ))}
      Icon={() => <SelectedStyleIcon width={'37px'} />}
      tooltip={t('DividerPlugin_SelectType_Tooltip')}
    />
  );
};
