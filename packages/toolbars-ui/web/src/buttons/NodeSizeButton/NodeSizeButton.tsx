import React, { useContext } from 'react';
import type { FC } from 'react';
import { DropdownButton, ListItemSelect } from '../../components';
import { RicosContext, ModalContext } from 'ricos-context';
import type { PluginContainerData_Width_Type } from 'ricos-schema';
import type { IToolbarItem } from 'ricos-types';
import { defaultSize, sizeMap, sizeIconMap } from './consts';

type Props = {
  toolbarItem: IToolbarItem;
  options?: PluginContainerData_Width_Type[];
};

const NodeSizeButton: FC<Props> = ({ options, toolbarItem }) => {
  const { t } = useContext(RicosContext) || {};
  const modalService = useContext(ModalContext) || {};

  const nodeSize = toolbarItem?.attributes.nodeSize;
  const selectedSize = (nodeSize as string) || 'CONTENT';
  const SelectedSizeIcon = sizeIconMap[`${selectedSize}`];

  const dropDownOptions = options ? options.map(option => sizeMap[option]) : defaultSize;

  return (
    <DropdownButton
      dataHook={'NodeSizeButton'}
      id={'NodeSizeButton'}
      options={dropDownOptions.map(({ dataHook, icon: Icon, text, commandKey, tooltip }) => (
        <ListItemSelect
          key={commandKey}
          dataHook={dataHook}
          prefix={<Icon />}
          title={t(text)}
          selected={commandKey === selectedSize}
          tooltip={t(tooltip)}
          onClick={() => {
            modalService.closeModal('NodeSizeButton');
            toolbarItem.commands?.setSize(commandKey);
          }}
        />
      ))}
      Icon={SelectedSizeIcon}
      tooltip={t('ButtonModal_Size_Section')}
    />
  );
};

export default NodeSizeButton;
