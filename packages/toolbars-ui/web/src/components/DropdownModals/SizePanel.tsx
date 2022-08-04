import React, { useContext } from 'react';
import { RicosContext } from 'ricos-context';
import type { PluginContainerData_Width_Type } from 'ricos-schema';
import { KEYS_CHARCODE } from 'wix-rich-content-editor-common';
import { defaultSize, sizeMap } from '../../buttons/NodeSizeButton/consts';
import { ListItemSelect } from '../ListItem';
import DropdownModal from './DropdownModal';

type Props = {
  getSelectedSize: () => string;
  onClick: (commandKey: string) => void;
  options?: PluginContainerData_Width_Type[];
};

const SizePanel: React.FC<Props> = ({ getSelectedSize, onClick, options }) => {
  const { t } = useContext(RicosContext) || {};
  const OPTIONS = options ? options.map(option => sizeMap[option]) : defaultSize;

  const onKeyDown = (e, commandKey) => {
    if (e.keyCode === KEYS_CHARCODE.ENTER) {
      onClick(commandKey);
      e.stopPropagation();
    }
  };

  const DropdownOptions = OPTIONS.map(({ dataHook, icon: Icon, text, commandKey, tooltip }) => (
    <ListItemSelect
      key={commandKey}
      dataHook={dataHook}
      prefix={<Icon />}
      title={t(text)}
      selected={commandKey === getSelectedSize()}
      onKeyDown={e => {
        onKeyDown(e, commandKey);
      }}
      tooltip={t(tooltip)}
      onClick={() => onClick(commandKey)}
    />
  ));

  return <DropdownModal options={DropdownOptions} />;
};

export default SizePanel;
