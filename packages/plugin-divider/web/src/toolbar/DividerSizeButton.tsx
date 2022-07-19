import React, { useContext } from 'react';
import type { FC, ComponentType } from 'react';
import { RicosContext, ModalContext } from 'ricos-context';
import type { IToolbarItem } from 'ricos-types';
import { DropdownButton, ListItemSelect } from 'wix-rich-content-toolbars-ui';
import { dividerSizeData } from './dividerButtonsData';

type Props = {
  toolbarItem: IToolbarItem;
};

export const DividerSizeButton: FC<Props> = ({ toolbarItem }) => {
  const { t } = useContext(RicosContext) || {};
  const modalService = useContext(ModalContext) || {};

  const nodeSize = toolbarItem?.attributes.nodeSize;
  const selectedSize = (nodeSize as string) || 'CONTENT';
  const SelectedSizeIcon = dividerSizeData.find(({ commandKey }) => commandKey === selectedSize)
    ?.icon as ComponentType;

  return (
    <DropdownButton
      dataHook={'baseToolbarButton_type'}
      id={'divider_size'}
      options={dividerSizeData.map(({ dataHook, icon: Icon, text, commandKey, tooltip }) => (
        <ListItemSelect
          key={commandKey}
          dataHook={dataHook}
          prefix={<Icon />}
          title={t(text)}
          selected={commandKey === selectedSize}
          tooltip={t(tooltip)}
          onClick={() => {
            modalService.closeModal('divider_size');
            toolbarItem.commands?.click({ size: commandKey });
          }}
        />
      ))}
      Icon={SelectedSizeIcon}
      tooltip={t('ButtonModal_Size_Section')}
    />
  );
};
