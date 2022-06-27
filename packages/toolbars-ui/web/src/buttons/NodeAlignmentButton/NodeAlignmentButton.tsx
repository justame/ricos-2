import React, { useContext } from 'react';
import type { FC } from 'react';
import { getDefaultAlignment, alignmentMap } from './utils';
import { DropdownButton, ListItemSelect } from '../../components';
import { RicosContext } from 'ricos-context';
import type { PluginContainerData_Alignment } from 'ricos-schema';
import type { IToolbarItem } from 'ricos-types';
import { defaultAlignments, alignmentsMap } from './consts';

type Props = {
  toolbarItem: IToolbarItem;
  options?: PluginContainerData_Alignment[];
};

const NodeAlignmentButton: FC<Props> = ({ options, toolbarItem }) => {
  const { t, languageDir } = useContext(RicosContext) || {};

  const nodeAlignment = toolbarItem?.attributes.nodeAlignment;
  const selectedAlignment = (nodeAlignment as string) || getDefaultAlignment(languageDir);
  const SelectedAlignmentIcon = alignmentMap[`${selectedAlignment}`];

  const dropDownOptions = options
    ? options.map(option => alignmentsMap[option])
    : defaultAlignments;

  return (
    <DropdownButton
      dataHook={'nodeAlignmentButton'}
      options={dropDownOptions.map(({ dataHook, icon: Icon, text, commandKey, tooltip }) => (
        <ListItemSelect
          key={commandKey}
          dataHook={dataHook}
          prefix={<Icon />}
          title={t(text)}
          selected={commandKey === selectedAlignment.toLowerCase()}
          tooltip={t(tooltip)}
          onClick={() => toolbarItem.commands?.setAlignment(commandKey.toUpperCase())}
        />
      ))}
      Icon={SelectedAlignmentIcon}
      tooltip={t('TextAlignmentButton_Tooltip')}
    />
  );
};

export default NodeAlignmentButton;
