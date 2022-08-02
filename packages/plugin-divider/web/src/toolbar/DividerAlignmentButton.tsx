import React, { useContext } from 'react';
import type { FC } from 'react';
import { RicosContext, ModalContext } from 'ricos-context';
import type { PluginContainerData_Alignment } from 'ricos-schema';
import type { IToolbarItem } from 'ricos-types';
import { DropdownButton, ListItemSelect } from 'wix-rich-content-toolbars-ui';
import { alignmentMap, alignmentsMap, defaultAlignments } from './dividerButtonsData';

const getDefaultAlignment = langDir => {
  return langDir === 'rtl' ? 'RIGHT' : 'LEFT';
};

type Props = {
  toolbarItem: IToolbarItem;
  options?: PluginContainerData_Alignment[];
  dataHook?: string;
};

export const DividerAlignmentButton: FC<Props> = ({ options, toolbarItem, dataHook }) => {
  const { t, languageDir } = useContext(RicosContext) || {};
  const modalService = useContext(ModalContext) || {};
  const node = toolbarItem.attributes.selectedNode;
  const nodeAlignment = toolbarItem?.attributes.nodeAlignment;
  const selectedAlignment = (nodeAlignment as string) || getDefaultAlignment(languageDir);
  const SelectedAlignmentIcon = alignmentMap[`${selectedAlignment}`];

  const dropDownOptions = options
    ? options.map(option => alignmentsMap[option])
    : defaultAlignments;

  return (
    <DropdownButton
      dataHook={dataHook}
      id="dividerAlignment"
      options={dropDownOptions.map(({ dataHook, icon: Icon, text, commandKey, tooltip }) => (
        <ListItemSelect
          key={commandKey}
          dataHook={dataHook}
          prefix={<Icon />}
          title={t(text)}
          selected={commandKey === selectedAlignment}
          tooltip={t(tooltip)}
          onClick={() => {
            modalService.closeModal('dividerAlignment');
            toolbarItem.commands?.click({ alignment: commandKey, node });
          }}
        />
      ))}
      Icon={SelectedAlignmentIcon}
      tooltip={t('TextAlignmentButton_Tooltip')}
    />
  );
};
