import React, { useContext } from 'react';
import { RicosContext } from 'ricos-context';
import type { PluginContainerData_Width_Type } from 'ricos-schema';
import { KEYS_CHARCODE } from 'wix-rich-content-editor-common';
import { DropdownModal, ListItemSelect } from 'wix-rich-content-toolbars-ui';
import { dividerSizeData } from '../buttons/dividerButtonsData';

type Props = {
  getSelectedSize: () => string;
  onClick: (commandKey: string) => void;
  options?: PluginContainerData_Width_Type[];
};

const DividerSizePanel: React.FC<Props> = ({ getSelectedSize, onClick }) => {
  const { t } = useContext(RicosContext) || {};

  const onKeyDown = (e, commandKey) => {
    if (e.keyCode === KEYS_CHARCODE.ENTER) {
      onClick(commandKey);
      e.stopPropagation();
    }
  };

  const DropdownOptions = dividerSizeData.map(
    ({ dataHook, icon: Icon, text, commandKey, tooltip }) => (
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
    )
  );

  return <DropdownModal options={DropdownOptions} />;
};

export default DividerSizePanel;
