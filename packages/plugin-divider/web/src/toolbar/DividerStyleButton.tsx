import React, { useContext } from 'react';
import type { FC, ComponentType } from 'react';
import { RicosContext } from 'ricos-context';
import type { IToolbarItem } from 'ricos-types';
import { DropdownButton, ListItemSelect } from 'wix-rich-content-toolbars-ui';
import { dividerStyleData } from './dividerButtonsData';
import { SingleLineStyle } from '../icons';

type Props = {
  toolbarItem: IToolbarItem;
};

export const DividerStyleButton: FC<Props> = ({ toolbarItem }) => {
  const { t } = useContext(RicosContext) || {};

  const nodeStyle = toolbarItem?.attributes.nodeStyle;
  const selectedStyle = (nodeStyle as string) || 'SINGLE';
  const SelectedStyleIcon =
    dividerStyleData.find(({ commandKey }) => commandKey === selectedStyle)?.icon ||
    SingleLineStyle;

  return (
    <DropdownButton
      dataHook={'baseToolbarButton_type'}
      id={'divider_style'}
      options={dividerStyleData.map(({ dataHook, icon: Icon, commandKey }) => (
        <ListItemSelect
          key={commandKey}
          dataHook={dataHook}
          prefix={<Icon />}
          selected={commandKey === selectedStyle}
          onClick={() => toolbarItem.commands?.click({ lineStyle: commandKey })}
        />
      ))}
      Icon={() => <SelectedStyleIcon width={'37px'} />}
      tooltip={t('DividerPlugin_SelectType_Tooltip')}
    />
  );
};
